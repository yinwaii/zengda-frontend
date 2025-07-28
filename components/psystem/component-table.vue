<template>
	<div class="w-full">
		<component-table-dialog v-model="componentTableDialogVisible" @submit="onSelectComponents" />
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onAddComponent">添加组件</el-button>
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
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="components.length" />
		</div>
		<component-dialog v-model="dialogVisible" :component-id="componentId" @submit="onSubmit" />
	</div>
</template>

<script setup lang="tsx">
const props = defineProps<{
	psystemId: number
}>()
const entityApis = useEntityApis()
const components_list = ref<number[]>([])
const components = ref<ZdComponent[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const componentId = ref<number | null>(null)
const componentTableDialogVisible = ref(false)
onMounted(async () => {
	await handleRefresh()
})
const handleRefresh = async () => {
	components_list.value = await entityApis.psystem_component.getAll(props.psystemId)
	const components_res = await Promise.all(components_list.value.map(async (id: number) => (await entityApis.component.get(id))))
	components.value = components_res
}

const onClick = (row: any, column: any, event: Event) => {
	// 检查点击的元素是否为按钮，如果是按钮则不跳转
	if ((event.target as HTMLElement).closest('button')) {
		return
	}
	navigateTo(`/component/${row.id}`, { replace: true })
}
const onSelectComponents = async (components: ZdComponent[]) => {
	componentTableDialogVisible.value = false
	const newComponents = components.map((component: ZdComponent) => component.id).filter((id: number) => !components_list.value.includes(id))
	components_list.value = [...components_list.value, ...newComponents]
	await entityApis.psystem_component.update(props.psystemId, components_list.value)
	await handleRefresh()
}
const onAddComponent = () => {
	componentTableDialogVisible.value = true
}
const onSubmit = async (component: Partial<ZdComponent>) => {
	try {
		if (componentId.value === null) {
			const res = await entityApis.component.create(component)
			console.log(res)
		components_list.value.push(res.id)
		await entityApis.psystem_component.update(props.psystemId, components_list.value)
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
	ElMessageBox.confirm('确定删除该组件吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
	try {
		components_list.value = components_list.value.filter((id: number) => id !== component.id)
		await entityApis.psystem_component.update(props.psystemId, components_list.value)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
	})
}
</script>