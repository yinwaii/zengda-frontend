<template>
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
		<el-table :data="psystems.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
			@row-click="onClick">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="功能名称" />
			<el-table-column prop="description" label="功能描述" />
			<el-table-column prop="updatedTime" label="更新时间" />
			<el-table-column prop="updatedBy" label="更新人" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="onEditPSystem(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeletePSystem(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="psystems.length" />
		</div>
		<psystem-dialog v-model="psystemDialogVisible" :psystem-id="psystemId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const entityApis = useEntityApis()
const psystems = ref<ZdPSystem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const psystemDialogVisible = ref(false)
const psystemId = ref<number | null>(null)
const search = ref('')
const updatedBy = ref('')
onMounted(async () => {
	await handleRefresh()
})


const onClick = (row: any, column: any, event: Event) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/new/psystem/${row.id}`, { replace: true })
}
const onNewPSystem = () => {
	psystemId.value = null
	psystemDialogVisible.value = true
}
const onSubmit = async (psystem: Partial<ZdPSystem>) => {
	try {
		if (psystemId.value === null) {
			await entityApis.psystem.create(psystem)
		} else {
			await entityApis.psystem.update(psystem)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onEditPSystem = (psystem: ZdPSystem) => {
	psystemId.value = psystem.id
	psystemDialogVisible.value = true
}
const onDeletePSystem = async (psystem: ZdPSystem) => {
	try {
		await entityApis.psystem.delete(psystem.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
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