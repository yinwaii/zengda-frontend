<template>
	<abstract-table :data="($props.arg?.children ?? [] as ModuleParams[])" :param="params" id-column="id"
		:row-key="(row) => row.name + row.id" :default-value="defaultModuleParams" editable @delete-row="onDelete" />
</template>

<script lang="ts" setup>
import type { ParamSchema } from '~/components/abstract/table.vue';

const params: ParamSchema<ModuleParams> = {
	id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	type: { name: '字段类型', type: 'string' },
	default_exp: { name: '默认值', type: 'string' },
	description: { name: '备注', type: 'string' },
	visible: { name: '是否可见', type: 'boolean' }
}

defineProps({
	arg: { type: Object as PropType<ModuleParams>, required: true }
});

const defaultModuleParams = (): ModuleParams => {
	return {
		id: -1,
		name: '',
		type: '',
		default_exp: '',
		description: '',
		visible: true,
		can_modify: true
	}
}

const onDelete = (row: ModuleParams) => {
	console.log(row);
}
</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;
}
</style>