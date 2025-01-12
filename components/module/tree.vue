<template>
	<div class="module-tree">
		<abstract-tree :param="paramsModule" :data="moduleData" :default-value="defaultModule" @insert-row="onInsert"
			@update-row="onUpdate" @delete-row="onDelete" :expand-on-click-node="false" />
	</div>
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	id: number
}>();

const moduleData = ref<Module[]>([await unpackApi(api.modules.query(1))]);
watch(() => props.id, async (id) => {
	moduleData.value = [await unpackApi(api.modules.query(id))];
})

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
.module-tree {
	background-color: white;

	.module-tree-menu {
		text-align: right;
		padding: 0 10px 0 10px;
	}
}
</style>