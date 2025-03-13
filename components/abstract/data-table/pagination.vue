<script setup lang="ts" generic="TData">
import { type Table as TableType } from '@tanstack/vue-table'
const props = defineProps<{
	table: TableType<TData>
}>()
</script>

<template>
<div class="flex items-center justify-end py-4 space-x-2">
	<div class="flex-1 text-sm text-muted-foreground">
		{{ table.getFilteredSelectedRowModel().rows.length }} of
		{{ table.getFilteredRowModel().rows.length }} row(s) selected.
	</div>
	<div class="space-x-2">
		<shadcn-button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
			@click="table.previousPage()">
			前一页
		</shadcn-button>
		<shadcn-button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
			后一页
		</shadcn-button>
	</div>
</div>
</template>