<template>
	<el-dialog v-model="dialogVisible" title="报价项目">
		<el-form :model="project" label-width="auto">
			<el-form-item label="项目名称">
				<el-input v-model="project.name" />
			</el-form-item>
			<el-form-item label="项目描述">
				<el-input v-model="project.description" />
			</el-form-item>
			<el-form-item label="模板">
				<template-selector v-model="project.templateId" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const props = defineProps<{
	projectId: number | null
}>()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdProject>): void
}>()
const emptyProject = () => {
	return {
		name: '',
		description: '',
		productTypeId: 0,
		templateId: 0,
		quantity: 0,
		model: '',
		attention: '',
		company: '',
		tel: '',
		mob: '',
		fax: '',
		email: '',
		number: '',
		date: '',
		valid: '',
		price: '',
	}
}
const project = ref<Partial<ZdProject>>(emptyProject())
const dialogVisible = defineModel<boolean>({ required: true })
watch(props, async (newVal) => {
	if (newVal.projectId) {
		project.value = await entityApis.project.get(newVal.projectId)
	}
	else {
		project.value = emptyProject()
	}
})
const onSubmit = async () => {
	emit('submit', project.value)
	dialogVisible.value = false
}
</script>