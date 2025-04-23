<template>
	<div class="p-6 h-full">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold">产品类型管理</h2>
			<div class="flex space-x-2">
				<shadcn-button variant="outline" @click="handleRefresh">
					<lucide-refresh-cw class="mr-2 h-4 w-4" />
					刷新
				</shadcn-button>
				<shadcn-button @click="handleAddPType">
					<lucide-plus class="mr-2 h-4 w-4" />
					新建产品类型
				</shadcn-button>
			</div>
		</div>

		<abstract-data-table 
			ref="dataTable" 
			:data="data" 
			:columns="ptypeColumns" 
			v-model:selected-rows="selectedRows"
			:on-row-click="onClick"
		></abstract-data-table>

		<!-- 编辑对话框 -->
		<manage-ptype-dialog 
			v-model:open="dialogVisible" 
			:ptype="editingPType"
			@save="handlePTypeSubmit" 
		/>
	</div>
</template>

<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref, onMounted, onDeactivated, useTemplateRef } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useTableState } from '@/composables/use-table-state'
import type { ZdPType } from '~/models/entity/ptype'

definePageMeta({
	name: 'manage-ptype-index',
	keepalive: false,
	// keepalive: {
	// 	max: 10,
	// 	include: ['manage-ptype-index']
	// },
	middleware: [() => {}]
})

// 添加格式化日期函数
const formatDate = (date: Date): string => {
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

const dataTableRef = useTemplateRef<any>('dataTable')
const entityApis = useEntityApis()
const data = ref<ZdPType[]>([])
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingPType = ref<ZdPType | undefined>(undefined)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('manage-ptype-index')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdPType[]>([])

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
		const response = await entityApis.ptype.getAll()
		data.value = response
		toast({
			title: '刷新成功',
			description: `已获取 ${response.length} 条数据`
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

// 处理点击行跳转到详情页
const onClick = (row: ZdPType) => {
	navigateTo(`/manage/ptype/${row.id}`)
}

// 处理编辑操作
const handleEdit = (ptype: ZdPType) => {
	editingPType.value = { ...ptype }
	dialogVisible.value = true
}

// 处理删除操作
const handleDelete = async (ptype: ZdPType) => {
	if (!ptype.id) {
		toast({
			title: '删除失败',
			description: '无效的产品类型ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此产品类型吗？')) {
			await entityApis.ptype.delete(ptype.id)
			toast({
				title: '删除成功',
				description: `产品类型 "${ptype.name}" 已被删除`
			})
			await handleRefresh()
		}
	} catch (error) {
		console.error('删除产品类型失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除产品类型，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handlePTypeSubmit = async (ptype: ZdPType) => {
	try {
		if (ptype.id) {
			// 编辑现有产品类型
			await entityApis.ptype.update(ptype)
			toast({ 
				title: "成功", 
				description: "产品类型已更新" 
			})
		} else {
			// 创建新产品类型
			await entityApis.ptype.create(ptype)
			toast({ 
				title: "成功", 
				description: "产品类型已创建" 
			})
		}
		
		// 刷新数据
		await handleRefresh()
		// 关闭对话框
		dialogVisible.value = false
	} catch (err) {
		console.error('保存产品类型失败:', err)
		toast({ 
			title: "错误", 
			description: "保存产品类型失败", 
			variant: "destructive"
		})
	}
}

// 添加新产品类型
const handleAddPType = () => {
	editingPType.value = undefined
	dialogVisible.value = true
}

// 准备列定义
const ptypeColumns = ref([
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
		meta: {}
	},
	{
		id: 'code',
		header: '代码',
		accessorKey: 'code',
		meta: {}
	},
	{
		id: 'model',
		header: '型号',
		accessorKey: 'model',
		meta: {}
	},
	{
		id: 'isShow',
		header: '显示状态',
		accessorKey: 'isShow',
		meta: { width: '100px' },
		cell: ({ row }: { row: any }) => {
			return h('div', { class: 'flex justify-center' }, [
				h('span', { 
					class: `px-2 py-1 rounded text-xs ${row.original.isShow ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`
				}, row.original.isShow ? '显示' : '隐藏')
			])
		}
	},
	{
		id: 'createdTime',
		header: '创建时间',
		accessorKey: 'createdTime',
		cell: ({ row }: { row: any }) => {
			const date = row.original.createdTime
			return date ? formatDate(new Date(date)) : ''
		},
		meta: {}
	},
	{
		id: 'updatedTime',
		header: '更新时间',
		accessorKey: 'updatedTime',
		cell: ({ row }: { row: any }) => {
			const date = row.original.updatedTime
			return date ? formatDate(new Date(date)) : ''
		},
		meta: {}
	},
	{
		id: 'actions',
		header: '操作',
		cell: ({ row }: { row: any }) => {
			return h('div', { class: 'flex space-x-2' }, [
				h('button', { 
					class: 'px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs',
					onClick: (e: Event) => {
						e.stopPropagation()
						handleEdit(row.original)
					}
				}, '编辑'),
				h('button', { 
					class: 'px-2 py-1 rounded bg-red-100 text-red-800 text-xs',
					onClick: (e: Event) => {
						e.stopPropagation()
						handleDelete(row.original)
					}
				}, '删除')
			])
		},
		meta: { width: '120px' }
	}
])

// 初始加载数据
onMounted(async () => {
	await handleRefresh()
	
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
</script> 