<template>
	<abstract-table :data="materials" :param="paramsMaterial" id-column="id"
	 :default-value="defaultMaterial" editable @insert-row="onInsert"
		@delete-row="onDelete" @update-row="onUpdate" />
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	mid: number
}>()

const materials = ref<Material[]>(await unpackApi(api.modules.queryMaterials(props.mid)));
watch(() => props.mid, async (mid) => {
	materials.value = await unpackApi(api.modules.queryMaterials(mid));
})

const emit = defineEmits<{
	(e: 'update-data'): void
}>()

const onInsert = async (row: Material) => {
	await api.materials.insert(row);
	ElMessage({
		message: '已添加物料',
		type: 'success',
	})
	emit('update-data');
}

const onDelete = async (row: Material) => {
	await api.materials.delete(row.id);
	ElMessage({
		message: '已删除物料',
		type: 'success',
	})
	emit('update-data');
}

const onUpdate = async (row: Material) => {
	console.log(row);
	await api.materials.patch(row.id, row);
	ElMessage({
		message: '已更新物料',
		type: 'success',
	})
	emit('update-data');
}


</script>