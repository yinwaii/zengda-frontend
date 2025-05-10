<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref } from 'vue'
import { type ZdTemplate, ZdTemplateColumns } from '~/models/entity/template'
import { TimeStampColumnVisibility } from '~/models/column'
import { useToast } from '@/components/ui/toast'
import type { ZdTemplate as ZdTemplateType } from '~/models/entity/template'

const dataTableRef = useTemplateRef<any>('dataTable')
const { template: templateApi } = useEntityApis()
const data = ref<ZdTemplateType[]>([])
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingTemplate = ref<ZdTemplateType | undefined>(undefined)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('design-project-template-total')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdTemplateType[]>([])

// 重置表格设置
const handleReset = () => {
	if (dataTableRef.value) {
		// 清除保存的状态
		clearState()
		// 重置表格到默认状态
		dataTableRef.value.columnVisibility = {
			...dataTableRef.value.columnVisibility,
			...TimeStampColumnVisibility,
		}
		dataTableRef.value.sortBy = null
		dataTableRef.value.filterBy = null
	}
}

// 刷新数据
const handleRefresh = async () => {
	try {
		const response = await templateApi.getByPage(0, 100)
		data.value = response.content
		toast({
			title: '刷新成功',
			description: `已获取 ${response.content.length} 条数据`
		})
	} catch (error) {
		console.error('刷新数据失败:', error)
		toast({
			title: '刷新失败',
			description: '无法获取数据，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 导出数据
const handleExport = () => {
	// TODO: 实现导出功能
	console.log('导出数据:', data.value)
}

// 批量删除
const handleBatchDelete = async () => {
	if (!selectedRows.value.length) return

	try {
		// TODO: 实现批量删除功能
		console.log('批量删除:', selectedRows.value)
		// 删除成功后刷新数据
		await handleRefresh()
	} catch (error) {
		console.error('批量删除失败:', error)
	}
}

// 处理编辑操作
const handleEdit = (template: ZdTemplateType) => {
	editingTemplate.value = { ...template }
	dialogVisible.value = true
}

// 处理删除操作
const handleDelete = async (template: ZdTemplateType) => {
	if (!template.id) {
		toast({
			title: '删除失败',
			description: '无效的模板ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此模板吗？')) {
			await templateApi.delete(template.id)
			toast({
				title: '删除成功',
				description: `模板 "${template.name}" 已被删除`
			})
			await handleRefresh()
		}
	} catch (error) {
		console.error('删除模板失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除模板，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handleTemplateSubmit = async (template: any) => {
	try {
		if (editingTemplate.value?.id) {
			// 更新现有模板
			template.id = editingTemplate.value.id
			await templateApi.update(template)
			toast({ 
				title: "成功", 
				description: "模板已更新" 
			})
		} else {
			// 创建新模板
			await templateApi.create(template)
			toast({ 
				title: "成功", 
				description: "模板已创建" 
			})
		}
		// 关闭对话框
		dialogVisible.value = false
		// 刷新数据
		await handleRefresh()
	} catch (err) {
		console.error('保存模板失败:', err)
		toast({ 
			title: "错误", 
			description: "保存模板失败", 
			variant: "destructive"
		})
	}
}

// 添加新模板
const handleAddTemplate = () => {
	editingTemplate.value = undefined // 清空编辑状态，表示新建模板
	dialogVisible.value = true
}

// 准备列定义，注入编辑和删除的逻辑
const templateColumns = ref([
	...ZdTemplateColumns,
	{
			id: 'actions',
			enableHiding: false,
			enableSorting: false,
			cell: ({ row }: { row: any }) => {
				return <div class="relative">
					<abstract-data-table-drop-down
						onExpand={row.toggleExpanded}
						onEdit={() => handleEdit(row.original)}
						onDelete={() => handleDelete(row.original)}
					/>
				</div>
			},
			meta: { width: '80px' }
	},
])

onMounted(async () => {
	if (dataTableRef.value) {
		// 尝试从 localStorage 加载状态
		const savedState = loadState()
		if (savedState) {
			dataTableRef.value.columnVisibility = savedState.columnVisibility
			dataTableRef.value.sortBy = savedState.sortBy
			dataTableRef.value.filterBy = savedState.filterBy
		} else {
			// 否则使用默认状态
			dataTableRef.value.columnVisibility = {
				...dataTableRef.value.columnVisibility,
				...TimeStampColumnVisibility,
			}
		}
	}

	// 获取数据
	try {
		const response = await templateApi.getByPage(0, 100)
		data.value = response.content
	} catch (error) {
		console.error('获取数据失败:', error)
	}
})

// 在组件停用前保存状态
onDeactivated(() => {
	if (dataTableRef.value) {
		const state = {
			columnVisibility: dataTableRef.value.columnVisibility,
			sortBy: dataTableRef.value.getSortBy?.(),
			filterBy: dataTableRef.value.getFilterBy?.()
		}
		tableState.value = state
		saveState(state)
	}
})

const onClick = (row: ZdTemplateType) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/design/template/${row.id}`, { replace: true })
}
</script>
<template>
	<div class="p-4 w-full overflow-x-hidden">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-bold">项目模板列表</h2>
			<shadcn-button @click="handleAddTemplate">新建模板</shadcn-button>
		</div>

		<div class="overflow-x-auto">
			<abstract-data-table ref="dataTable" :data="data" :columns="templateColumns" v-model:selected-rows="selectedRows"
				:on-row-click="onClick"></abstract-data-table>
		</div>

		<!-- 编辑对话框 -->
		<design-template-dialog v-model:open="dialogVisible" :template="editingTemplate"
			@save="handleTemplateSubmit" />
	</div>
</template>