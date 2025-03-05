<template>
	<abstract-table :data="($props.arg?.children ?? [] as ModuleParams[])" :param="paramsModuleParams" id-column="id"
		:row-key="(row) => row.name + row.id" :default-value="defaultModuleParams" editable 
		@insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate"/>
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	arg: ModuleParams
}>()

const emit = defineEmits<{
	(e: 'update-data'): void
}>()

const onInsert = async (row: ModuleParams) => {
	row.module_id = props.arg.id;
	await api.arguments.insert(row);
	ElMessage({
		message: '已插入参数',
		type: 'success',
	})
	emit('update-data');
}

const onDelete = async (row: ModuleParams) => {
	await api.arguments.delete(row.id);
	ElMessage({
		message: '已删除参数',
		type: 'success',
	})
	emit('update-data');
}

const onUpdate = async (row: ModuleParams) => {
	await api.arguments.patch(row.id, row);
	ElMessage({
		message: '已更新参数',
		type: 'success',
	})
}
</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;
}
</style>