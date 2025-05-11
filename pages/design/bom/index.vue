<template>
	<div class="p-6 h-full">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold">物料清单管理</h2>
			<div class="flex space-x-2">
				<shadcn-button variant="outline" @click="handleRefresh" :disabled="tableState.loading">
					<lucide-refresh-cw class="mr-2 h-4 w-4" />
					刷新
				</shadcn-button>
				<shadcn-button @click="handleAddBom">
					<lucide-plus class="mr-2 h-4 w-4" />
					新建物料清单
				</shadcn-button>
			</div>
		</div>

		<abstract-data-table 
			ref="dataTable" 
			:data="tableState.items" 
			:columns="bomColumns" 
			:loading="tableState.loading"
			v-model:selected-rows="selectedRows"
			:on-row-click="handleClick"
		></abstract-data-table>

		<!-- 编辑对话框 -->
		<design-bom-dialog 
			v-model:open="dialogVisible" 
			:bom="editingBom"
			@save="handleBomSubmit" 
		/>
	</div>
</template>

<script setup lang="tsx">
import { navigateTo } from '#app'
import { h, ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '~/components/ui/toast'
import type { ZdBom } from '~/models/entity/bom'
import { formatDate } from '~/utils/date'

const dataTableRef = useTemplateRef<any>('dataTable')
const entityApis = useEntityApis()
const { toast } = useToast()

// 对话框控制
const dialogVisible = ref(false)
const editingBom = ref<ZdBom | undefined>(undefined)

// 表格状态
const tableState = ref({
	items: [] as any[],
	loading: false,
	columnVisibility: {},
	sortBy: null,
	filterBy: null
})

// 选中的行
const selectedRows = ref<ZdBom[]>([])

// 重置表格设置
const handleReset = () => {
	if (dataTableRef.value) {
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
	tableState.value.loading = true
	try {
		// 获取组件列表，从中提取BOM ID
		const componentsResp = await entityApis.component.getAll()
		// 检查是否有数据
		if (componentsResp && Array.isArray(componentsResp)) {
			// 从组件中提取有效的BOM ID（必须为数字）
			const bomIds = componentsResp
				.filter((comp) => comp.bomId !== undefined && comp.bomId !== null)
				.map((comp) => Number(comp.bomId))
				.filter((id): id is number => !isNaN(id) && typeof id === 'number')

			// 去重
			const uniqueBomIds = [...new Set(bomIds)]
			
			// 获取所有BOM数据
			const bomPromises = uniqueBomIds.map(id => entityApis.bom.get(id))
			const bomsData = await Promise.all(bomPromises)
			
			// 过滤掉无效结果并转换数据
			const validBoms = bomsData.filter(Boolean)
			
			// 转换为表格显示格式，添加自定义字段
			tableState.value.items = validBoms.map(bom => ({
				id: bom.id,
				number: bom.number,
				name: bom.number || `BOM ${bom.id}`,
				version: bom.version,
				componentId: bom.componentId,
				note: bom.note,
				itemCount: bom.items?.length || 0,
				// 使用当前时间填充时间戳
				createdTime: formatDate(new Date()),
				updatedTime: formatDate(new Date())
			}))
		} else {
			tableState.value.items = []
		}
		
		toast({
			title: "成功",
			description: "物料清单数据已刷新",
		})
	} catch (error) {
		console.error('获取BOM数据失败:', error)
		toast({
			title: "错误",
			description: "获取物料清单数据失败",
			variant: "destructive",
		})
	} finally {
		tableState.value.loading = false
	}
}

// 处理编辑
const handleEdit = (row: any) => {
	// 确保 row.id 是有效的数字
	if (typeof row.id !== 'number' || isNaN(row.id)) {
		toast({
			title: "错误",
			description: "无效的BOM ID",
			variant: "destructive",
		})
		return
	}
	
	editingBom.value = row
	dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: any) => {
	// 确保 row.id 是有效的数字
	if (typeof row.id !== 'number' || isNaN(row.id)) {
		toast({
			title: "错误",
			description: "无效的BOM ID",
			variant: "destructive",
		})
		return
	}
	
	try {
		// data方法实际上是用于删除操作
		await entityApis.bom.data(row.id)
		toast({
			title: "成功",
			description: "物料清单已删除",
		})
		await handleRefresh()
	} catch (error) {
		console.error('删除BOM失败:', error)
		toast({
			title: "错误",
			description: "删除物料清单失败",
			variant: "destructive",
		})
	}
}

// 处理提交
const handleBomSubmit = async (data: any) => {
	try {
		if (editingBom.value && editingBom.value.id) {
			// 编辑现有BOM
			await entityApis.bom.update({
				...data,
				id: editingBom.value.id
			})
			toast({
				title: "成功",
				description: "物料清单已更新",
			})
		} else {
			// 创建新BOM
			await entityApis.bom.create(data)
			toast({
				title: "成功",
				description: "物料清单已创建",
			})
		}
		
		dialogVisible.value = false
		editingBom.value = undefined
		await handleRefresh()
		return true
	} catch (error) {
		console.error('保存BOM失败:', error)
		toast({
			title: "错误",
			description: "保存物料清单失败",
			variant: "destructive",
		})
		return false
	}
}

// 添加新物料清单
const handleAddBom = () => {
	editingBom.value = undefined
	dialogVisible.value = true
}

// 处理行点击
const handleClick = (row: ZdBom) => {
	// 直接导航到详情页面，不需要阻止事件冒泡
	navigateTo(`/design/bom/${row.id}`);
}

// 准备列定义
const bomColumns = ref([
	{
		id: 'id',
		header: 'ID',
		accessorKey: 'id',
		meta: { width: '80px' }
	},
	{
		id: 'number',
		header: '编号',
		accessorKey: 'number',
		meta: {}
	},
	{
		id: 'name',
		header: '名称',
		accessorKey: 'number',
		meta: {}
	},
	{
		id: 'version',
		header: '版本',
		accessorKey: 'version',
		meta: {}
	},
	{
		id: 'componentId',
		header: '组件ID',
		accessorKey: 'componentId',
		meta: {}
	},
	{
		id: 'note',
		header: '备注',
		accessorKey: 'note',
		meta: {},
		cell: ({ row }: { row: any }) => 
			row?.original?.note || '无备注'
	},
	{
		id: 'itemCount',
		header: '物料数量',
		accessorKey: 'itemCount',
		meta: {},
		cell: ({ row }: { row: any }) => 
			row?.original?.itemCount || 0
	},
	{
		id: 'createdTime',
		header: '创建时间',
		accessorKey: 'createdTime',
		meta: {},
		cell: ({ row }: { row: any }) => 
			row?.original?.createdTime || '未知'
	},
	{
		id: 'updatedTime',
		header: '更新时间',
		accessorKey: 'updatedTime',
		meta: {},
		cell: ({ row }: { row: any }) => 
			row?.original?.updatedTime || '未知'
	},
	{
		id: 'actions',
		header: '操作',
		meta: {},
		cell: ({ row }: { row: any }) => {
			if (!row?.original) return null;
			return h('div', { class: 'flex items-center gap-2' }, [
				h('button', { 
					class: 'px-3 py-1 text-sm rounded bg-blue-500 text-white flex items-center',
					onClick: (e: Event) => {
						e.stopPropagation();
						handleEdit(row.original);
					}
				}, [
					h('span', { class: 'mr-1' }, '✏️'),
					'编辑'
				]),
				h('button', { 
					class: 'px-3 py-1 text-sm rounded bg-red-500 text-white flex items-center',
					onClick: (e: Event) => {
						e.stopPropagation();
						handleDelete(row.original);
					}
				}, [
					h('span', { class: 'mr-1' }, '🗑️'),
					'删除'
				])
			]);
		}
	}
]);

// 初始化
onMounted(async () => {
	// 加载数据
	await handleRefresh()
})
</script> 