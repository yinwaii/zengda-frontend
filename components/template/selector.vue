<template>
	<el-select filterable v-model="templateId" placeholder="请选择模板" @change="onChange">
		<el-option v-for="template in templates" :key="template.id" :label="template.name" :value="template.id" />
	</el-select>
</template>
<script setup lang="ts">
const entityApis = useEntityApis()
const templates = ref<ZdTemplate[]>([])
const templateId = defineModel<number>('templateId')
onMounted(async () => {
	templates.value = (await entityApis.template.getByPage(0, 100)).content
})

const onChange = (value: number) => {
	console.log(value)
}
</script>