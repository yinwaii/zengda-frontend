<template>
	<div class="w-full" v-loading="loading">
		<el-button style="margin-bottom: 20px" type="primary" @click="onDownload">下载规格书</el-button>
		<el-empty v-if="errorMsg" :description="errorMsg" />
		<div ref="docxContainer" class="docx-scroll-container"></div>
	</div>
</template>
<script setup lang="ts">
import { renderAsync } from 'docx-preview'
const props = defineProps<{
	templateId: number
	configId: number
	trigger: number
}>()
const entityApis = useEntityApis()
const specification = ref<ZdSpecification>()
const renderUrl = ref<string>()
const renderedFile = ref<Blob>()
const docxContainer = ref<HTMLElement | null>(null)
const template = ref<ZdTemplate>()
const errorMsg = ref<string>()
const loading = ref<boolean>(false)
// 清理specConfig中的null值
const cleanSpecConfig = (obj: any): any => {
	if (obj === null || obj === undefined) {
		return undefined
	}
	if (Array.isArray(obj)) {
		return obj.map(item => cleanSpecConfig(item)).filter(item => item !== undefined)
	}
	if (typeof obj === 'object') {
		const cleaned: any = {}
		for (const [key, value] of Object.entries(obj)) {
			// 对于texts、bools和imgs属性，保留对象但清理内部null值
			if (key === 'texts' || key === 'bools' || key === 'imgs') {
				if (value && typeof value === 'object') {
					const cleanedValue: any = {}
					for (const [k, v] of Object.entries(value)) {
						if (v !== null) {
							cleanedValue[k] = v
						}
					}
					cleaned[key] = cleanedValue
				} else {
					cleaned[key] = {}
				}
				continue
			}
			const cleanedValue = cleanSpecConfig(value)
			if (cleanedValue !== undefined) {
				cleaned[key] = cleanedValue
			}
		}
		return Object.keys(cleaned).length > 0 ? cleaned : undefined
	}
	return obj
}
const onDownload = () => {
	if (renderedFile.value) {
		// 创建下载链接
		const url = window.URL.createObjectURL(renderedFile.value)
		const link = document.createElement('a')
		link.href = url
		link.download = `规格书_${new Date().toISOString().split('T')[0]}.docx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	}
}
const onRefresh = async () => {
	loading.value = true
	try {
		template.value = await entityApis.template.get(props.templateId)
		specification.value = await entityApis.specification.getAll(template.value?.specId)
		renderUrl.value = await entityApis.specification.render(props.configId, specification.value)
		if (renderUrl.value && docxContainer.value) {
			renderedFile.value = await entityApis.system.download(renderUrl.value)
			await renderAsync(renderedFile.value, docxContainer.value)
		}
		errorMsg.value = undefined
	}
	catch (error) {
		errorMsg.value = error as string
	} finally {
		loading.value = false
	}
}
watch(() => props.configId, async () => {
	await onRefresh()
})
onMounted(async () => {
	await onRefresh()
})
watch(() => props.trigger, async () => {
	console.log(props.trigger)
	await onRefresh()
})
</script>
<style scoped>
.docx-scroll-container {
	width: 100%;
	height: 70vh;
	min-height: 400px;
	max-height: 70vh;
	overflow-y: auto;
	background: #fff;
	box-sizing: border-box;
	padding: 16px;
	padding-top: 0;
	/* 防止内容横向溢出 */
	overflow-x: hidden;
}

.docx-scroll-container * {
	box-sizing: border-box;
	max-width: 100% !important;
	word-break: break-all;
}
</style>