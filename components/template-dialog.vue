<template>
	<el-dialog v-model="dialogVisible" title="产品模板">
		<el-form :model="template" label-width="auto">
			<el-form-item label="组件名称">
				<el-input v-model="template.name" />
			</el-form-item>
			<el-form-item label="组件描述">
				<el-input v-model="template.description" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const props = defineProps<{
	templateId: number | null
}>()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdTemplate>): void
}>()
const emptyTemplate = () => {
	return {
		name: '',
		description: '',
		isShow: true,
		components: [],
		psystems: [],
		parameters: [],
	}
}
const template = ref<Partial<ZdTemplate>>(emptyTemplate())
const dialogVisible = defineModel<boolean>({ required: true })
watch(props, async (newVal) => {
	if (newVal.templateId) {
		template.value = await entityApis.template.get(newVal.templateId)
		delete template.value.isDeleted
	}
	else {
		template.value = emptyTemplate()
	}
})
const onSubmit = async () => {
	emit('submit', template.value)
	dialogVisible.value = false
}
</script>