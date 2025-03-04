<template>
	<div class="project">
		<!-- <template v-for="value in data.content">
			<basic-form :param="ZdProject.formSchema" v-model="(value as ZdProject)" />
		</template> -->
		<!-- <basic-form :param="ZdProject.formSchema" v-model="(data.content[0] as ZdProject)" /> -->
		<basic-table :param="ZdProject.tableSchema" :data="data.content" editable>
			<basic-form :param="ZdProject.formSchema"/>
			 <!-- asdsada -->
		</basic-table>
	</div>
</template>

<script lang="ts" setup>
import { ZdProject } from '~/models/project';

const data = await ZdProject.getByPage(0, 10);

provide('update-row', (row: ZdProject) => {
	ZdProject.put(row);
})
provide('delete-row', (row: ZdProject) => {
	ZdProject.delete(row.id);
})
provide('insert-row', (row: ZdProject) => {
	ZdProject.post(row);
})
provide('constructor', () => {
	return new ZdProject();
})
// const sth = ref(new ZdProject());
</script>
