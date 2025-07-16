<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewProject">新建项目</el-button>
		</div>
		<div class="flex items-center gap-2 p-2">
			<el-text>搜索：</el-text>
			<el-input v-model="search" placeholder="搜索" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">搜索</el-button>
			<el-text>更新人：</el-text>
			<el-input v-model="updatedBy" placeholder="更新人" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">筛选</el-button>
		</div>
		<el-table :data="projects.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
			@row-click="onClick">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="项目名称" />
			<el-table-column prop="description" label="项目描述" />
			<el-table-column prop="updatedTime" label="更新时间" />
			<el-table-column prop="updatedBy" label="更新人" />
			<el-table-column label="操作">
					<template #default="scope">
						<el-button type="primary" @click="onEditProject(scope.row)">编辑</el-button>
						<el-button type="danger" @click="onDeleteProject(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页居中显示 -->
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="projects.length" />
		</div>
		<project-dialog v-model="projectDialogVisible" :project-id="projectId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const entityApis = useEntityApis()
const projects = ref<ZdProject[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const projectDialogVisible = ref(false)
const projectId = ref<number | null>(null)
const search = ref('')
const updatedBy = ref('')
onMounted(async () => {
	projects.value = (await entityApis.project.getByPage(0, 100)).content
})


const onClick = (row: any, column: any, event: Event) => {
	console.log('Clicking row:', row.id)
	navigateTo(`/project/${row.id}`, { replace: true })
}
const onNewProject = () => {
	projectId.value = null
	projectDialogVisible.value = true
}
const onSubmit = async (project: Partial<ZdProject>) => {
	try {
		if (projectId.value === null) {
			await entityApis.project.create(project)
		} else {
			await entityApis.project.update(project)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onEditProject = (project: ZdProject) => {
	projectId.value = project.id
	projectDialogVisible.value = true
}
const onDeleteProject = async (project: ZdProject) => {
	try {
		await entityApis.project.delete(project.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const handleRefresh = async () => {
	projects.value = (await entityApis.project.getByPage(0, 100)).content
	if (search.value) {
		projects.value = projects.value.filter(project => project.name.includes(search.value) || project.description?.includes(search.value))
	}
	if (updatedBy.value) {
		projects.value = projects.value.filter(project => project.updatedBy?.includes(updatedBy.value))
	}
}
</script>