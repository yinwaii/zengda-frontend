<template>
	<div class="space-y-4">
		<!-- 配置选择器 -->
		<div class="flex items-center gap-3">
			<shadcn-select v-model="selectedConfigId">
				<shadcn-select-trigger class="w-full max-w-xs">
					<template #default>
						{{ getSelectedConfigName() }}
					</template>
				</shadcn-select-trigger>
				<shadcn-select-content>
					<shadcn-select-item v-for="config in configurations" :key="config.id" :value="config.id">
						{{ config.id }} - 最后更新: {{ formatDate(config.updatedTime) || formatDate(config.createdTime) || '未知' }}
					</shadcn-select-item>
				</shadcn-select-content>
			</shadcn-select>
			<shadcn-button size="sm" variant="outline" @click="handleEditConfig" :disabled="!selectedConfig">
				<LucidePencil class="h-4 w-4 mr-1" />
				编辑
			</shadcn-button>
			<shadcn-button size="sm" variant="destructive" @click="handleDeleteConfig" :disabled="!selectedConfig">
				<LucideTrash class="h-4 w-4 mr-1" />
				删除
			</shadcn-button>
		</div>

		<!-- 配置信息 -->
		<shadcn-card v-if="selectedConfig">
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium">配置信息</h3>
					<h4 v-if="currentNodeName" class="text-sm font-medium text-muted-foreground">
						当前节点: {{ currentNodeName }}
					</h4>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4 mb-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">配置ID</dt>
						<dd class="mt-1">{{ selectedConfig?.id }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">最后版本ID</dt>
						<dd class="mt-1">{{ selectedConfig?.lastVersionId }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
						<dd class="mt-1">
							<shadcn-badge :variant="selectedConfig?.isShow ? 'default' : 'outline'">
								{{ selectedConfig?.isShow ? '是' : '否' }}
							</shadcn-badge>
						</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">更新时间</dt>
						<dd class="mt-1">{{ formatDate(selectedConfig?.updatedTime) || formatDate(selectedConfig?.createdTime) || '暂无' }}</dd>
					</div>
				</div>

				<shadcn-tabs default-value="arguments" class="w-full">
					<shadcn-tabs-list class="grid w-full grid-cols-3">
						<shadcn-tabs-trigger value="arguments">节点参数</shadcn-tabs-trigger>
						<shadcn-tabs-trigger value="valueConfig">值配置</shadcn-tabs-trigger>
						<shadcn-tabs-trigger value="componentConfig">组件配置</shadcn-tabs-trigger>
					</shadcn-tabs-list>
					
					<shadcn-tabs-content value="arguments" class="pt-4">
						<div class="flex justify-between items-center mb-4">
							<h3 class="text-base font-semibold">节点参数配置</h3>
							<shadcn-button size="sm" variant="outline" @click="handleAddArgument">
								<LucidePlus class="h-4 w-4 mr-1" />
								新增参数
							</shadcn-button>
						</div>
						
						<div v-if="isEditingArgument" class="border p-4 rounded-lg mb-4">
							<h4 class="text-sm font-medium mb-3">{{ editingArgument.id ? '编辑参数' : '新增参数' }}</h4>
							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-2">
										<shadcn-label for="arg-name">参数名称</shadcn-label>
										<shadcn-input id="arg-name" v-model="editingArgument.name" placeholder="输入参数名称" />
									</div>
									<div class="space-y-2">
										<shadcn-label for="arg-type">参数类型</shadcn-label>
										<shadcn-select v-model="editingArgument.type">
											<shadcn-select-trigger>
												<shadcn-select-value placeholder="选择参数类型" />
											</shadcn-select-trigger>
											<shadcn-select-content>
												<shadcn-select-item value="string">字符串</shadcn-select-item>
												<shadcn-select-item value="number">数字</shadcn-select-item>
												<shadcn-select-item value="boolean">布尔值</shadcn-select-item>
												<shadcn-select-item value="object">对象</shadcn-select-item>
												<shadcn-select-item value="array">数组</shadcn-select-item>
											</shadcn-select-content>
										</shadcn-select>
									</div>
								</div>
								<div class="space-y-2">
									<shadcn-label for="arg-value">参数值</shadcn-label>
									<shadcn-textarea id="arg-value" v-model="editingArgument.value" placeholder="输入参数值" />
									<p class="text-xs text-muted-foreground">
										根据选择的类型输入相应格式的值。数字类型直接输入数字，布尔类型输入true/false，对象和数组请输入有效的JSON格式。
									</p>
								</div>
								<div class="flex justify-end space-x-2">
									<shadcn-button variant="outline" @click="cancelEditArgument">取消</shadcn-button>
									<shadcn-button @click="saveArgument">保存</shadcn-button>
								</div>
							</div>
						</div>
						
						<div v-if="objectArgument && objectArgument.arguments && objectArgument.arguments.length > 0">
							<div class="rounded-md border">
								<shadcn-table>
									<shadcn-table-header>
										<shadcn-table-row>
											<shadcn-table-head>名称</shadcn-table-head>
											<shadcn-table-head>类型</shadcn-table-head>
											<shadcn-table-head>值</shadcn-table-head>
											<shadcn-table-head class="w-[100px]">操作</shadcn-table-head>
										</shadcn-table-row>
									</shadcn-table-header>
									<shadcn-table-body>
										<shadcn-table-row v-for="arg in objectArgument.arguments" :key="arg.id">
											<shadcn-table-cell>{{ arg.name }}</shadcn-table-cell>
											<shadcn-table-cell>{{ arg.type }}</shadcn-table-cell>
											<shadcn-table-cell class="max-w-[300px] truncate" :title="arg.value">
												{{ arg.value }}
											</shadcn-table-cell>
											<shadcn-table-cell>
												<div class="flex items-center gap-2">
													<shadcn-button size="icon" variant="ghost" @click="handleEditArgument(arg)">
														<LucidePencil class="h-4 w-4" />
													</shadcn-button>
													<shadcn-button size="icon" variant="ghost" @click="handleDeleteArgument(arg)">
														<LucideTrash class="h-4 w-4" />
													</shadcn-button>
												</div>
											</shadcn-table-cell>
										</shadcn-table-row>
									</shadcn-table-body>
								</shadcn-table>
							</div>
						</div>
						<div v-else-if="objectArgument" class="p-4 bg-muted/10 rounded-lg text-center">
							<p class="text-muted-foreground">当前节点暂无参数配置</p>
							<shadcn-button variant="outline" size="sm" class="mt-2" @click="handleAddArgument">
								添加第一个参数
							</shadcn-button>
						</div>
						<div v-else class="p-4 bg-muted/10 rounded-lg text-center">
							<p class="text-muted-foreground">请选择一个节点查看配置参数</p>
						</div>
					</shadcn-tabs-content>
					
					<shadcn-tabs-content value="valueConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig?.valueConfig) }}</pre>
						</div>
					</shadcn-tabs-content>
					
					<shadcn-tabs-content value="componentConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig?.componentConfig) }}</pre>
						</div>
					</shadcn-tabs-content>
				</shadcn-tabs>
			</shadcn-card-content>
		</shadcn-card>
	</div>

	<!-- 配置对话框 -->
	<configuration-dialog 
		:modelValue="showConfigDialog"
		@update:modelValue="showConfigDialog = $event"
		:editing-item="editingConfig"
		@submit="onConfigSubmit" 
	/>

	<!-- 确认删除对话框 -->
	<shadcn-alert-dialog v-model:open="showDeleteConfirm">
		<shadcn-alert-dialog-content>
			<shadcn-alert-dialog-header>
				<shadcn-alert-dialog-title>确认删除</shadcn-alert-dialog-title>
				<shadcn-alert-dialog-description>
					您确定要删除此配置吗？此操作不可撤销。
				</shadcn-alert-dialog-description>
			</shadcn-alert-dialog-header>
			<shadcn-alert-dialog-footer>
				<shadcn-alert-dialog-cancel>取消</shadcn-alert-dialog-cancel>
				<shadcn-alert-dialog-action @click="confirmDelete">删除</shadcn-alert-dialog-action>
			</shadcn-alert-dialog-footer>
		</shadcn-alert-dialog-content>
	</shadcn-alert-dialog>

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
import { LucidePencil, LucidePlus, LucideTrash } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { ZdObjectArgument, ZdParameterArgument } from '~/models/entity/argument'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import ConfigurationDialog from '~/components/design/configuration/dialog.vue'
import { useToast } from '~/components/ui/toast'

const props = defineProps<{
	projectId: number
	templateId: number
	currentNode?: TreeNodeData
}>()

const emit = defineEmits<{
	'update:configId': [value: number | null]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

// 配置相关状态
const configurations = ref<ZdConfiguration[]>([])
const selectedConfigId = ref<number | null>(null)
const selectedConfig = computed(() => 
	configurations.value.find(c => c.id === selectedConfigId.value) || null
)

// 对话框状态
const showConfigDialog = ref(false)
const editingConfig = ref<ZdConfiguration | undefined>(undefined)
const showDeleteConfirm = ref(false)

// 当前节点的名称
const currentNodeName = computed(() => {
	if (!props.currentNode) return '';
	return `${props.currentNode.type || '节点'}: ${props.currentNode.label || props.currentNode.id}`
})

// 当前节点的类型和ID
const currentNodeTypeAndId = computed(() => {
	if (!props.currentNode) return { objectType: '', objectId: '' };

	const nodeId = props.currentNode.id?.toString() || '';

	// 检查是否为复合ID
	if (nodeId.includes(':')) {
		const [type, ...rest] = nodeId.split(':');
		return {
			objectType: type,
			objectId: rest.join(':')
		};
	}

	// 如果不是复合ID，则使用节点的type属性和原始ID
	return {
		objectType: props.currentNode.type || 'PROJECT',
		objectId: nodeId
	};
})

// 参数相关状态
const objectArgument = ref<ZdObjectArgument | null>(null)
const isEditingArgument = ref(false)
const editingArgument = ref<ZdParameterArgument>({
	id: 0,
	name: '',
	type: 'string',
	value: ''
})
const showDeleteArgConfirm = ref(false)
const argumentToDelete = ref<ZdParameterArgument | null>(null)

// 获取所有配置
const loadConfigurations = async () => {
	try {
		if (!props.projectId || !props.templateId) return

		const response = await entityApis.configuration.getByTemplateId(
			props.templateId,
			props.projectId
		)

		if (response && response.list && response.list.length > 0) {
			configurations.value = response.list
			// 默认选择第一个配置
			if (!selectedConfigId.value && response.list.length > 0) {
				selectedConfigId.value = response.list[0].id
				emit('update:configId', selectedConfigId.value)
			}
			
			// 加载当前节点的参数
			if (selectedConfigId.value && props.currentNode) {
				await loadNodeArguments()
			}
		} else {
			configurations.value = []
			selectedConfigId.value = null
			objectArgument.value = null
			emit('update:configId', null)
		}
	} catch (error) {
		console.error('加载配置列表失败:', error)
		toast({
			title: '错误',
			description: '加载配置列表失败',
			variant: 'destructive'
		})
	}
}

// 加载节点参数
const loadNodeArguments = async () => {
	if (!selectedConfigId.value || !currentNodeTypeAndId.value.objectType || !currentNodeTypeAndId.value.objectId) {
		objectArgument.value = null
		return
	}

	try {
		const { objectType, objectId } = currentNodeTypeAndId.value
		
		const response = await entityApis.argument.get(
			selectedConfigId.value,
			objectType,
			objectId
		)

		if (response) {
			objectArgument.value = response
		} else {
			// 如果没有现有参数，创建一个空的参数对象
			objectArgument.value = {
				objectType,
				objectId,
				arguments: [],
				children: []
			}
		}
	} catch (error) {
		console.error('加载节点参数失败:', error)
		toast({
			title: '警告',
			description: '加载节点参数失败',
			variant: 'default'
		})

		// 创建一个空的参数对象用于新增
		objectArgument.value = {
			objectType: currentNodeTypeAndId.value.objectType,
			objectId: currentNodeTypeAndId.value.objectId,
			arguments: [],
			children: []
		}
	}
}

// 处理新增参数
const handleAddArgument = () => {
	// 如果还没有初始化对象参数，先创建一个空的
	if (!objectArgument.value && currentNodeTypeAndId.value.objectType && currentNodeTypeAndId.value.objectId) {
		objectArgument.value = {
			objectType: currentNodeTypeAndId.value.objectType,
			objectId: currentNodeTypeAndId.value.objectId,
			arguments: [],
			children: []
		}
	}
	
	// 如果没有可用的对象参数，显示错误并返回
	if (!objectArgument.value) {
		toast({
			title: '错误',
			description: '请先选择一个节点',
			variant: 'destructive'
		})
		return
	}
	
	editingArgument.value = {
		id: 0, // 新参数的ID为0
		name: '',
		type: 'string',
		value: ''
	}
	isEditingArgument.value = true
}

// 处理编辑参数
const handleEditArgument = (arg: ZdParameterArgument) => {
	editingArgument.value = { ...arg }
	isEditingArgument.value = true
}

// 处理删除参数
const handleDeleteArgument = (arg: ZdParameterArgument) => {
	argumentToDelete.value = arg
	showDeleteArgConfirm.value = true
}

// 确认删除参数
const confirmDeleteArgument = async () => {
	if (!argumentToDelete.value || !objectArgument.value || !selectedConfigId.value) return

	try {
		// 从参数列表中移除要删除的参数
		const updatedArguments = objectArgument.value.arguments.filter(
			arg => arg.id !== argumentToDelete.value?.id
		)

		// 更新对象参数
		const updatedObjectArgument: ZdObjectArgument = {
			...objectArgument.value,
			arguments: updatedArguments
		}

		// 保存到服务器
		await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)

		// 更新本地状态
		objectArgument.value = updatedObjectArgument

		toast({
			title: '成功',
			description: '参数已删除'
		})

		// 关闭确认对话框
		showDeleteArgConfirm.value = false
		argumentToDelete.value = null
	} catch (error) {
		console.error('删除参数失败:', error)
		toast({
			title: '错误',
			description: '删除参数失败',
			variant: 'destructive'
		})
	}
}

// 取消编辑参数
const cancelEditArgument = () => {
	isEditingArgument.value = false
	editingArgument.value = {
		id: 0,
		name: '',
		type: 'string',
		value: ''
	}
}

// 保存参数
const saveArgument = async () => {
	if (!selectedConfigId.value || !objectArgument.value) return

	try {
		// 验证参数
		if (!editingArgument.value.name.trim()) {
			toast({
				title: '错误',
				description: '参数名称不能为空',
				variant: 'destructive'
			})
			return
		}

		let updatedArguments: ZdParameterArgument[] = []

		if (editingArgument.value.id === 0) {
			// 新增参数
			// 生成临时ID（前端生成，后端会替换）
			const tempId = Date.now()

			// 添加到参数列表
			updatedArguments = [
				...objectArgument.value.arguments,
				{
					...editingArgument.value,
					id: tempId
				}
			]
		} else {
			// 更新现有参数
			updatedArguments = objectArgument.value.arguments.map(arg =>
				arg.id === editingArgument.value.id ? editingArgument.value : arg
			)
		}

		// 更新对象参数
		const updatedObjectArgument: ZdObjectArgument = {
			...objectArgument.value,
			arguments: updatedArguments
		}

		// 保存到服务器
		if (objectArgument.value.arguments.length === 0 && editingArgument.value.id === 0) {
			// 如果是首次添加参数，使用create方法
			await entityApis.argument.create(selectedConfigId.value, updatedObjectArgument)
			toast({
				title: '成功',
				description: '参数已创建'
			})
		} else {
			// 否则使用update方法
			await entityApis.argument.update(selectedConfigId.value, updatedObjectArgument)
			toast({
				title: '成功',
				description: '参数已更新'
			})
		}

		// 更新本地状态
		objectArgument.value = updatedObjectArgument

		// 关闭编辑表单
		isEditingArgument.value = false
		editingArgument.value = {
			id: 0,
			name: '',
			type: 'string',
			value: ''
		}
	} catch (error) {
		console.error('保存参数失败:', error)
		toast({
			title: '错误',
			description: '保存参数失败',
			variant: 'destructive'
		})
	}
}

// 处理新增配置
const handleAddConfig = () => {
	editingConfig.value = undefined // 确保不是编辑模式
	showConfigDialog.value = true
}

// 处理编辑配置
const handleEditConfig = () => {
	if (!selectedConfig.value) return
	editingConfig.value = selectedConfig.value
	showConfigDialog.value = true
}

// 处理删除配置
const handleDeleteConfig = () => {
	if (!selectedConfig.value) return
	showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = async () => {
	if (!selectedConfig.value) return

	try {
		await entityApis.configuration.delete(selectedConfig.value.id)
		toast({
			title: '成功',
			description: '配置已删除'
		})
		
		// 重新加载配置列表
		await loadConfigurations()
		showDeleteConfirm.value = false
	} catch (error) {
		console.error('删除配置失败:', error)
		toast({
			title: '错误',
			description: '删除配置失败',
			variant: 'destructive'
		})
	}
}

// 配置对话框提交处理
const onConfigSubmit = async (config: ZdConfiguration) => {
	try {
		if (editingConfig.value) {
			// 更新
			await entityApis.configuration.update(config)
			toast({
				title: '成功',
				description: '配置已更新'
			})
		} else {
			// 创建
			const newConfig = await entityApis.configuration.create({
				...config,
				projectId: props.projectId,
				templateId: props.templateId
			})
			toast({
				title: '成功',
				description: '配置已创建'
			})
		}
		
		// 重新加载配置列表
		await loadConfigurations()
		showConfigDialog.value = false
	} catch (error) {
		console.error('保存配置失败:', error)
		toast({
			title: '错误',
			description: '保存配置失败',
			variant: 'destructive'
		})
	}
}

// 获取选中配置名称
const getSelectedConfigName = () => {
	if (!selectedConfig.value) return '请选择配置'
	return `配置 #${selectedConfig.value.id}`
}

// 格式化配置JSON
const formatConfig = (config: string) => {
	if (!config) return '{}' 
	try {
		return JSON.stringify(JSON.parse(config), null, 2)
	} catch (e) {
		return config
	}
}

// 监听配置ID变化
watch(selectedConfigId, (newValue) => {
	emit('update:configId', newValue)
})

// 监听当前节点变化，重新加载参数
watch([() => props.currentNode, selectedConfigId], () => {
	if (props.currentNode && selectedConfigId.value) {
		loadNodeArguments()
	} else {
		objectArgument.value = null
	}
})

// 组件挂载时加载配置
onMounted(() => {
	loadConfigurations()
})
</script> 