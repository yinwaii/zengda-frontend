<template>
	<utils-word :docx="docx" />
</template>
<script setup lang="ts">
const props = defineProps<{
	parameters: ModuleParams
}>()
const docx = ref<ArrayBuffer | string>('');
const api = useApi();
const onGetSpecification = async () => {
	const res = await api.arguments.querySpecification(props.parameters);
	const resBuffer = await res.arrayBuffer();
	docx.value = resBuffer;
}
defineExpose({
	onGetSpecification
})
</script>