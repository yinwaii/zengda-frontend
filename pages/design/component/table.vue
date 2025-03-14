<script setup lang="ts">
const table = useTemplateRef<any>('table')
const data = ref<ZdComponent[]>((await ZdComponent.getAll()).list)
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
	<abstract-data-table ref="table" :data="data" :columns="ZdComponentColumns"></abstract-data-table>
</template>