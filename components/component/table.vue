<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewComponent">新建组件</el-button>
		</div>
		<div class="flex items-center gap-2 p-2">
			<el-text>搜索：</el-text>
			<el-input v-model="search" placeholder="搜索" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">搜索</el-button>
			<el-text>更新人：</el-text>
			<el-input v-model="updatedBy" placeholder="更新人" @change="handleRefresh" style="width: 200px" />
			<el-button type="primary" @click="handleRefresh">筛选</el-button>
		</div>
		<el-table :data="components.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
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
const search = ref('')
const updatedBy = ref('')
onMounted(async () => {
	await handleRefresh()
})
const handleRefresh = async () => {
	components.value = (await entityApis.component.getAll()).list
	if (search.value) {
		components.value = components.value.filter(component => component.name.includes(search.value) || component.description?.includes(search.value))
	}
	if (updatedBy.value) {
		components.value = components.value.filter(component => component.updatedBy?.includes(updatedBy.value))
	}
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
const onSubmit = async (component: Partial<ZdComponent>) => {
	try {
		if (componentId.value === null) {
			await entityApis.component.create(component)
		} else {
			await entityApis.component.update(component)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onEditComponent = (component: ZdComponent) => {
	componentId.value = component.id
	dialogVisible.value = true
}
const onDeleteComponent = async (component: ZdComponent) => {
	try {
		await entityApis.component.delete(component.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
</script>