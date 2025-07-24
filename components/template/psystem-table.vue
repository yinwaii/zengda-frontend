<template>
	<div class="w-full">
		<psystem-table-dialog v-model="psystemDialogVisible" @submit="onSelectPSystems" />
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewPSystem">新建模块</el-button>
			<el-button type="primary" @click="onAddPSystem">添加模块</el-button>
		</div>
		<el-table :data="psystems.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe @row-click="onClick">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="模块名称" />
			<el-table-column prop="description" label="模块描述" />
			<el-table-column prop="updatedTime" label="更新时间" />
			<el-table-column prop="updatedBy" label="更新人" />
			<el-table-column label="操作" width="250">
				<template #default="scope">
					<el-button type="primary" @click="onPasteTag(scope.row)">tag</el-button>
					<el-button type="primary" @click="onEditPSystem(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeletePSystem(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="psystems.length" />
		</div>
		<psystem-dialog v-model="dialogVisible" :psystem-id="psystemId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const props = defineProps<{
	templateId: number
}>()
const entityApis = useEntityApis()
const psystems = ref<ZdPSystem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const psystemDialogVisible = ref(false)
const psystemId = ref<number | null>(null)
onMounted(async () => {
	await handleRefresh()
})
const handleRefresh = async () => {
	psystems.value = (await entityApis.template_psystem.getByTemplateId(props.templateId)).list
}

const onClick = (row: any, column: any, event: Event) => {
	// 检查点击的元素是否为按钮，如果是按钮则不跳转
	if ((event.target as HTMLElement).closest('button')) {
		return
	}
	navigateTo(`/psystem/${row.id}`, { replace: true })
}
const onSelectPSystems = async(psystems: ZdPSystem[]) => {
	psystemDialogVisible.value = false
	await Promise.all(psystems.map(async (psystem: ZdPSystem) => (await entityApis.template_psystem.create(props.templateId, psystem.id))))
	await handleRefresh()
}
const onNewPSystem = () => {
	psystemId.value = null
	dialogVisible.value = true
}
const onSubmit = async (psystem: Partial<ZdPSystem>) => {
	try {
		if (psystemId.value === null) {
			const res = await entityApis.psystem.create(psystem)
			await entityApis.template_psystem.create(props.templateId, res.id)
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
	dialogVisible.value = true
}
const onDeletePSystem = async (psystem: ZdPSystem) => {
	try {
		await entityApis.template_psystem.delete(props.templateId, psystem.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onAddPSystem = () => {
	psystemDialogVisible.value = true
}
const onPasteTag = async (psystem: ZdPSystem) => {
	const specification = await entityApis.specification.getAll(psystem.specId)
	if (specification) {
		console.log(specification.fileTag)
		await copyToClipboard(`{{+${specification.fileTag}}}`)
		ElMessage.success('复制成功')
	}
}
</script>