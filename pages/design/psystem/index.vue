<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref } from 'vue'
import { TimeStampColumnVisibility } from '~/models/column'
import { useToast } from '@/components/ui/toast'
import type { ZdPSystem } from '~/models/entity/psystem'

definePageMeta({
	name: 'design-project-psystem-total',
	keepalive: false,
	// keepalive: {
	// 	max: 10, // 设置最大缓存数量
	// 	include: ['design-project-psystem-total']
	// }
})

// 定义模块的列信息
const ZdPSystemColumns = [
    { accessorKey: 'id', header: '序号', meta: { width: '80px' } },
    { accessorKey: 'name', header: '名称', meta: { width: '200px' } },
    { accessorKey: 'description', header: '描述' },
    // { accessorKey: 'parentId', header: '父系统ID', meta: { width: '120px' } },
    // { accessorKey: 'docsUrl', header: '文档链接', meta: { width: '200px' } },
    { accessorKey: 'specId', header: '规格ID', meta: { width: '120px' } },
    { accessorKey: 'isShow', header: '是否可见', 
        cell: ({ row }: { row: any }) => {
            const isShow = row.getValue('isShow')
            return <div>
                <shadcn-badge variant={isShow ? 'default' : 'secondary'}>
                    {isShow ? '可见' : '隐藏'}
                </shadcn-badge>
            </div>
        },
        meta: { width: '100px' }
    },
    { accessorKey: 'createdTime', header: '创建时间', meta: { width: '180px' } },
    { accessorKey: 'updatedTime', header: '修改时间', meta: { width: '180px' } },
]

const dataTableRef = useTemplateRef<any>('dataTable')
const { psystem: psystemApi } = useEntityApis()
const data = ref<ZdPSystem[]>([])
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingPSystem = ref<ZdPSystem | undefined>(undefined)

// 使用持久化状态管理
const { loadState, saveState, clearState } = useTableState('design-project-psystem-total')

// 保存表格状态
const tableState = ref({
	columnVisibility: null,
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdPSystem[]>([])

// 重置表格设置
const handleReset = () => {
	if (dataTableRef.value) {
		// 清除保存的状态
		clearState()
		// 重置表格到默认状态
		dataTableRef.value.columnVisibility = {
			...dataTableRef.value.columnVisibility,
			...TimeStampColumnVisibility,
		}
		dataTableRef.value.sortBy = null
		dataTableRef.value.filterBy = null
	}
}

// 刷新数据
const handleRefresh = async () => {
	try {
		const response = await psystemApi.getByPage(0, 100)
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
const handleEdit = (psystem: ZdPSystem) => {
	editingPSystem.value = { ...psystem }
	dialogVisible.value = true
}

// 处理删除操作
const handleDelete = async (psystem: ZdPSystem) => {
	if (!psystem.id) {
		toast({
			title: '删除失败',
			description: '无效的模块ID',
			variant: 'destructive'
		})
		return
	}

	try {
		if (confirm('确定要删除此模块吗？')) {
			await psystemApi.delete(psystem.id)
			toast({
				title: '删除成功',
				description: `模块 "${psystem.name}" 已被删除`
			})
			await handleRefresh()
		}
	} catch (error) {
		console.error('删除模块失败:', error)
		toast({
			title: '删除失败',
			description: '无法删除模块，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 处理表单提交
const handlePSystemSubmit = async (psystem: Partial<ZdPSystem>) => {
	try {
		let result
		console.log('提交模块:', psystem)
		if (psystem.id) {
			// 更新现有模块
			result = await psystemApi.update(psystem)
			toast({
				title: '更新成功',
				description: `模块 "${psystem.name}" 已更新`
			})
		} else {
			// 创建新模块
			result = await psystemApi.create(psystem)
			toast({
				title: '创建成功',
				description: `模块 "${psystem.name}" 已创建`
			})
		}
		await handleRefresh()
		dialogVisible.value = false
	} catch (error) {
		console.error('保存模块失败:', error)
		toast({
			title: '保存失败',
			description: '无法保存模块，请稍后重试',
			variant: 'destructive'
		})
	}
}

// 添加新模块
const handleAddPSystem = () => {
	editingPSystem.value = undefined
	dialogVisible.value = true
}

// 准备列定义，注入编辑和删除的逻辑
const psystemColumns = ref([
	...ZdPSystemColumns,
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
				...TimeStampColumnVisibility,
			}
		}
	}
	
	// 获取数据
	try {
		const response = await psystemApi.getByPage(0, 100)
		data.value = response.content
	} catch (error) {
		console.error('获取数据失败:', error)
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

const onClick = (row: ZdPSystem) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/design/psystem/${row.id}`, { replace: true })
}
</script>
<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-bold">模块列表</h2>
			<shadcn-button @click="handleAddPSystem">新建模块</shadcn-button>
		</div>
		
		<abstract-data-table ref="dataTable" :data="data" :columns="psystemColumns" v-model:selected-rows="selectedRows"
			:on-row-click="onClick"></abstract-data-table>
			
		<!-- 编辑对话框 -->
		<design-psystem-dialog
			v-model:open="dialogVisible"
			:system="editingPSystem"
			@save="handlePSystemSubmit"
		/>
	</div>
</template> 