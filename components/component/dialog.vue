<template>
	<el-dialog v-model="dialogVisible" title="物料组件">
		<el-form :model="component" label-width="auto">
			<el-form-item label="组件名称">
				<el-input v-model="component.name" />
			</el-form-item>
			<el-form-item label="组件描述">
				<el-input v-model="component.description" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const props = defineProps<{
	componentId: number | null
}>()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdComponent>): void
}>()
const emptyComponent = () => {
	return {
		name: '',
		description: '',
		updatedBy: '',
		createdBy: '',
		isShow: true,
		isRequired: false,
	}
}
const component = ref<Partial<ZdComponent>>(emptyComponent())
const dialogVisible = defineModel<boolean>({ required: true })
watch(props, async (newVal) => {
	if (newVal.componentId) {
		component.value = await entityApis.component.get(newVal.componentId)
		delete component.value.isDeleted
	}
	else {
		component.value = emptyComponent()
	}
})
const onSubmit = async () => {
	emit('submit', component.value)
	dialogVisible.value = false
}
</script>