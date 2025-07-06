<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewComponent">新建组件</el-button>
		</div>
		<el-table :data="components.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe :height="'50vh'"
			@row-click="onClick">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="组件名称" />
			<el-table-column prop="description" label="组件描述" />
			<el-table-column prop="updatedTime" label="更新时间" />
			<el-table-column prop="updatedBy" label="更新人" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="onEditComponent(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeleteComponent(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页居中显示 -->
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="components.length" />
		</div>
		<component-dialog v-model="dialogVisible" :component-id="componentId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const entityApis = useEntityApis()
const components = ref<ZdComponent[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const componentId = ref<number | null>(null)
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
	navigateTo(`/new/component/${row.id}`, { replace: true })
}
const onNewComponent = () => {
	componentId.value = null
	dialogVisible.value = true
}
const onSubmit = async (component: Partial<ZdComponent>) => {
	if (componentId.value === null) {
		await entityApis.component.create(component)
	} else {
		await entityApis.component.update(component)
	}
	await handleRefresh()
}
const onEditComponent = (component: ZdComponent) => {
	componentId.value = component.id
	dialogVisible.value = true
}
const onDeleteComponent = async (component: ZdComponent) => {
	await entityApis.component.delete(component.id)
	await handleRefresh()
}
</script>