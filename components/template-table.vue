<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewTemplate">新建模板</el-button>
		</div>
		<el-table :data="templates.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
			@row-click="onClick">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="模板名称" />
			<el-table-column prop="description" label="模板描述" />
			<el-table-column prop="updatedTime" label="更新时间" />
			<el-table-column prop="updatedBy" label="更新人" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="onEditTemplate(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeleteTemplate(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="templates.length" />
		</div>
		<template-dialog v-model="templateDialogVisible" :template-id="templateId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const entityApis = useEntityApis()
const templates = ref<ZdTemplate[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const templateDialogVisible = ref(false)
const templateId = ref<number | null>(null)
onMounted(async () => {
	await handleRefresh()
})


const onClick = (row: any, column: any, event: Event) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/new/template/${row.id}`, { replace: true })
}
const onNewTemplate = () => {
	templateId.value = null
	templateDialogVisible.value = true
}
const onSubmit = async (template: Partial<ZdTemplate>) => {
	if (templateId.value === null) {
		await entityApis.template.create(template)
	} else {
		await entityApis.template.update(template)
	}
	await handleRefresh()
}
const onEditTemplate = (template: ZdTemplate) => {
	templateId.value = template.id
	templateDialogVisible.value = true
}
const onDeleteTemplate = async (template: ZdTemplate) => {
	await entityApis.template.delete(template.id)
	await handleRefresh()
}
const handleRefresh = async () => {
	templates.value = (await entityApis.template.getByPage(0, 100)).content
}
</script>