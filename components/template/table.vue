<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewTemplate">新建模板</el-button>
		</div>
		<div class="flex items-center gap-2 p-2">
			<el-text>搜索：</el-text>
			<el-input v-model="search" placeholder="搜索" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">搜索</el-button>
			<el-text>更新人：</el-text>
			<el-input v-model="updatedBy" placeholder="更新人" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">筛选</el-button>
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
const search = ref('')
const updatedBy = ref('')
onMounted(async () => {
	await handleRefresh()
})


const onClick = (row: any, column: any, event: Event) => {
	if ((event.target as HTMLElement).closest('button')) {
		return
	}
	console.log('Clicking row:', row.id)
	navigateTo(`/template/${row.id}`, { replace: true })
}
const onNewTemplate = () => {
	templateId.value = null
	templateDialogVisible.value = true
}
const onSubmit = async (template: Partial<ZdTemplate>) => {
	try {
		if (templateId.value === null) {
			await entityApis.template.create(template)
		} else {
			await entityApis.template.update(template)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onEditTemplate = (template: ZdTemplate) => {
	templateId.value = template.id
	templateDialogVisible.value = true
}
const onDeleteTemplate = async (template: ZdTemplate) => {
	ElMessageBox.confirm('确定删除该模板吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
	try {
		await entityApis.template.delete(template.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
	})
}
const handleRefresh = async () => {
	templates.value = (await entityApis.template.getByPage(0, 100)).content
	if (search.value) {
		templates.value = templates.value.filter(template => template.name.includes(search.value) || template.description?.includes(search.value))
	}
	if (updatedBy.value) {
		templates.value = templates.value.filter(template => template.updatedBy?.includes(updatedBy.value))
	}
}
</script>