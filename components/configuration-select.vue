<template>
	<el-select v-model="configId" placeholder="请选择" style="width: 240px" @change="onChange">
		<el-option v-for="configuration in configurations" :key="configuration.id" :label="configuration.name"
			:value="configuration.id" />
	</el-select>
</template>
<script setup lang="ts">
const props = defineProps<{
	projectId: number
	templateId: number
}>()
const configId = defineModel<number>('configId')
const entityApis = useEntityApis()
const configurations = ref<ZdConfiguration[]>([])
onMounted(async () => {
	configurations.value = (await entityApis.configuration.getByTemplateId(props.templateId, props.projectId)).list
})
const onChange = (value: number) => {
	configId.value = value
	console.log(configId.value)
}
</script>