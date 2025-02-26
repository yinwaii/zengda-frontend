<template>
	<div class="project">
		<abstract-table :data="projectList" :param="paramsProject" id-column="id"
			:default-value="defaultProject" :editable="true" @insert-row="onInsert" @delete-row="onDelete"
			@update-row="onUpdate" />
	</div>
</template>

<script lang="ts" setup>
const api = useApi();

const projectList = (await unpackApi(api.project.queryAll())).project_list;

// watch(() => props.mid, async (mid) => {
// 	projectList.value = (await unpackApi(api.projectTemplate.queryAll())).template_list;
// }, { immediate: true });

const onInsert = async (row: Project) => {
	await api.project.insert(row);
	ElMessage({
		message: '已插入参数',
		type: 'success',
	})
	// emit('update-data');
}

const onDelete = async (row: Project) => {
	await api.project.delete(row.id);
	ElMessage({
		message: '已删除参数',
		type: 'success',
	})
	// emit('update-data');
}

const onUpdate = async (row: Project) => {
	// await api.project.patch(row.id, row);
	// ElMessage({
	// 	message: '已更新参数',
	// 	type: 'success',
	// })
}
</script>
