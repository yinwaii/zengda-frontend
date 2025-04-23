<template>
		<design-project-configuration-selector 
		:project="project"
		v-model:selectedConfigId="selectedConfigId"
		v-model:configurations="configurations"
	/>
	<div class="p-4 h-full">
	<div v-if="pageLoading" class="flex items-center justify-center h-full">
				<div class="animate-pulse flex space-x-4">
					<div class="rounded-full bg-accent-foreground/10 h-10 w-10"></div>
					<div class="flex-1 space-y-3 py-1">
						<div class="h-2 bg-accent-foreground/10 rounded"></div>
						<div class="space-y-1">
							<div class="h-2 bg-accent-foreground/10 rounded"></div>
						</div>
					</div>
					</div>
				</div>
				
	<design-dynamic-entity-tree
		v-else
		:tree-data="projectTreeData"
		tree-title="项目详情"
		:default-expanded-keys="expandedKeys"
		@node-click="handleNodeClick"
		@node-toggle="handleNodeToggle"
		@save="handleSave"
		@create="handleCreate"
		class="h-full"
	>
		<template #detail-top="{ node }">
			<div class="mb-4">
				<!-- 组件配置卡片 -->
				<shadcn-card v-if="node?.type === NODE_TYPES.COMPONENT && selectedConfigId" class="shadow-none mb-4">
					<shadcn-card-header class="py-2">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-medium">组件配置</h3>
						</div>
					</shadcn-card-header>
					<shadcn-card-content class="py-2">
						<div class="flex flex-col gap-4">
							<div class="flex items-center justify-between">
								<Label>启用组件</Label>
								<Switch v-model="componentEnabled" @update:modelValue="handleComponentConfigChange" />
							</div>
							<div class="flex items-center justify-between">
								<Label>组件数量</Label>
								<div class="flex items-center gap-2">
									<Button 
										variant="outline" 
										size="icon"
										@click="handleQuantityChange(-1)"
										:disabled="componentQuantity <= 1"
									>
										<Minus class="h-4 w-4" />
									</Button>
									<Input 
										type="number" 
										v-model="componentQuantity" 
										class="w-20 text-center"
										min="1"
										@change="handleComponentConfigChange"
									/>
									<Button 
										variant="outline" 
										size="icon"
										@click="handleQuantityChange(1)"
									>
										<Plus class="h-4 w-4" />
									</Button>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<Label>BOM配置</Label>
								<div class="flex items-center gap-2">
									<shadcn-select v-model="selectedBomId" @update:modelValue="handleBomChange">
										<shadcn-select-trigger class="w-[180px]">
											<shadcn-select-value placeholder="请选择BOM" />
										</shadcn-select-trigger>
										<shadcn-select-content>
											<shadcn-select-item v-for="bom in bomOptions" :key="bom.id" :value="bom.id">
												{{ bom.name || `BOM ${bom.id}` }}
											</shadcn-select-item>
										</shadcn-select-content>
									</shadcn-select>
								</div>
							</div>
						</div>
						<div class="mt-4 flex justify-end">
							<Button size="sm" variant="outline" @click="handleSaveComponentConfig">
								保存配置
							</Button>
						</div>
					</shadcn-card-content>
				</shadcn-card>

				<shadcn-card v-if="node && selectedConfigId" class="shadow-none">
					<shadcn-card-header class="py-2">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-medium">节点参数配置</h3>
							<Button size="sm" variant="outline" @click="handleAddArgument">
								<LucidePlus class="h-4 w-4 mr-1" />
								新增参数
							</Button>
						</div>
					</shadcn-card-header>
					<shadcn-card-content class="py-2">
						<abstract-data-table 
							v-if="nodeArguments.length > 0"
							:columns="argumentColumns" 
							:data="nodeArguments"
							searchColumn="name"
							searchPlaceholder="搜索参数名称..."
						/>
						<div v-else class="text-center py-4 text-muted-foreground">
							暂无参数配置
						</div>
					</shadcn-card-content>
				</shadcn-card>
			</div>
		</template>
	</design-dynamic-entity-tree>
	</div>
	
	<!-- 配置生成对话框 -->
		<design-configuration-dialog 
			:modelValue="isConfigDialogOpen"
			@update:modelValue="isConfigDialogOpen = $event"
			:project-id="projectId"
			:editing-item="editingConfigItem"
			@submit="handleConfigSubmit"
	/>

	<!-- 参数编辑对话框 -->
	<design-argument-dialog
		:modelValue="isArgumentDialogOpen"
		@update:modelValue="isArgumentDialogOpen = $event"
		:editingItem="editingArgument"
		@submit="handleArgumentSubmit"
	/>

	<!-- 确认删除参数对话框 -->
	<shadcn-alert-dialog v-model:open="showDeleteArgConfirm">
		<shadcn-alert-dialog-content>
			<shadcn-alert-dialog-header>
				<shadcn-alert-dialog-title>确认删除参数</shadcn-alert-dialog-title>
				<shadcn-alert-dialog-description>
					您确定要删除此参数吗？此操作不可撤销。
				</shadcn-alert-dialog-description>
			</shadcn-alert-dialog-header>
			<shadcn-alert-dialog-footer>
				<shadcn-alert-dialog-cancel>取消</shadcn-alert-dialog-cancel>
				<shadcn-alert-dialog-action @click="confirmDeleteArgument">删除</shadcn-alert-dialog-action>
			</shadcn-alert-dialog-footer>
		</shadcn-alert-dialog-content>
	</shadcn-alert-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useRoute } from 'vue-router'
import { useEntityTree } from '~/composables/use-entity-tree'
import { useEntityHandlers } from '~/composables/use-entity-handlers'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdConfiguration } from '~/models/entity/configuration'
import { toApiId } from '~/utils/idConverter'
import type { ZdProject } from '~/models/entity/project'
import type { ZdParameter } from '~/models/entity/parameter'
import { LucidePlus, LucidePencil, LucideTrash, Minus, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { NODE_TYPES } from '~/models/entity/node-types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Copy, Package, Settings } from 'lucide-vue-next'

// 添加 keepalive 配置
definePageMeta({
	name: 'project-detail',
	// 禁用缓存，减少内存占用
	keepalive: false,
	// 禁用页面过渡动画
	pageTransition: false,
	layout: 'default'
})

// 通过路由获取项目ID
const route = useRoute()
const projectId = computed(() => Number(route.params.id))

// 添加 project 对象
const project = computed(() => {
	// 获取项目详情
	const projectDetail = projectTreeData.value[0]?.originalData
	return {
		id: projectId.value.toString(),
		templateId: projectDetail?.templateId || 0
	}
})

const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 项目树数据
const projectTreeData = ref<TreeNodeData[]>([])

// 添加页面初始加载状态
const pageLoading = ref(true)

// 配置对话框状态
const isConfigDialogOpen = ref(false)
const editingConfigItem = ref<ZdConfiguration | undefined>(undefined)
const projectConfiguration = ref<ZdConfiguration | null>(null)

// 默认展开的节点
const expandedKeys = ref<(string | number)[]>([])

// 添加配置选择器组件
const selectedConfigId = ref<number | null>(null)
const configurations = ref<ZdConfiguration[]>([])

// 节点参数相关状态
const nodeArguments = ref<any[]>([])
const argumentColumns = ref([
	{
		accessorKey: 'name',
		header: '参数名称',
	},
	{
		accessorKey: 'type',
		header: '类型',
	},
	{
		accessorKey: 'value',
		header: '值',
	},
	{
		accessorKey: 'actions',
		header: '操作',
		cell: ({ row }: { row: any }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h(Button, {
					size: 'icon',
					variant: 'ghost',
					onClick: () => handleEditArgument(row.original)
				}, () => h(LucidePencil, { class: 'h-4 w-4' })),
				h(Button, {
					size: 'icon',
					variant: 'ghost',
					onClick: () => handleDeleteArgument(row.original)
				}, () => h(LucideTrash, { class: 'h-4 w-4' }))
			])
		}
	}
])

// 添加当前选中节点的状态
const currentNode = ref<TreeNodeData | null>(null)

// 参数对话框状态
const isArgumentDialogOpen = ref(false)
const editingArgument = ref<ZdParameterArgument | undefined>(undefined)
const showDeleteArgConfirm = ref(false)
const argumentToDelete = ref<ZdParameterArgument | null>(null)

// 在script setup部分添加
const selectedBomId = ref<number | null>(null)
const bomOptions = ref<any[]>([])
const bomDebugInfo = ref(false)

// 添加组件配置相关状态
const componentEnabled = ref(true)
const componentQuantity = ref(1)
const componentConfiguration = ref<any>(null)

/**
 * 打开配置对话框
 */
const openConfigDialog = (config?: ZdConfiguration) => {
	editingConfigItem.value = config
	isConfigDialogOpen.value = true
}

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
	console.log('保存数据:', data, '节点类型:', nodeType)
	// 直接传递接收到的数据，不进行任何处理
	return entityHandlers.handleSave(data, nodeType, loadSpecificProject)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
	console.log('创建数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleCreate(data, nodeType, loadSpecificProject)
}

/**
 * 加载特定项目数据
 */
const loadSpecificProject = async () => {
	pageLoading.value = true
	try {
		console.log('开始加载项目数据...')
		
		// 步骤1: 使用loadProjectById获取项目基本数据
		const { treeData: projectData } = await entityTree.loadProjectById(projectId.value)
		
		if (projectData.length === 0) {
			toast.toast({
				title: "警告",
				description: "无法找到指定项目",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}
		projectTreeData.value = projectData
		
		// 步骤1.5: 显式加载模板数据
		const projectWithTemplate = await entityTree.loadTemplateByProject(projectTreeData.value)
		projectTreeData.value = projectWithTemplate
		console.log('加载模板数据完成', projectWithTemplate)

		const projectWithPSystem = await entityTree.loadPSystemByTemplate(projectTreeData.value)
		projectTreeData.value = projectWithPSystem
		console.log('加载模块数据完成', projectWithPSystem)

		const projectWithTemplateSpecification = await entityTree.loadSpecificationByTemplate(projectTreeData.value)
		projectTreeData.value = projectWithTemplateSpecification
		console.log('加载模板规格书数据完成', projectWithTemplateSpecification)

		const projectWithComponent = await entityTree.loadComponentByPSystem(projectTreeData.value)
		projectTreeData.value = projectWithComponent
		console.log('加载组件数据完成', projectWithComponent)

		const projectWithSpecification = await entityTree.loadSpecificationByPSystem(projectTreeData.value)
		projectTreeData.value = projectWithSpecification
		console.log('加载模块规格书数据完成', projectWithSpecification)

		const projectWithBom = await entityTree.loadBomByComponent(projectTreeData.value)
		projectTreeData.value = projectWithBom
		console.log('加载BOM数据完成', projectWithBom)
			
		// 	// 一次性更新树数据
		// 	projectTreeData.value = completeData
			
			// 设置默认展开根节点和模板节点
		const expandKeys = [projectTreeData.value[0].id]

		handleNodeClick(projectTreeData.value[0])
			// 如果有子节点，将第一层子节点也设为展开
			if (projectTreeData.value[0].children && projectTreeData.value[0].children.length > 0) {
				expandKeys.push(projectTreeData.value[0].children[0].id)
				console.log('设置展开节点:', expandKeys)
			}
			expandedKeys.value = expandKeys
			await loadProjectConfiguration()
			
			toast.toast({
				title: "成功",
				description: "项目数据加载完成",
			})
	} catch (error) {
		console.error('获取项目数据失败:', error)
		toast.toast({
			title: "错误",
			description: "获取项目数据失败",
			variant: "destructive",
		})
	} finally {
		pageLoading.value = false
	}
}

/**
 * 处理节点点击
 */
const handleNodeClick = (node: TreeNodeData) => {
	console.log('节点点击:', node)
	currentNode.value = node
	
	// 如果是组件节点，加载组件配置和BOM选项
	if (node.type === NODE_TYPES.COMPONENT) {
		const componentId = toApiId(node.id)
		if (componentId) {
			loadComponentConfiguration()
			loadBomOptions(componentId)
		}
	}
	
	// 加载节点参数
	loadNodeArguments(node)
}

/**
 * 处理节点展开/折叠
 */
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
	console.log('节点切换:', node, expanded ? '展开' : '折叠')
	// 这里可以添加额外的处理逻辑
}

/**
 * 加载项目配置
 */
const loadProjectConfiguration = async () => {
	if (!projectId.value) return
	
	try {
		const project = await entityApis.project.get(projectId.value)
		if (!project || !project.templateId) return
		
		// 使用toApiId转换项目ID为纯数字
		const projectNumericId = toApiId(projectId.value)
		if (projectNumericId === null) {
			console.error('无法将项目ID转换为有效的数字ID')
			return
		}
		
		const configList = await entityApis.configuration.getByTemplateId(
			project.templateId,
			projectNumericId
		)
		
		if (configList && configList.list && configList.list.length > 0) {
			// 获取第一个配置作为当前项目配置
			projectConfiguration.value = configList.list[0]
		} else {
			projectConfiguration.value = null
		}
	} catch (error) {
		console.error('加载项目配置失败:', error)
		projectConfiguration.value = null
	}
}

/**
 * 处理配置提交
 */
const handleConfigSubmit = async (configuration: ZdConfiguration) => {
	try {
		// 如果有ID则更新，否则创建
		if (configuration.id) {
			await entityApis.configuration.update(configuration)
			toast.toast({
				title: "成功",
				description: "更新配置成功",
			})
		} else {
			// 创建时使用纯数字ID
			const projectNumericId = toApiId(projectId.value)
			// 确保项目ID是有效的数字
			if (projectNumericId === null) {
				throw new Error('无法将项目ID转换为有效的数字ID')
			}
			
			const configWithCorrectId = {
				...configuration,
				project_id: projectNumericId
			}
			await entityApis.configuration.create(configWithCorrectId)
			toast.toast({
				title: "成功",
				description: "创建配置成功",
			})
		}
		
		// 重新加载项目树数据
		await loadSpecificProject()
		
		// 关闭对话框
		isConfigDialogOpen.value = false
	} catch (error) {
		console.error('保存配置失败:', error)
		toast.toast({
			title: "错误",
			description: "保存配置失败",
			variant: "destructive",
		})
	}
}

/**
 * 手动加载配置
 */
const handleLoadConfiguration = async () => {
	await loadProjectConfiguration()
	toast.toast({
		title: "成功",
		description: "重新加载配置成功",
	})
}

// 加载节点参数
const loadNodeArguments = async (node: TreeNodeData) => {
	if (!selectedConfigId.value || !node?.id) {
		nodeArguments.value = []
		return
	}

	try {
		// 解析节点ID，确保id是字符串类型
		const nodeId = node.id.toString()
		const [objectType, objectId] = nodeId.split(':')
		if (!objectType || !objectId) {
			nodeArguments.value = []
			return
		}

		console.log('加载节点参数:', {
			configId: selectedConfigId.value,
			objectType,
			objectId
		})

		// 1. 获取模板参数定义
		const parameters = await entityApis.parameter.get(objectId, objectType.toLowerCase())
		
		// 2. 尝试获取现有的参数配置
		let response
		try {
			response = await entityApis.argument.get(
				selectedConfigId.value,
				objectType.toLowerCase(),
				objectId
			)
			// 过滤掉每个参数中的 paramId 字段
			if (response && response.arguments) {
				response.arguments = response.arguments.map((arg: any) => {
					const { paramId, ...rest } = arg
					return rest
				})
			}
		} catch (error) {
			console.warn('获取现有参数配置失败，将创建新的参数配置:', error)
			response = null
		}
		

		console.log('获取现有参数配置:', response)

		// 3. 创建或获取参数对象
		let argumentObject = response || {
			objectType: objectType.toLowerCase(),
			objectId,
			arguments: [],
			children: []
		}

		// 4. 记录补全前的状态
		console.log('补全前的参数:', {
			existingArguments: argumentObject.arguments,
			templateParameters: parameters
		})

		// 5. 比对并补全缺失的参数
		if (parameters && parameters.length > 0) {
			const existingArgNames = new Set(argumentObject.arguments.map((arg: any) => arg.name))
			const missingParameters = parameters.filter((param: any) => !existingArgNames.has(param.name))

			if (missingParameters.length > 0 || !response) {
				console.log('发现缺失的参数:', missingParameters)

				// 补全缺失的参数
				const newArguments = missingParameters.map((param: any) => ({
					name: param.name,
					type: param.dtype,
					value: param.value || '' // 使用模板参数中的默认值
				}))

				// 合并现有参数和新参数
				argumentObject.arguments = [...argumentObject.arguments, ...newArguments]

				// 6. 记录补全后的状态
				console.log('补全后的参数:', argumentObject.arguments)

				// 7. 更新到服务器
				try {
					if (!response) {
						// 如果之前没有参数配置，使用 create
						await entityApis.argument.create(selectedConfigId.value, argumentObject)
						console.log('参数已创建到服务器')
					} else {
						// 如果已有参数配置，使用 update
						await entityApis.argument.update(selectedConfigId.value, argumentObject)
						console.log('参数已更新到服务器')
					}
				} catch (error) {
					console.error('保存参数到服务器失败:', error)
					toast.toast({
						title: '错误',
						description: '保存参数到服务器失败',
						variant: 'destructive'
					})
				}
			}
		}

		// 8. 更新本地状态
		nodeArguments.value = argumentObject.arguments || []
		console.log('节点参数加载完成:', nodeArguments.value)
	} catch (error) {
		console.error('加载节点参数失败:', error)
		toast.toast({
			title: '错误',
			description: '加载节点参数失败',
			variant: 'destructive'
		})
		nodeArguments.value = []
	}
}

// 监听节点变化
watch(() => selectedConfigId.value, () => {
	if (selectedConfigId.value && currentNode.value) {
		// 重新加载当前节点的参数
		loadNodeArguments(currentNode.value)
	} else {
		nodeArguments.value = []
	}
})

// 处理新增参数
const handleAddArgument = () => {
	editingArgument.value = undefined
	isArgumentDialogOpen.value = true
}

// 处理编辑参数
const handleEditArgument = (arg: ZdParameterArgument) => {
	editingArgument.value = arg
	isArgumentDialogOpen.value = true
}

// 处理删除参数
const handleDeleteArgument = (arg: ZdParameterArgument) => {
	argumentToDelete.value = arg
	showDeleteArgConfirm.value = true
}

// 确认删除参数
const confirmDeleteArgument = async () => {
	if (!argumentToDelete.value || !currentNode.value) return

	try {
		// 从参数列表中移除要删除的参数
		const updatedArguments = nodeArguments.value.filter(
			arg => arg.id !== argumentToDelete.value?.id
		)

		// 更新对象参数
		const updatedObjectArgument = {
			objectType: currentNode.value.type?.toLowerCase() || '',
			objectId: toApiId(currentNode.value.id)?.toString() || '',
			arguments: updatedArguments,
			children: []
		}

		// 保存到服务器
		await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)

		// 更新本地状态
		nodeArguments.value = updatedArguments

		toast.toast({
			title: '成功',
			description: '参数已删除'
		})

		// 关闭确认对话框
		showDeleteArgConfirm.value = false
		argumentToDelete.value = null
	} catch (error) {
		console.error('删除参数失败:', error)
		toast.toast({
			title: '错误',
			description: '删除参数失败',
			variant: 'destructive'
		})
	}
}

// 处理参数提交
const handleArgumentSubmit = async (argument: ZdParameterArgument) => {
	if (!currentNode.value) return

	try {
		// 创建或更新参数对象
		const updatedArguments = [...nodeArguments.value]
		const existingIndex = updatedArguments.findIndex(arg => arg.name === argument.name)

		// 创建一个不包含 paramId 的新参数对象
		const cleanArgument = {
			id: argument.id,
			name: argument.name,
			type: argument.type,
			value: argument.value
		}

		if (existingIndex >= 0) {
			// 更新现有参数
			updatedArguments[existingIndex] = cleanArgument
		} else {
			// 添加新参数
			updatedArguments.push(cleanArgument)
		}

		console.log('更新参数:', updatedArguments)

		// 更新对象参数
		const updatedObjectArgument = {
			objectType: currentNode.value.type?.toLowerCase() || '',
			objectId: toApiId(currentNode.value.id)?.toString() || '',
			arguments: updatedArguments,
			children: []
		}

		// 保存到服务器
		await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)

		// 更新本地状态
		nodeArguments.value = updatedArguments

		toast.toast({
			title: '成功',
			description: `参数已${existingIndex >= 0 ? '更新' : '创建'}`
		})
	} catch (error) {
		console.error('保存参数失败:', error)
		toast.toast({
			title: '错误',
			description: '保存参数失败',
			variant: 'destructive'
		})
	}
}

// 加载BOM选项
const loadBomOptions = async (componentId: number) => {
	try {
		const bomIds = await entityApis.bom.getByComponentId(componentId)
		if (!bomIds || bomIds.length === 0) {
			bomOptions.value = []
			return
		}

		// 并行获取所有BOM的详细信息
		const bomDetailsPromises = bomIds.map((bomId: any) => entityApis.bom.get(bomId))
		const bomDetails = await Promise.all(bomDetailsPromises)
		
		// 过滤掉可能的null值并更新bomOptions
		bomOptions.value = bomDetails.filter(bom => bom !== null)
		
		console.log('加载BOM选项:', {
			componentId,
			optionsCount: bomOptions.value.length,
			options: bomOptions.value
		})
		
		// 获取组件详情以设置默认BOM
		const component = await entityApis.component.get(componentId)
		console.log('组件详情:', component)
		
		if (component?.bomId) {
			selectedBomId.value = component.bomId
			console.log('设置默认BOM:', component.bomId)
		}
	} catch (error) {
		console.error('加载BOM选项失败:', error)
		toast.toast({
			title: '错误',
			description: '加载BOM选项失败',
			variant: 'destructive'
		})
	}
}

// 处理BOM变更
const handleBomChange = async (value: any) => {
	console.log('BOM选择变更:', value)
	const newBomId = value as number
	if (!currentNode.value || !selectedConfigId.value || !newBomId) return
	
	// 只更新本地状态
	selectedBomId.value = newBomId
}

// 添加确认BOM变更的函数
const confirmBomChange = async () => {
	if (!currentNode.value || !selectedConfigId.value || !selectedBomId.value) {
		toast.toast({
			title: '错误',
			description: '请选择BOM',
			variant: 'destructive'
		})
		return
	}
	
	try {
		const componentId = toApiId(currentNode.value.id)
		if (!componentId) return
		
		console.log('确认BOM变更:', {
			configId: selectedConfigId.value,
			componentId,
			bomId: selectedBomId.value
		})
		
		// 1. 获取当前配置
		const currentConfig = await entityApis.bom_configuration.get(selectedConfigId.value, componentId)
		console.log('当前BOM配置:', currentConfig)
		
		// 2. 如果配置不存在（返回-1），则使用组件的默认BOM创建配置
		if (currentConfig === -1) {
			await entityApis.bom_configuration.create(selectedConfigId.value, componentId, selectedBomId.value)
			toast.toast({
				title: '成功',
				description: 'BOM配置已初始化'
			})
		} else {
			// 3. 如果配置已存在，则更新配置
			await entityApis.bom_configuration.update(selectedConfigId.value, componentId, selectedBomId.value)
			toast.toast({
				title: '成功',
				description: 'BOM配置已更新'
			})
		}
	} catch (error) {
		console.error('更新BOM配置失败:', error)
		toast.toast({
			title: '错误',
			description: '更新BOM配置失败',
			variant: 'destructive'
		})
	}
}

// 加载组件配置
const loadComponentConfiguration = async () => {
	if (!selectedConfigId.value || !currentNode.value) return

	try {
		const componentId = toApiId(currentNode.value.id)
		if (!componentId) return

		// 1. 加载组件配置
		const configList = await entityApis.component_configuration.get(selectedConfigId.value)
		const config = configList.find((item: any) => item.tcomponentId === componentId)

		if (config) {
			componentConfiguration.value = config
			componentEnabled.value = config.enabled
			componentQuantity.value = config.quantity
		} else {
			// 创建新的组件配置
			const newConfig = {
				configId: selectedConfigId.value,
				tcomponentId: componentId,
				enabled: true,
				quantity: 1
			}
			const createdConfig = await entityApis.component_configuration.create(
				selectedConfigId.value,
				newConfig
			)
			componentConfiguration.value = createdConfig
			componentEnabled.value = true
			componentQuantity.value = 1
		}

		// 2. 加载BOM配置
		const bomConfig = await entityApis.bom_configuration.get(selectedConfigId.value, componentId)
		console.log('当前BOM配置:', bomConfig)
		
		// 如果存在BOM配置且不为-1，则更新selectedBomId
		if (bomConfig !== -1) {
			selectedBomId.value = bomConfig
		} else {
			selectedBomId.value = null
		}

	} catch (error) {
		console.error('加载组件配置失败:', error)
		toast.toast({
			title: '错误',
			description: '加载组件配置失败',
			variant: 'destructive'
		})
	}
}

// 处理组件配置变更
const handleComponentConfigChange = () => {
	if (componentConfiguration.value) {
		componentConfiguration.value = {
			...componentConfiguration.value,
			enabled: componentEnabled.value,
			quantity: componentQuantity.value
		}
	}
}

// 处理数量变更
const handleQuantityChange = (delta: number) => {
	const newValue = componentQuantity.value + delta
	if (newValue >= 1) {
		componentQuantity.value = newValue
		handleComponentConfigChange()
	}
}

// 保存组件配置
const handleSaveComponentConfig = async () => {
	if (!componentConfiguration.value || !selectedConfigId.value || !currentNode.value) return

	try {
		// 1. 保存组件配置
		await entityApis.component_configuration.update(
			selectedConfigId.value,
			{
				configId: selectedConfigId.value,
				tcomponentId: toApiId(currentNode.value.id),
				...componentConfiguration.value
			}
		)

		// 2. 如果选择了BOM，保存BOM配置
		if (selectedBomId.value) {
			const componentId = toApiId(currentNode.value.id)
			if (!componentId) return

			// 获取当前BOM配置
			const currentConfig = await entityApis.bom_configuration.get(selectedConfigId.value, componentId)
			
			// 根据是否存在配置决定创建或更新
			if (currentConfig === -1) {
				await entityApis.bom_configuration.create(selectedConfigId.value, componentId, selectedBomId.value)
			} else {
				await entityApis.bom_configuration.update(selectedConfigId.value, componentId, selectedBomId.value)
			}
		}

		toast.toast({
			title: '成功',
			description: '组件配置已保存'
		})
	} catch (error) {
		console.error('保存组件配置失败:', error)
		toast.toast({
			title: '错误',
			description: '保存组件配置失败',
			variant: 'destructive'
		})
	}
}

// 初始化时加载数据
onMounted(async () => {
	await loadSpecificProject()
})

provide('refresh', loadSpecificProject)

// 监听配置对话框关闭
watch(() => isConfigDialogOpen.value, (isOpen) => {
	if (!isOpen) {
		// 对话框关闭后刷新配置
		loadProjectConfiguration()
	}
})
</script> 