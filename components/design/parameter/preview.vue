<template>
	<shadcn-card>
		<shadcn-card-header class="flex flex-row items-center justify-between pb-2">
			<shadcn-card-title>参数列表</shadcn-card-title>
			<shadcn-button size="sm" @click="handleAddParameter">
				添加参数
			</shadcn-button>
		</shadcn-card-header>
		<shadcn-card-content>
			<abstract-data-table v-if="parameters.length > 0" :columns="columns" :data="parameters" />
			<div v-else class="text-center text-muted-foreground py-4">
				暂无参数
			</div>
		</shadcn-card-content>
	</shadcn-card>
	
	<!-- 编辑对话框 -->
	<design-parameter-dialog
		v-model:open="dialogVisible"
		:parameter="editingParameter"
		@save="handleParameterSubmit"
	/>
</template>

<script setup lang="tsx">
import type { ZdParameter } from '~/models/entity/parameter'
import type { ColumnDef } from '@tanstack/vue-table'
import { ref, h } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useEntityApis } from '~/composables/use-entity-apis'

const props = defineProps<{
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	(e: 'edit', parameter: ZdParameter): void
	(e: 'delete', parameter: ZdParameter): void
	(e: 'update', parameter: ZdParameter): void
	(e: 'add', parameter: ZdParameter): void
}>()

// 对话框控制
const dialogVisible = ref(false)
const editingParameter = ref<ZdParameter | undefined>(undefined)
const { toast } = useToast()
const apis = useEntityApis()

// 列配置
const columns = ref<ColumnDef<ZdParameter>[]>([
	{
		id: 'select',
		header: ({ table }) => (<shadcn-checkbox
			modelValue={table.getIsAllPageRowsSelected()}
			onUpdate:modelValue={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
			ariaLabel="Select all"
		/>),
		cell: ({ row }) => (<shadcn-checkbox
			modelValue={row.getIsSelected()}
			onUpdate:modelValue={(value: boolean) => row.toggleSelected(!!value)}
			ariaLabel="Select all"
		/>),
		enableSorting: false,
		enableHiding: false,
		meta: { width: '50px' }
	},
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
		enableHiding: false,
		cell: ({ row }) => {
			const parameter = row.original
			return <div class="flex justify-end">
				<design-parameter-actions
					parameter={parameter}
					onEdit={() => handleEdit(parameter)}
					onDelete={() => handleDelete(parameter)}
				/>
			</div>
		},
	},
])

// 处理添加新参数
const handleAddParameter = () => {
	editingParameter.value = undefined
	dialogVisible.value = true
}

// 处理编辑操作
const handleEdit = (parameter: ZdParameter) => {
	editingParameter.value = parameter
	dialogVisible.value = true
	emit('edit', parameter)
}

// 处理删除操作
const handleDelete = async (parameter: ZdParameter) => {
	if (!parameter.id) {
		toast({
			title: '删除失败',
			description: '无效的参数ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此参数吗？')) {
			await apis.parameter.delete(parameter.id)
			toast({
				title: '删除成功',
				description: `参数 "${parameter.name}" 已被删除`
			})
			emit('delete', parameter)
		}
	} catch (error) {
		console.error('删除参数失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除参数，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handleParameterSubmit = async (parameter: ZdParameter) => {
	try {
		let result;
		if (parameter.id && parameter.id > 0) {
			// 更新现有参数
			result = await apis.parameter.update(parameter);
			toast({
				title: '更新成功',
				description: `参数 "${parameter.name}" 已更新`
			})
			emit('update', parameter)
		} else {
			// 创建新参数
			result = await apis.parameter.create(parameter)
			toast({
				title: '创建成功',
				description: `参数 "${parameter.name}" 已创建`
			})
			emit('add', result)
		}
	} catch (error) {
		console.error('保存参数失败:', error)
		toast({
			title: '保存失败',
			description: '无法保存参数，请稍后重试',
			variant: 'destructive'
		})
	}
}
</script> 