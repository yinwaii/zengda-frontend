<script setup lang="ts" generic="TData">
import { type Table as TableType, FlexRender } from '@tanstack/vue-table'
const props = defineProps<{
	table: TableType<TData>
}>()
</script>

<template>
	<shadcn-table-row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
		<shadcn-table-head v-for="header in headerGroup.headers" :key="header.id">
			<FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
				:props="header.getContext()" />
		</shadcn-table-head>
	</shadcn-table-row>
</template>