<template>
	<shadcn-card>
		<shadcn-card-header>
			<shadcn-card-title>参数列表</shadcn-card-title>
		</shadcn-card-header>
		<shadcn-card-content>
			<abstract-data-table v-if="parameters.length > 0" :columns="columns" :data="parameters" />
			<div v-else class="text-center text-muted-foreground py-4">
				暂无参数
			</div>
		</shadcn-card-content>
	</shadcn-card>
</template>

<script setup lang="ts">
import { ZdParameter } from '~/models/entity/parameter'
import type { ColumnDef } from '@tanstack/vue-table'
import { ref, h } from 'vue'

const props = defineProps<{
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	(e: 'edit', parameter: ZdParameter): void
	(e: 'delete', parameter: ZdParameter): void
}>()

// 列配置
const columns = ref<ColumnDef<ZdParameter>[]>([
	{
		accessorKey: 'name',
		header: '参数名',
	},
	{
		accessorKey: 'description',
		header: '描述',
		cell: ({ row }) => row.original.description || '-',
	},
	{
		accessorKey: 'value',
		header: '值',
	},
	{
		accessorKey: 'dtype',
		header: '类型',
		cell: ({ row }) => row.original.dtype || '-',
	},
	{
		id: 'actions',
		header: '操作',
		// 使用渲染函数
		cell: ({ row }) => {
			const parameter = row.original
			
			// 返回自定义渲染内容
			return h('div', { class: 'flex justify-end' }, [
				h('design-parameter-actions', {
					parameter,
					onEdit: () => emit('edit', parameter),
					onDelete: () => emit('delete', parameter)
				})
			])
		}
	},
])
</script> 