<template>
	<abstract-table :data="($props.arg?.children ?? [] as ModuleParams[])" :param="params" id-column="id"
		:row-key="(row) => row.name + row.id" :default-value="defaultModuleParams" editable 
		@insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate"/>
</template>

<script lang="ts" setup>
import type { ParamSchema } from '~/components/abstract/table.vue';

const api = useApi();

const params: ParamSchema<ModuleParams> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	type: { name: '字段类型', type: 'string' },
	default_exp: { name: '默认值', type: 'string' },
	description: { name: '备注', type: 'string' },
	visible: { name: '是否可见', type: 'boolean' }
}

const props = defineProps<{
	arg: ModuleParams
}>()

const emit = defineEmits<{
	(e: 'update-data'): void
}>()

const defaultModuleParams = (): ModuleParams => {
	return {
		id: -1,
		name: '',
		type: '',
		default_exp: '',
		description: '',
		visible: true,
		can_modify: true,
		module_id: props.arg.id
	}
}

const onInsert = async (row: ModuleParams) => {
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