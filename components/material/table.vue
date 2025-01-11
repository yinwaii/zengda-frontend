<template>
	<abstract-table v-if="props.arg" :data="props.arg" :param="params" id-column="id"
		:row-key="(row) => row.name + row.id" :default-value="defaultMaterial" editable 
		@insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate"/>
</template>

<script lang="ts" setup>
import type { ParamSchema } from '~/components/abstract/table.vue';

const props = defineProps<{
	arg: Array<Material>
}>()

const params: ParamSchema<Material> = {
    name: { name: '物料名称', type: 'string' },
    price: { name: '价格', type: 'float' },
    quantity: { name: '数量', type: 'int' },
    description: { name: '备注', type: 'string' },
}

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