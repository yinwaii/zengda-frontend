<template>
	<div class="w-full">
		<component-table-dialog v-model="componentTableDialogVisible" @submit="onSelectComponents" />
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="onNewComponent">新建组件</el-button>
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
	templateId: number
}>()
const entityApis = useEntityApis()
const tcomponents = ref<ZdTComponent[]>([])
// const components_list = ref<number[]>([])
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
	tcomponents.value = (await entityApis.template_component.getByTemplateId(props.templateId)).list
	const components_list = tcomponents.value.map((item: ZdTComponent) => item.componentId)
	const components_res = await Promise.all(components_list.map(async (id: number) => (await entityApis.component.get(id))))
	components.value = components_res
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
			const res = await entityApis.component.create(component)
			const tcomponent = await entityApis.template_component.create({
			psystemId: 1,
			templateId: props.templateId,
			componentId: res.id
		})
		tcomponents.value.push(tcomponent)
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
		const tcomponent = tcomponents.value.find((item: ZdTComponent) => item.componentId === component.id)
		if (tcomponent) {
			await entityApis.template_component.delete(tcomponent.id)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}
const onSelectComponents = async (components: ZdComponent[]) => {
	componentTableDialogVisible.value = false
	const newComponents = components.map((component: ZdComponent) => component.id).filter((id: number) => !tcomponents.value.some((item: ZdTComponent) => item.componentId === id))
	await Promise.all(newComponents.map(async (id: number) => (await entityApis.template_component.create({
		psystemId: 1,
		templateId: props.templateId,
		componentId: id
	}))))
	await handleRefresh()
}
const onAddComponent = () => {
	componentTableDialogVisible.value = true
}
</script>