<script setup lang="ts">
import type { Menu } from '@/models/entity/system'
import { onMounted, ref } from 'vue'
import { columns } from '@/components/system/menu/columns'
import DataTable from "~/components/system/menu/data-table.vue";

const data = ref<Menu[]>([])

async function getData(): Promise<Menu[]> {
  // Fetch data from your API here.
  return useEntityApis().menu.getMenuList();
}

onMounted(async () => {
  data.value = await getData()
})

</script>

<template>
  <div class="container py-10 mx-auto">
    <data-table :columns="columns" :data="data" />
<!--    <DataTable :columns="columns" :data="data" />-->
  </div>
</template>
