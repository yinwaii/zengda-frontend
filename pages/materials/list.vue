<template>
    <div>
        <h1>物料管理</h1>
    </div>
    <material-search-box :queryMaterials="queryMaterials"/>
    <material-table :arg="materials" @update-data="onUpdateData"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const api = useApi();
let materials = ref(await unpackApi(api.materials.queryAll()));

const onUpdateData = async () => {
    materials.value = await unpackApi(api.materials.queryAll());
}

const queryMaterials = (str: string) => {
  api.materials.search(str).then((data) => {
    materials.value = data.data;
  });
}
</script>
