<template>
	<abstract-table :data="data" :param="params" id-column="id" :row-key="(row) => row.name + row.id"
		:default-value="defaultModule" editable @insert-row="onInsert" @update-row="onUpdate" @delete-row="onDelete">
		<template #button="{ row }">
			<el-button size="small" type="primary" @click="onDetail(row)">详情</el-button>
		</template>
	</abstract-table>
</template>

<script lang="ts" setup>
import type { ParamSchema } from '~/components/abstract/table.vue';
const api = useApi();

const data = await unpackApi(api.modules.queryAll());
console.log(data);

const params: ParamSchema<Module> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	price: { name: '默认值', type: 'string' },
	description: { name: '备注', type: 'string' },
	required: { name: '是否必须', type: 'boolean' },
	visible: { name: '是否可见', type: 'boolean' },
}



const onDetail = async (row: Module) => {
	await navigateTo(`/modules/${row.id}/detail`);
}

const onInsert = async (row: Module) => {
	await api.modules.insert(row);
	ElMessage({
		message: '已插入参数',
		type: 'success',
	})
}

const onDelete = async (row: Module) => {
	await api.modules.delete(row.id);
	ElMessage({
		message: '已删除参数',
		type: 'success',
	})
}

const onUpdate = async (row: Module) => {
	await api.modules.patch(row.id, row);
	ElMessage({
		message: '已更新参数',
		type: 'success',
	})
}
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
	margin-top: 20px;
}
</style>