<template>
	<el-dialog v-model="dialogVisible" title="选择功能" width="800" :close-on-click-modal="true">
		<div class="w-full">
			<div class="flex items-center gap-2">
				<el-button type="primary" @click="onNewPSystem">新建功能</el-button>
			</div>
			<div class="flex items-center gap-2 p-2">
				<el-text>搜索：</el-text>
				<el-input v-model="search" placeholder="搜索" @change="handleRefresh" style="width: 200px" />
				<el-button type="primary" @click="handleRefresh">搜索</el-button>
				<el-text>更新人：</el-text>
				<el-input v-model="updatedBy" placeholder="更新人" @change="handleRefresh" style="width: 200px" />
				<el-button type="primary" @click="handleRefresh">筛选</el-button>
			</div>
			<el-table ref="tableRef" :data="psystems.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="id" label="ID" width="60" />
				<el-table-column prop="name" label="功能名称" />
				<el-table-column prop="description" label="功能描述" />
				<el-table-column prop="updatedTime" label="更新时间" />
				<el-table-column prop="updatedBy" label="更新人" />
			</el-table>
			<div class="flex justify-center mt-4">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="psystems.length" />
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
const psystems = ref<ZdPSystem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = defineModel<boolean>('dialogVisible')
const psystemId = ref<number | null>(null)
const tableRef = useTemplateRef<TableInstance>('tableRef')
const search = ref('')
const updatedBy = ref('')
const emit = defineEmits<{
	(e: 'submit', psystems: ZdPSystem[]): void
}>()
onMounted(async () => {
	await handleRefresh()
})

const onNewPSystem = () => {
	psystemId.value = null
	dialogVisible.value = true
}
const onSubmit = () => {
	dialogVisible.value = false
	const selectedRows = tableRef.value?.getSelectionRows()
	emit('submit', selectedRows)
}
const handleRefresh = async () => {
	psystems.value = (await entityApis.psystem.getAll())
	if (search.value) {
		psystems.value = psystems.value.filter(psystem => psystem.name.includes(search.value) || psystem.description?.includes(search.value))
	}
	if (updatedBy.value) {
		psystems.value = psystems.value.filter(psystem => psystem.updatedBy?.includes(updatedBy.value))
	}
}
</script>