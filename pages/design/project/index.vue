<script setup lang="ts">
import TableToolbar from '@/components/design/table/TableToolbar.vue'
import { navigateTo } from '#app'

definePageMeta({
	name: 'design-project-project-total',
	keepalive: true
})

const dataTableRef = useTemplateRef<any>('dataTable')
// const { template: templateApi } = useEntityApis()
const data = ref<ZdProject[]>([])
const entityApis = useEntityApis()

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
	} catch (error) {
		console.error('刷新数据失败:', error)
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
				ZdProjectColumnsVisibility,
				...TimeStampColumnVisibility,
			}
		}
	}

	// 获取数据
	try {
		const response = await entityApis.project.getByPage(0, 100)
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
		<TableToolbar :on-reset="handleReset" :on-refresh="handleRefresh" :on-export="handleExport"
			:on-batch-delete="handleBatchDelete" :selected-rows="selectedRows" />
		<abstract-data-table ref="dataTable" :data="data" :columns="ZdProjectColumns" v-model:selected-rows="selectedRows"
			:on-row-click="onClick"></abstract-data-table>
	</div>
</template>