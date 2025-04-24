<template>
	<shadcn-card>
		<shadcn-card-header class="flex flex-row items-center justify-between pb-2">
			<shadcn-card-title>参数列表</shadcn-card-title>
			<shadcn-button size="sm" @click="handleAddParameter">
				添加参数
			</shadcn-button>
		</shadcn-card-header>
		<shadcn-card-content>
			<div v-if="loading" class="flex justify-center items-center py-4">
				<span class="mr-2">加载中</span>
				<div class="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
			</div>
			<abstract-data-table v-else-if="parameters.length > 0" :columns="columns" :data="parameters" />
			<div v-else class="text-center text-muted-foreground py-4">
				暂无参数
			</div>
		</shadcn-card-content>
	</shadcn-card>
	
	<!-- 编辑对话框 -->
	<design-parameter-dialog
		v-model:open="dialogVisible"
		:parameter="editingParameter"
		:nodeId="props.nodeId"
		:type="props.type"
		@save="handleParameterSubmit"
	/>
</template>

<script setup lang="tsx">
import type { ZdParameter } from '~/models/entity/parameter'
import type { ColumnDef } from '@tanstack/vue-table'
import { ref, h, onMounted, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useEntityApis } from '~/composables/use-entity-apis'
import { toApiId } from '~/utils/idConverter'
import { LucidePencil, LucideTrash, LucideCopy } from 'lucide-vue-next'

const props = defineProps<{
	nodeId: string | number // 复合ID，格式为 "type:id"
	type?: string
}>()

const emit = defineEmits<{
	(e: 'edit', parameter: ZdParameter): void
	(e: 'delete', parameter: ZdParameter): void
	(e: 'update', parameter: ZdParameter): void
	(e: 'add', parameter: ZdParameter): void
}>()

// 状态变量
const parameters = ref<ZdParameter[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingParameter = ref<ZdParameter | undefined>(undefined)
const { toast } = useToast()
const apis = useEntityApis()

// 数据类型选项
const dataTypeOptions = [
	{ value: 'int', label: '整数' },
	{ value: 'double', label: '小数' },
	{ value: 'string', label: '文本' },
	{ value: 'expression', label: '公式' }
]

// 获取数据类型的显示标签
const getDataTypeLabel = (value: string) => {
	return dataTypeOptions.find(option => option.value === value)?.label || value
}

// 从复合ID中提取类型和ID
const parseNodeId = (nodeId: string | number) => {
	if (typeof nodeId === 'number') {
		return { type: 'unknown', id: nodeId }
	}

	const nodeIdStr = String(nodeId)
	if (nodeIdStr.includes(':')) {
		const [type, ...rest] = nodeIdStr.split(':')
		const id = toApiId(rest.join(':'))
		return { type, id }
	}

	return { type: 'unknown', id: parseInt(nodeIdStr, 10) }
}

// 加载参数列表
const loadParameters = async () => {
	loading.value = true
	try {
		const { type, id } = parseNodeId(props.nodeId)
		
		if (!id) {
			console.warn(`无效的节点ID: ${props.nodeId}`)
			loading.value = false
			return
		}
		
		console.log(`正在加载节点参数, 类型: ${type}, ID: ${id}`)
		
		// 调用API获取参数列表
		const result = await apis.parameter.get(id, type)
		parameters.value = Array.isArray(result) ? result : []
		
		console.log(`成功加载${parameters.value.length}个参数`)
	} catch (error) {
		console.error('加载参数失败:', error)
		toast({
			title: '加载失败',
			description: '无法加载参数列表，请稍后重试',
			variant: 'destructive'
		})
		parameters.value = []
	} finally {
		loading.value = false
	}
}

// 监听nodeId变化，重新加载参数
watch(() => props.nodeId, (newValue) => {
	if (newValue) {
		loadParameters()
	}
}, { immediate: false })

// 组件挂载时加载参数
onMounted(() => {
	if (props.nodeId) {
		loadParameters()
	}
})

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
		cell: ({ row }) => getDataTypeLabel(row.original.dtype || ''),
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const parameter = row.original
			return <div class="flex items-center gap-2">
				<shadcn-button
					variant="ghost"
					size="icon"
					onClick={() => handleEdit(parameter)}
				>
					<LucidePencil class="h-4 w-4" />
				</shadcn-button>
				<shadcn-button
					variant="ghost"
					size="icon"
					onClick={() => handleDelete(parameter)}
				>
					<LucideTrash class="h-4 w-4" />
				</shadcn-button>
				<shadcn-button
					variant="ghost"
					size="icon"
					onClick={() => handleCopy(parameter)}
				>
					<LucideCopy class="h-4 w-4" />
				</shadcn-button>
			</div>
		},
	},
])

// 处理添加新参数
const handleAddParameter = () => {
	const { type, id } = parseNodeId(props.nodeId)
	
	if (!id) {
		toast({
			title: '添加失败',
			description: '未知的节点ID，无法添加参数',
			variant: 'destructive'
		})
		return
	}
	
	// 创建新参数对象，预设类型和关联ID
	const newParameter = {
		id: 0, // 新参数的ID设为0，表示未保存
		name: '',
		value: '',
		description: '',
		dtype: '',
		type: type, // 参数所属类型
		typeId: id,  // 参数所属ID
		isShow: true,
		objectId: 0,
		objectType: '',
		// SQL错误表明is_deleted列不能接收太长的数据，所以使用null
		isDeleted: 0
	}
	
	// 强制类型转换，让TypeScript编译通过
	editingParameter.value = newParameter as unknown as ZdParameter
	
	dialogVisible.value = true
}

// 处理编辑操作
const handleEdit = (parameter: ZdParameter) => {
	// 创建参数的副本，确保isDeleted正确设置
	const parameterCopy = { ...parameter }
	
	// 如果isDeleted不是布尔值，强制转为null
	if (typeof parameterCopy.isDeleted !== 'boolean') {
		parameterCopy.isDeleted = null as unknown as boolean
	}
	
	editingParameter.value = parameterCopy
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
			// 删除成功后重新加载参数列表
			loadParameters()
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
		console.log('parameter:', parameter)
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
		// 操作成功后重新加载参数列表
		loadParameters()
	} catch (error) {
		console.error('保存参数失败:', error)
		toast({
			title: '保存失败',
			description: '无法保存参数，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理复制操作
const handleCopy = async (parameter: ZdParameter) => {
	try {
		const { type, id } = parseNodeId(props.nodeId)
		let copyText
		if (String(type).toUpperCase() === 'TEMPLATE') {
			copyText = `{{main_${parameter.name}}}`
		} else {
			copyText = `{{${String(type).toLowerCase()}_${id}_${parameter.name}}}`
		}
		await copyToClipboard(copyText)
		// await navigator.clipboard.writeText(copyText)
		toast({
			title: '复制成功',
			description: '参数引用已复制到剪贴板'
		})
	} catch (error) {
		console.error('复制失败:', error)
		toast({
			title: '复制失败',
			description: '无法复制到剪贴板',
			variant: 'destructive'
		})
	}
}
</script> 