<script setup lang="ts" generic="TData">
import { type Table as TableType, type Header, FlexRender } from '@tanstack/vue-table'
const props = defineProps<{
	table: TableType<TData>
}>()

// 计算每列的宽度
const getColumnWidth = (header: Header<TData, unknown>) => {
  // 使用类型断言访问meta中的width属性
  return (header.column.columnDef.meta as any)?.width || 'auto';
}
</script>

<template>
	<shadcn-table-row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
		<shadcn-table-head v-for="header in headerGroup.headers" :key="header.id" 
      :style="{ width: getColumnWidth(header) }" class="overflow-hidden text-ellipsis whitespace-nowrap">
			<FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
				:props="header.getContext()" />
		</shadcn-table-head>
	</shadcn-table-row>
</template>