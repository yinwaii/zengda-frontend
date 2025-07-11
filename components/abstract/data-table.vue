<script setup lang="ts" generic="TData, TValue">
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	ExpandedState,
} from '@tanstack/vue-table'

import {
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getExpandedRowModel,
	useVueTable,
} from '@tanstack/vue-table'

const props = defineProps<{
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onRowClick?: (row: TData) => void
	searchColumn?: string
	searchPlaceholder?: string
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const searchColumnId = computed(() => props.searchColumn || 'name')
const placeholder = computed(() => props.searchPlaceholder || '根据名称检索...')

const table = useVueTable({
	get data() { return props.data },
	get columns() { return props.columns },
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getExpandedRowModel: getExpandedRowModel(),
	onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
	onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
	onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
	onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
	onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
	state: {
		get sorting() { return sorting.value },
		get columnFilters() { return columnFilters.value },
		get columnVisibility() { return columnVisibility.value },
		get rowSelection() { return rowSelection.value },
		get expanded() { return expanded.value },
	},
})

defineExpose({ columnVisibility })
</script>

<template>
	<div class="w-full">
		<div class="flex items-center py-4">
			<shadcn-input class="max-w-sm" :placeholder="placeholder"
				:model-value="table.getColumn(searchColumnId)?.getFilterValue() as string"
				@update:model-value="table.getColumn(searchColumnId)?.setFilterValue($event)" />
			<abstract-data-table-view-options :table="table" />
		</div>
		<div class="overflow-x-auto border rounded-md">
			<shadcn-table class="w-full">
				<shadcn-table-header>
					<abstract-data-table-header :table="table" />
				</shadcn-table-header>
				<shadcn-table-body>
					<abstract-data-table-body :table="table" :columns="columns" :on-row-click="onRowClick" />
				</shadcn-table-body>
			</shadcn-table>
		</div>
		<abstract-data-table-pagination :table="table" />
	</div>
</template>

<style>
.table-fixed {
  table-layout: auto;
}

.table-fixed th, .table-fixed td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>