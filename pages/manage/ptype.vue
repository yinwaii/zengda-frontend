<script setup lang="ts">
definePageMeta({
	name: 'manage-ptype',
	keepalive: true
})

const table = useTemplateRef<any>('table')
const { ptype } = useEntityApis()
const data = ref<ZdPType[]>(await ptype.getAll())
// const data = ref<ZdProject[]>((await ZdProject.getByPage(0, 100)).content)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('manage-ptype')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 重置表格设置
const handleReset = () => {
	if (table.value) {
		// 清除保存的状态
		clearState()
		// 重置表格到默认状态
		table.value.columnVisibility = {
			...table.value.columnVisibility,
			...TimeStampColumnVisibility,
		}
		table.value.sortBy = null
		table.value.filterBy = null
	}
}

onMounted(async () => {
	// data.value = (await ZdProject.getByPage(0, 100)).content
	if (table.value) {
		// 尝试从 localStorage 加载状态
		const savedState = loadState()
		if (savedState) {
			table.value.columnVisibility = savedState.columnVisibility
			table.value.sortBy = savedState.sortBy
			table.value.filterBy = savedState.filterBy
		} else {
			// 否则使用默认状态
			table.value.columnVisibility = {
				...table.value.columnVisibility,
				// ...ZdProjectColumnsVisibility,
				...TimeStampColumnVisibility,
			}
		}
	}
})

// 在组件停用前保存状态
onDeactivated(() => {
	if (table.value) {
		const state = {
			columnVisibility: table.value.columnVisibility,
			sortBy: table.value.getSortBy?.(),
			filterBy: table.value.getFilterBy?.()
		}
		tableState.value = state
		saveState(state)
	}
})
</script>
<template>
	<div>
		<TableToolbar :on-reset="handleReset" />
		<abstract-data-table ref="table" :data="data" :columns="ZdPTypeColumns"></abstract-data-table>
	</div>
</template>