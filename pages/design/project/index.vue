<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref } from 'vue'
import { ZdProjectColumns, ZdProjectColumnsVisibility } from '~/models/entity/project'
import type { ZdProject } from '~/models/entity/project'
import { TimeStampColumnVisibility } from '~/models/column'
import { useToast } from '@/components/ui/toast'

definePageMeta({
	name: 'design-project-project-total',
	keepalive: false,
	// keepalive: {
	// 	max: 10, // 设置最大缓存数量
	// 	include: ['design-project-project-total']
	// }
})

const dataTableRef = useTemplateRef<any>('dataTable')
const { project: projectApi } = useEntityApis()
const data = ref<ZdProject[]>([])
const entityApis = useEntityApis()
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingProject = ref<ZdProject | undefined>(undefined)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('design-project-project-total')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdProject[]>([])

// 重置表格设置
const handleReset = () => {
	if (dataTableRef.value) {
		// 清除保存的状态
		clearState()
		// 重置表格到默认状态
		dataTableRef.value.columnVisibility = {
			...dataTableRef.value.columnVisibility,
			...ZdProjectColumnsVisibility,
			...TimeStampColumnVisibility,
		}
		dataTableRef.value.sortBy = null
		dataTableRef.value.filterBy = null
	}
}

// 刷新数据
const handleRefresh = async () => {
	try {
		const response = await entityApis.project.getByPage(0, 100)
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
const handleEdit = (project: ZdProject) => {
	editingProject.value = { ...project }
	dialogVisible.value = true
}

// 处理删除操作
const handleDelete = async (project: ZdProject) => {
	if (!project.id) {
		toast({
			title: '删除失败',
			description: '无效的项目ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此项目吗？')) {
			await projectApi.delete(project.id)
			toast({
				title: '删除成功',
				description: `项目 "${project.name}" 已被删除`
			})
			await handleRefresh()
		}
	} catch (error) {
		console.error('删除项目失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除项目，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handleProjectSubmit = async (project: ZdProject) => {
	try {
		let result
		if (project.id) {
			// 更新现有项目
			result = await projectApi.update(project)
			toast({
				title: '更新成功',
				description: `项目 "${project.name}" 已更新`
			})
		} else {
			// 创建新项目
			result = await projectApi.create(project)
			toast({
				title: '创建成功',
				description: `项目 "${project.name}" 已创建`
			})
		}
		await handleRefresh()
	} catch (error) {
		console.error('保存项目失败:', error)
		toast({
			title: '保存失败',
			description: '无法保存项目，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 添加新项目
const handleAddProject = () => {
	editingProject.value = undefined
	dialogVisible.value = true
}

// 准备列定义，注入编辑和删除的逻辑
const projectColumns = ref([
	...ZdProjectColumns,
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
				...ZdProjectColumnsVisibility,
				...TimeStampColumnVisibility,
			}
		}
	}
	
	// 获取数据
	try {
		const response = await projectApi.getByPage(0, 100)
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

const onClick = (row: ZdProject) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/design/project/${row.id}`, { replace: true })
}
</script>
<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-bold">项目列表</h2>
			<shadcn-button @click="handleAddProject">新建项目</shadcn-button>
		</div>
		
		<abstract-data-table ref="dataTable" :data="data" :columns="projectColumns" v-model:selected-rows="selectedRows"
			:on-row-click="onClick"></abstract-data-table>
			
		<!-- 编辑对话框 -->
		<design-project-dialog
			v-model:open="dialogVisible"
			:project="editingProject"
			@save="handleProjectSubmit"
		/>
	</div>
</template>