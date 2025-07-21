<template>
	<el-dialog v-model="dialogVisible" title="选择组件" width="800" :close-on-click-modal="true">
		<div class="w-full">
			<div class="flex items-center gap-2">
				<el-button type="primary" @click="onNewComponent">选择加入的组件</el-button>
			</div>
			<el-table ref="tableRef" :data="components.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
				@row-click="onClick">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="id" label="ID" width="60" />
				<el-table-column prop="name" label="组件名称" />
				<el-table-column prop="description" label="组件描述" />
				<el-table-column prop="updatedTime" label="更新时间" />
				<el-table-column prop="updatedBy" label="更新人" />
			</el-table>
			<!-- 分页居中显示 -->
			<div class="flex justify-center mt-4">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="components.length" />
			</div>
			<div class="flex justify-center mt-4">
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="tsx">
import type { TableInstance } from 'element-plus'
const entityApis = useEntityApis()
const components = ref<ZdComponent[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = defineModel<boolean>('dialogVisible')
const componentId = ref<number | null>(null)
const tableRef = useTemplateRef<TableInstance>('tableRef')
const emit = defineEmits<{
	(e: 'submit', components: ZdComponent[]): void
}>()
onMounted(async () => {
	await handleRefresh()
})
const handleRefresh = async () => {
	components.value = (await entityApis.component.getAll()).list
}

const onClick = (row: any, column: any, event: Event) => {
	// 检查点击的元素是否为按钮，如果是按钮则不跳转
	if ((event.target as HTMLElement).closest('button')) {
		return
	}
	navigateTo(`/component/${row.id}`, { replace: true })
}
const onNewComponent = () => {
	componentId.value = null
	dialogVisible.value = true
}
const onSubmit = () => {
	dialogVisible.value = false
	const selectedRows = tableRef.value?.getSelectionRows()
	emit('submit', selectedRows)
}
</script>