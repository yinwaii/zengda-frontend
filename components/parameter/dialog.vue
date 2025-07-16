<template>
	<el-dialog v-model="dialogVisible" title="参数配置">
		<el-form :model="parameter" label-width="auto">
			<el-form-item label="参数名称">
				<el-input v-model="parameter.name" />
			</el-form-item>
			<el-form-item label="参数类型">
				<el-input v-model="parameter.dtype" />
			</el-form-item>
			<el-form-item label="参数值">
				<el-input v-model="parameter.value" />
			</el-form-item>
			<el-form-item label="参数描述">
				<el-input v-model="parameter.description" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const props = defineProps<{
	parameter: Partial<ZdParameter> | null
}>()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdParameter>): void
}>()
const emptyParameter = () => {
	return {
		name: '',
		description: '',
		updatedBy: '',
		createdBy: '',
		isShow: true,
		isReadonly: false,
		objectId: 0,
		objectType: '',
		dtype: '',
		unit: '',
		showType: '',
	}
}
const parameter = ref<Partial<ZdParameter>>(emptyParameter())
const dialogVisible = defineModel<boolean>({ required: true })
watch(props, async (newVal) => {
	if (newVal.parameter !== null) {
		parameter.value = newVal.parameter
		delete parameter.value.isDeleted
	}
	else {
		parameter.value = emptyParameter()
	}
})
const onSubmit = async () => {
	emit('submit', parameter.value)
	dialogVisible.value = false
}
</script>