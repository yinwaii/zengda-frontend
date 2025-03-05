<script setup lang="ts" generic="TData, TValue">
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	ExpandedState,
} from '@tanstack/vue-table'

import {
	FlexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getExpandedRowModel,
	useVueTable,
} from '@tanstack/vue-table'

import { valueUpdater } from '@/lib/utils'

const props = defineProps<{
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

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
</script>

<template>
	<div>
		<div class="flex items-center py-4">
			<shadcn-input class="max-w-sm" placeholder="Filter emails..."
				:model-value="table.getColumn('email')?.getFilterValue() as string"
				@update:model-value=" table.getColumn('email')?.setFilterValue($event)" />
			<shadcn-dropdown-menu>
				<shadcn-dropdown-menu-trigger as-child>
					<shadcn-button variant="outline" class="ml-auto">
						Columns
						<ChevronDown class="w-4 h-4 ml-2" />
					</shadcn-button>
				</shadcn-dropdown-menu-trigger>
				<shadcn-dropdown-menu-content align="end">
					<shadcn-dropdown-menu-checkbox-item
						v-for="column in table.getAllColumns().filter((column) => column.getCanHide())" :key="column.id"
						class="capitalize" :modelValue="column.getIsVisible()" @update:modelValue="(value) => {
							column.toggleVisibility(!!value)
						}">
						{{ column.id }}
					</shadcn-dropdown-menu-checkbox-item>
				</shadcn-dropdown-menu-content>
			</shadcn-dropdown-menu>
		</div>
		<div class="border rounded-md">
			<shadcn-table>
				<shadcn-table-header>
					<shadcn-table-row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
						<shadcn-table-head v-for="header in headerGroup.headers" :key="header.id">
							<FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
								:props="header.getContext()" />
						</shadcn-table-head>
					</shadcn-table-row>
				</shadcn-table-header>
				<shadcn-table-body>
					<template v-if="table.getRowModel().rows?.length">
						<template v-for="row in table.getRowModel().rows" :key="row.id">
							<shadcn-table-row :data-state="row.getIsSelected() ? 'selected' : undefined">
								<shadcn-table-cell v-for="cell in row.getVisibleCells()" :key="cell.id">
									<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
								</shadcn-table-cell>
							</shadcn-table-row>
							<shadcn-table-row v-if="row.getIsExpanded()">
								<shadcn-table-cell :colspan="row.getAllCells().length">
									{{ JSON.stringify(row.original) }}
								</shadcn-table-cell>
							</shadcn-table-row>
						</template>
					</template>
					<template v-else>
						<shadcn-table-row>
							<shadcn-table-cell :colspan="columns.length" class="h-24 text-center">
								No results.
							</shadcn-table-cell>
						</shadcn-table-row>
					</template>
				</shadcn-table-body>
			</shadcn-table>
		</div>
		<div class="flex items-center justify-end py-4 space-x-2">
			<div class="flex-1 text-sm text-muted-foreground">
				{{ table.getFilteredSelectedRowModel().rows.length }} of
				{{ table.getFilteredRowModel().rows.length }} row(s) selected.
			</div>
			<div class="space-x-2">
				<shadcn-button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
					@click="table.previousPage()">
					Previous
				</shadcn-button>
				<shadcn-button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
					Next
				</shadcn-button>
			</div>
		</div>
	</div>
</template>