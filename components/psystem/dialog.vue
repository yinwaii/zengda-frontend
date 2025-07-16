<template>
	<el-dialog v-model="dialogVisible" title="功能模块">
		<el-form :model="psystem" label-width="auto">
			<el-form-item label="模块名称">
				<el-input v-model="psystem.name" />
			</el-form-item>
			<el-form-item label="模块描述">
				<el-input v-model="psystem.description" />
			</el-form-item>
			<el-button type="primary" @click="onSubmit">确定</el-button>
			<el-button @click="dialogVisible = false">取消</el-button>
		</el-form>
	</el-dialog>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const props = defineProps<{
	psystemId: number | null
}>()
const emit = defineEmits<{
	(e: 'submit', value: Partial<ZdPSystem>): void
}>()
const emptyPSystem = () => {
	return {
		name: '',
		description: '',
		isShow: true,
		docsUrl: null,
		parentId: 0,
		specId: null,
	}
}
const psystem = ref<Partial<ZdPSystem>>(emptyPSystem())
const dialogVisible = defineModel<boolean>({ required: true })
watch(props, async (newVal) => {
	if (newVal.psystemId) {
		psystem.value = await entityApis.psystem.get(newVal.psystemId)
		delete psystem.value.isDeleted
	}
	else {
		psystem.value = emptyPSystem()
	}
})
const onSubmit = async () => {
	emit('submit', psystem.value)
	dialogVisible.value = false
}
</script>