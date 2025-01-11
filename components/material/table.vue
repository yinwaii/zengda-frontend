<template>
	<abstract-table v-if="props.arg" :data="props.arg" :param="paramsMaterial" id-column="id"
		:row-key="(row) => row.name + row.id" :default-value="defaultMaterial" editable 
		@insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate"/>
</template>

<script lang="ts" setup>
const props = defineProps<{
	arg: Array<Material>
}>()

const emit = defineEmits<{
	(e: 'update-data'): void
}>()

const defaultMaterial = (): Material => {
    return {
        id: -1,
        name: '',
        price: 0,
        description: '',
    }
}

const api = useApi();

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