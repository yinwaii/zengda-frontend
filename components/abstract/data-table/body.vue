<script setup lang="ts" generic="TData, TValue">
import { type Table as TableType, type ColumnDef, type Cell, FlexRender } from '@tanstack/vue-table'
const props = defineProps<{
	table: TableType<TData>
	columns: ColumnDef<TData, TValue>[]
	onRowClick?: (row: TData) => void
}>()

const handleRowClick = (rowData: TData) => {
	if (props.onRowClick) {
		props.onRowClick(rowData)
	}
}

// 计算单元格宽度
const getCellWidth = (cell: Cell<TData, unknown>) => {
	// 使用类型断言访问meta中的width属性
	const metaWidth = (cell.column.columnDef.meta as any)?.width;
	
	// 如果是选择框或操作列，使用固定宽度
	if (cell.column.id === 'select' || cell.column.id === 'actions') {
		return metaWidth || '50px';
	}
	
	// 对于其他列，使用最小宽度
	return metaWidth || 'min-content';
}
</script>

<template>
	<template v-if="table.getRowModel().rows?.length">
		<template v-for="row in table.getRowModel().rows" :key="row.id">
			<shadcn-table-row 
				:data-state="row.getIsSelected() ? 'selected' : undefined"
				:class="props.onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''"
			>
				<shadcn-table-cell v-for="cell in row.getVisibleCells()" :key="cell.id"
					:style="{ width: getCellWidth(cell) }" 
					class="overflow-hidden text-ellipsis whitespace-nowrap"
					@click="cell.column.id !== 'select' && cell.column.id !== 'actions' && handleRowClick(row.original)">
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