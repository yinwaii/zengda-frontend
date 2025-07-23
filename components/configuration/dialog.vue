<template>
	<el-dialog v-model="dialogVisible" title="配置">
		<el-form :model="configuration" label-width="auto">
			<el-form-item label="配置名称">
				<el-input v-model="configuration.name" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdConfiguration>): void
}>()
const emptyConfiguration = () => {
	return {
		name: '',
		isShow: true,
		lastVersionId: 0,
		valueConfig: '',
		componentConfig: '',
		docs: '',
		isDeleted: false,
	}
}
const configuration = ref<Partial<ZdConfiguration>>(emptyConfiguration())
const dialogVisible = defineModel<boolean>({ required: true })

const onSubmit = async () => {
	emit('submit', configuration.value)
	dialogVisible.value = false
}
</script>