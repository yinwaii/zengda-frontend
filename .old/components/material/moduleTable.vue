<template>
	<abstract-table :data="materials" :param="paramsMaterialRecord" id-column="id"
	 :default-value="defaultMaterialRecord" editable @insert-row="onInsert"
		@delete-row="onDelete" @update-row="onUpdate" />
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	mid: number
}>()

const materials = ref<MaterialRecord[]>(await unpackApi(api.modules.queryMaterials(props.mid)));
watch(() => props.mid, async (mid) => {
	materials.value = await unpackApi(api.modules.queryMaterials(mid));
})

const emit = defineEmits<{
	(e: 'update-data'): void
}>()

const onInsert = async (row: MaterialRecord) => {
	await api.materialsRecord.insert(props.mid, row.material.id);
	ElMessage({
		message: '已添加物料',
		type: 'success',
	})
	emit('update-data');
}

const onDelete = async (row: MaterialRecord) => {
	await api.materialsRecord.delete(props.mid, row.material.id);
	ElMessage({
		message: '已删除物料',
		type: 'success',
	})
	emit('update-data');
}

const onUpdate = async (row: MaterialRecord) => {
	console.log(row);
	await api.materialsRecord.patch(props.mid, row.material.id, row.quantity);
	ElMessage({
		message: '已更新物料',
		type: 'success',
	})
	emit('update-data');
}


</script>