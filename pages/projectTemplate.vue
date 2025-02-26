<template>
	<div class="project-templates">
		<abstract-table :data="templateList" :param="paramsProjectTemplate" id-column="id" :default-value="defaultProjectTemplate"
			:editable="true" @insert-row="onInsert" @delete-row="onDelete" @update-row="onUpdate" />
	</div>
</template>

<script lang="ts" setup>
const api = useApi();

const templateList = (await unpackApi(api.projectTemplate.queryAll())).template_list;

// watch(() => props.mid, async (mid) => {
// 	templateList.value = (await unpackApi(api.projectTemplate.queryAll())).template_list;
// }, { immediate: true });

const onInsert = async (row: ProjectTemplate) => {
	row.module_id = 1;
	await api.projectTemplate.insert(row);
	ElMessage({
		message: '已插入参数',
		type: 'success',
	})
	// emit('update-data');
}

const onDelete = async (row: ProjectTemplate) => {
	await api.projectTemplate.delete(row.id);
	ElMessage({
		message: '已删除参数',
		type: 'success',
	})
	// emit('update-data');
}

const onUpdate = async (row: ProjectTemplate) => {
	await api.projectTemplate.patch(row.id, row);
	ElMessage({
		message: '已更新参数',
		type: 'success',
	})
}
</script>
