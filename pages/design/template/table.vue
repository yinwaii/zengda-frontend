<script setup lang="ts">
const table = useTemplateRef<any>('table')
const data = ref<ZdTemplate[]>((await ZdTemplate.getByPage(0, 100)).content)
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
	<abstract-data-table ref="table" :data="data" :columns="ZdTemplateColumns"></abstract-data-table>
</template>