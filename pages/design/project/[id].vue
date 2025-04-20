<template>
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
		/>
	</div>
	
	<!-- 配置生成对话框 -->
		<design-configuration-dialog 
			:modelValue="isConfigDialogOpen"
			@update:modelValue="isConfigDialogOpen = $event"
			:project-id="projectId"
			:editing-item="editingConfigItem"
			@submit="handleConfigSubmit"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useRoute } from 'vue-router'
import { useEntityTree } from '@/composables/useEntityTree'
import { useEntityHandlers } from '@/composables/useEntityHandlers'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdConfiguration } from '~/models/entity/configuration'
import { toApiId } from '~/utils/idConverter'
// import { NODE_TYPES } from 'models/entity/node-types'

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
		
		// 获取项目详情
		const project = await entityApis.project.get(projectId.value)
		if (!project) {
			toast.toast({
				title: "警告", 
				description: "无法获取项目详情",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}
		
		console.log('项目数据加载成功:', project)
		
		// 确保项目有关联的模板
		if (!project.templateId) {
			console.warn('项目没有关联模板ID')
			toast.toast({
				title: "警告",
				description: "项目未关联模板",
				variant: "destructive", 
			})
			pageLoading.value = false
			return
		}
		
		console.log(`项目关联的模板ID: ${project.templateId}，开始加载模板数据`)
		
		// 步骤1.5: 显式加载模板数据
		const projectWithTemplate = await entityTree.loadTemplateByProject(projectData)
		console.log('加载模板数据完成', projectWithTemplate)
		
		// 步骤2: 使用loadEntityChildren一次性加载所有子元素
		// 这样避免多次修改反应式数据，减少递归更新的可能性
		console.log('加载项目所有子元素...')
		const { treeData: completeData } = await entityTree.loadEntityChildren(projectWithTemplate, {
			loadSystems: true,
			loadComponents: true,
			loadFullComponents: true,
			loadBoms: true,
			loadSpecifications: true  // 确保规格书加载选项为true
		})
		
		// 步骤3: 显式为项目中的每个模板节点加载规格书数据
		if (completeData.length > 0) {
			console.log('显式为每个模板节点加载规格书数据...')
			// 再次调用loadSpecificationByTemplate，确保规格书数据被正确加载
			const enhancedData = await entityTree.loadSpecificationByTemplate(completeData)
			console.log('规格书加载完成，更新数据')
			
			// 使用enhancedData替换completeData
			completeData.splice(0, completeData.length, ...enhancedData)
			
			// 步骤4: 显式加载配置节点数据
			console.log('显式加载配置节点数据...')
			const dataWithConfig = await entityTree.loadConfigurationByProject(completeData)
			console.log('配置节点加载完成，更新数据')
			
			// 使用dataWithConfig替换completeData
			completeData.splice(0, completeData.length, ...dataWithConfig)
		}
		
		if (completeData.length > 0) {
			console.log('完整项目数据加载成功:', completeData)
			
			// 检查规格书节点是否已加载
			const checkSpecNodes = (node: TreeNodeData) => {
				let specFound = false;
				if (node.type === NODE_TYPES.SPECIFICATION) {
					console.log('找到规格书节点:', node);
					specFound = true;
				}
				
				if (node.children?.length) {
					for (const child of node.children) {
						if (checkSpecNodes(child)) {
							specFound = true;
						}
					}
				}
				return specFound;
			};
			
			for (const rootNode of completeData) {
				const hasSpecNode = checkSpecNodes(rootNode);
				console.log(`根节点[${rootNode.id}]下${hasSpecNode ? '包含' : '不包含'}规格书节点`);
				
				// 检查模板节点
				if (rootNode.children?.length) {
					for (const templateNode of rootNode.children) {
						if (templateNode.type === NODE_TYPES.TEMPLATE) {
							console.log(`模板节点[${templateNode.id}]具有规格书ID:`, 
								templateNode.originalData?.specId);
							console.log(`模板节点[${templateNode.id}]下子节点:`, 
								templateNode.children?.map(n => ({id: n.id, type: n.type})));
						}
					}
				}
			}
			
			// 一次性更新树数据
			projectTreeData.value = completeData
			
			// 设置默认展开根节点和模板节点
			const expandKeys = [completeData[0].id]
			// 如果有子节点，将第一层子节点也设为展开
			if (completeData[0].children && completeData[0].children.length > 0) {
				expandKeys.push(completeData[0].children[0].id)
				console.log('设置展开节点:', expandKeys)
			}
			expandedKeys.value = expandKeys

// 加载项目配置
			await loadProjectConfiguration()
			
			toast.toast({
				title: "成功",
				description: "项目数据加载完成",
			})
		} else {
			toast.toast({
				title: "警告",
				description: "无法加载项目子元素",
				variant: "destructive",
			})
		}
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
	// 这里可以添加额外的处理逻辑
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