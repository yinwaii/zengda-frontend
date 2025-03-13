<script setup lang="ts" generic="TData, TValue">
import { type Table as TableType, type ColumnDef, FlexRender } from '@tanstack/vue-table'
const props = defineProps<{
	table: TableType<TData>
	columns: ColumnDef<TData, TValue>[]
}>()
</script>

<template>
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
				无结果
			</shadcn-table-cell>
		</shadcn-table-row>
	</template>
</template>