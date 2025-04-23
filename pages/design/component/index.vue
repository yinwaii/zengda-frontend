<template>
	<div class="p-6 h-full">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold">组件管理</h2>
			<div class="flex space-x-2">
				<shadcn-button variant="outline" @click="handleRefresh">
					<lucide-refresh-cw class="mr-2 h-4 w-4" />
					刷新
				</shadcn-button>
				<shadcn-button @click="handleAddComponent">
					<lucide-plus class="mr-2 h-4 w-4" />
					新建组件
				</shadcn-button>
			</div>
		</div>

		<abstract-data-table 
			ref="dataTable" 
			:data="data" 
			:columns="componentColumns" 
			v-model:selected-rows="selectedRows"
			:on-row-click="onClick"
		></abstract-data-table>

		<!-- 编辑对话框 -->
		<design-component-dialog 
			v-model:open="dialogVisible" 
			:component="editingComponent"
			@save="handleComponentSubmit" 
		/>
	</div>
</template>

<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import type { ZdComponent } from '~/models/entity/component'

definePageMeta({
	name: 'design-component-index',
	keepalive: false,
	// keepalive: {
	// 	max: 10,
	// 	include: ['design-component-index']
	// },
	middleware: [() => {}]
})

const dataTableRef = useTemplateRef<any>('dataTable')
const entityApis = useEntityApis()
const data = ref<ZdComponent[]>([])
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingComponent = ref<ZdComponent | undefined>(undefined)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('design-component-index')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdComponent[]>([])

// 重置表格设置
const handleReset = () => {
	if (dataTableRef.value) {
		// 清除保存的状态
		clearState()
		// 重置表格到默认状态
		dataTableRef.value.columnVisibility = {
			...dataTableRef.value.columnVisibility,
			createdTime: false,
			updatedTime: false
		}
		dataTableRef.value.sortBy = null
		dataTableRef.value.filterBy = null
	}
}

// 刷新数据
const handleRefresh = async () => {
	try {
		const response = await entityApis.component.getByPage(0, 100)
		data.value = response.content
		toast({
			title: '刷新成功',
			description: `已获取 ${response.content.length} 条数据`
		})
	} catch (error) {
		console.error('刷新数据失败:', error)
		toast({
			title: '刷新失败',
			description: '无法获取数据，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理编辑操作
const handleEdit = (component: ZdComponent) => {
	editingComponent.value = { ...component }
	dialogVisible.value = true
}

// 处理删除操作
const handleDelete = async (component: ZdComponent) => {
	if (!component.id) {
		toast({
			title: '删除失败',
			description: '无效的组件ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此组件吗？')) {
			await entityApis.component.delete(component.id)
			toast({
				title: '删除成功',
				description: `组件 "${component.name}" 已被删除`
			})
			await handleRefresh()
		}
	} catch (error) {
		console.error('删除组件失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除组件，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handleComponentSubmit = async (component: Partial<ZdComponent>) => {
	try {
		if (component.id) {
			// 编辑现有组件
			await entityApis.component.update(component)
			toast({ 
				title: "成功", 
				description: "组件已更新" 
			})
		} else {
			// 创建新组件
			await entityApis.component.create(component)
			toast({ 
				title: "成功", 
				description: "组件已创建" 
			})
		}
		
		// 刷新数据
		await handleRefresh()
		// 关闭对话框
		dialogVisible.value = false
	} catch (err) {
		console.error('保存组件失败:', err)
		toast({ 
			title: "错误", 
			description: "保存组件失败", 
			variant: "destructive"
		})
	}
}

// 添加新组件
const handleAddComponent = () => {
	editingComponent.value = undefined
	dialogVisible.value = true
}

// 准备列定义
const componentColumns = ref([
	{
		id: 'id',
		header: 'ID',
		accessorKey: 'id',
		meta: { width: '80px' }
	},
	{
		id: 'name',
		header: '名称',
		accessorKey: 'name',
	},
	{
		id: 'description',
		header: '描述',
		accessorKey: 'description',
	},
	{
		id: 'price',
		header: '价格',
		accessorKey: 'price',
		cell: ({ row }: { row: any }) => {
			return row.original.price || '未设置'
		}
	},
	{
		id: 'value',
		header: '数量',
		accessorKey: 'value',
		cell: ({ row }: { row: any }) => {
			return row.original.value || '未设置'
		}
	},
	{
		id: 'isShow',
		header: '是否显示',
		accessorKey: 'isShow',
		cell: ({ row }: { row: any }) => {
			return row.original.isShow ? 
				<shadcn-badge>是</shadcn-badge> : 
				<shadcn-badge variant="outline">否</shadcn-badge>
		}
	},
	{
		id: 'isRequired',
		header: '是否必须',
		accessorKey: 'isRequired',
		cell: ({ row }: { row: any }) => {
			return row.original.isRequired ? 
				<shadcn-badge>是</shadcn-badge> : 
				<shadcn-badge variant="outline">否</shadcn-badge>
		}
	},
	{
		id: 'createdTime',
		header: '创建时间',
		accessorKey: 'createdTime',
		cell: ({ row }: { row: any }) => {
			return row.original.createdTime ? new Date(row.original.createdTime).toLocaleString() : '未知'
		}
	},
	{
		id: 'updatedTime',
		header: '更新时间',
		accessorKey: 'updatedTime',
		cell: ({ row }: { row: any }) => {
			return row.original.updatedTime ? new Date(row.original.updatedTime).toLocaleString() : '未知'
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		enableSorting: false,
		cell: ({ row }: { row: any }) => {
			return <div class="relative">
				<abstract-data-table-drop-down
					onExpand={row.toggleExpanded}
					onEdit={() => handleEdit(row.original)}
					onDelete={() => handleDelete(row.original)}
				/>
			</div>
		},
		meta: { width: '80px' }
	},
])

onMounted(async () => {
	if (dataTableRef.value) {
		// 尝试从 localStorage 加载状态
		const savedState = loadState()
		if (savedState) {
			dataTableRef.value.columnVisibility = savedState.columnVisibility
			dataTableRef.value.sortBy = savedState.sortBy
			dataTableRef.value.filterBy = savedState.filterBy
		} else {
			// 否则使用默认状态
			dataTableRef.value.columnVisibility = {
				...dataTableRef.value.columnVisibility,
				createdTime: false,
				updatedTime: false
			}
		}
	}

	// 获取数据
	try {
		const response = await entityApis.component.getByPage(0, 100)
		data.value = response.content
	} catch (error) {
		console.error('获取数据失败:', error)
		toast({
			title: '获取失败',
			description: '无法获取组件数据，请稍后重试',
			variant: 'destructive'
		})
	}
})

// 在组件停用前保存状态
onDeactivated(() => {
	if (dataTableRef.value) {
		const state = {
			columnVisibility: dataTableRef.value.columnVisibility,
			sortBy: dataTableRef.value.getSortBy?.(),
			filterBy: dataTableRef.value.getFilterBy?.()
		}
		tableState.value = state
		saveState(state)
	}
})

const onClick = (row: ZdComponent) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/design/component/${row.id}`, { replace: true })
}
</script> 