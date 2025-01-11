<template>
	<div class="module-arguments">
		<abstract-table :data="argumentList" :param="paramsModuleParams" id-column="id" :default-value="defaultModuleParams"
			:editable="true" @insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate" />
	</div>
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	mid: number
}>()

const argumentList = ref<ModuleParams[]>([]);

watch(() => props.mid, async (mid) => {
	argumentList.value = await unpackApi(api.modules.queryParameters(props.mid));
}, { immediate: true });

const onInsert = async (row: ModuleParams) => {
	row.module_id = props.mid;
	await api.arguments.insert(row);
	ElMessage({
		message: '已插入参数',
		type: 'success',
	})
	// emit('update-data');
}

const onDelete = async (row: ModuleParams) => {
	await api.arguments.delete(row.id);
	ElMessage({
		message: '已删除参数',
		type: 'success',
	})
	// emit('update-data');
}

const onUpdate = async (row: ModuleParams) => {
	await api.arguments.patch(row.id, row);
	ElMessage({
		message: '已更新参数',
		type: 'success',
	})
}
</script>

