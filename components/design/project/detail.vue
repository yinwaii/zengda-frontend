<template>
	<div class="space-y-6">
		<!-- 配置选择器区域 -->
		<shadcn-card v-if="configurations && configurations.length > 0">
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium">项目配置</h3>
					<div class="flex items-center gap-2">
						<shadcn-button size="sm" variant="outline" @click="handleAddConfig">
							<LucidePlus class="h-4 w-4 mr-1" />
							新增配置
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
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
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ project.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ project.description || '暂无描述' }}</p>
					</div>
					<div class="flex items-center gap-2">
						<shadcn-button @click="$emit('edit')">
							<LucidePencil class="mr-2 h-4 w-4" />
							编辑
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<template v-if="isEditing">
					<form @submit.prevent="handleSubmit" class="space-y-4">
						<div class="space-y-2">
							<shadcn-label for="name">名称</shadcn-label>
							<shadcn-input id="name" v-model="editForm.name" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="description">描述</shadcn-label>
							<shadcn-textarea id="description" v-model="editForm.description" />
						</div>
						<div class="flex justify-end gap-2">
							<shadcn-button type="button" variant="outline" @click="$emit('cancel')">
								取消
							</shadcn-button>
							<shadcn-button type="submit">
								保存
							</shadcn-button>
						</div>
					</form>
				</template>
				<template v-else>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">ID</dt>
							<dd class="mt-1">{{ project.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
							<dd class="mt-1">{{ project.createdBy || '暂无创建人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(project.createdTime) || '暂无创建时间' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
							<dd class="mt-1">{{ project.updatedBy || '暂无修改人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(project.updatedTime) || '暂无修改时间' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="project.id" />

		<!-- 配置数据表格区域 -->
		<shadcn-card v-if="selectedConfig">
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium">配置信息</h3>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4 mb-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">配置ID</dt>
						<dd class="mt-1">{{ selectedConfig.id }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">最后版本ID</dt>
						<dd class="mt-1">{{ selectedConfig.lastVersionId }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
						<dd class="mt-1">
							<shadcn-badge :variant="selectedConfig.isShow ? 'default' : 'outline'">
								{{ selectedConfig.isShow ? '是' : '否' }}
							</shadcn-badge>
						</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">更新时间</dt>
						<dd class="mt-1">{{ formatDate(selectedConfig.updatedTime) || formatDate(selectedConfig.createdTime) || '暂无' }}</dd>
					</div>
				</div>

				<shadcn-tabs default-value="valueConfig" class="w-full">
					<shadcn-tabs-list class="grid w-full grid-cols-2">
						<shadcn-tabs-trigger value="valueConfig">值配置</shadcn-tabs-trigger>
						<shadcn-tabs-trigger value="componentConfig">组件配置</shadcn-tabs-trigger>
					</shadcn-tabs-list>
					<shadcn-tabs-content value="valueConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig.valueConfig) }}</pre>
						</div>
					</shadcn-tabs-content>
					<shadcn-tabs-content value="componentConfig">
						<div class="p-4 bg-muted/20 rounded-lg">
							<pre class="overflow-auto max-h-80 text-xs whitespace-pre-wrap">{{ formatConfig(selectedConfig.componentConfig) }}</pre>
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
</template>

<script setup lang="ts">
import { LucidePencil, LucidePlus, LucideTrash } from 'lucide-vue-next'
import { toRaw, computed, ref, watch, onMounted } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdProject } from '~/models/entity/project'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import ConfigurationDialog from '~/components/design/configuration/dialog.vue'
import { useToast } from '~/components/ui/toast'
import { toApiId } from '~/utils/idConverter'

const props = defineProps<{
	project: ZdProject
	isEditing: boolean
	parameters: ZdParameter[]
	data?: TreeNodeData // 可选的树节点数据
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdProject>]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

// 计算属性，处理项目数据
const project = computed(() => {
	// 优先使用直接传入的project
	return props.project || {}
})

const editForm = ref<Partial<ZdProject>>({
	name: project.value.name,
	description: project.value.description
})

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

// 获取所有配置
const loadConfigurations = async () => {
	try {
		if (!project.value || !project.value.id || !project.value.templateId) return

		// 使用toApiId转换项目ID为纯数字
		const projectNumericId = toApiId(project.value.id)
		if (projectNumericId === null) {
			console.error('无法将项目ID转换为有效的数字ID')
			toast({
				title: '错误',
				description: '项目ID格式无效',
				variant: 'destructive'
			})
			return
		}
		
		const response = await entityApis.configuration.getByTemplateId(
			project.value.templateId,
			projectNumericId
		)

		if (response && response.list && response.list.length > 0) {
			configurations.value = response.list
			// 默认选择第一个配置
			if (!selectedConfigId.value && response.list.length > 0) {
				selectedConfigId.value = response.list[0].id
			}
		} else {
			configurations.value = []
			selectedConfigId.value = null
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
			// 确保使用纯数字ID
			const projectNumericId = toApiId(project.value.id)
			if (projectNumericId === null) {
				throw new Error('无法将项目ID转换为有效的数字ID')
			}
			
			const newConfig = await entityApis.configuration.create({
				...config,
				project_id: projectNumericId,
				template_id: project.value.templateId
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

const handleSubmit = (event: Event) => {
	// 阻止表单默认提交行为
	if (event) event.preventDefault()
	
	// 确保有原始ID
	const originalId = project.value.id
	
	// 创建更新对象，确保包含必要字段
	const updatedData = {
		...toRaw(project.value),
		...toRaw(editForm.value),
		id: originalId,
		originalId: originalId
	} as (Partial<ZdProject> & { originalId: number })
	
	// 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	console.log('发送修改后的项目数据:', plainData)
	emit('save', plainData)
}

// 监听props.project变化，更新editForm
watch(() => props.project, (newProject) => {
	if (newProject) {
		editForm.value = {
			name: newProject.name,
			description: newProject.description
		}
		// 加载配置列表
		loadConfigurations()
	}
}, { immediate: true })

// 组件挂载时加载配置
onMounted(() => {
	loadConfigurations()
})
</script> 