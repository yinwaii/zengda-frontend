<template>
    <div>
        <h1>物料管理</h1>
    </div>
    <material-table :arg="materials" @update-data="onUpdateData"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const api = useApi();
let materials = ref(await unpackApi(api.materials.queryAll()));
console.log(materials.value);
const onUpdateData = async () => {
    materials.value = await unpackApi(api.materials.queryAll());
}

</script>