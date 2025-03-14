<script setup lang="ts">
const table = useTemplateRef<any>('table')
const data = ref<ZdPSystem[]>(await ZdPSystem.getAll())
// const data = ref<ZdProject[]>((await ZdProject.getByPage(0, 100)).content)
onMounted(async () => {
	// data.value = (await ZdProject.getByPage(0, 100)).content
	if (table.value) {
		table.value.columnVisibility = {
			...table.value.columnVisibility,
			// ...ZdProjectColumnsVisibility,
			...TimeStampColumnVisibility,
		}
	}
})
</script>
<template>
	<abstract-data-table ref="table" :data="data" :columns="ZdPSystemColumns"></abstract-data-table>
</template>