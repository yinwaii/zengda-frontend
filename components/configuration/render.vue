<template>
	<div class="w-full">
		<div class="flex p-3">
			<el-button type="primary" @click="onDownload">下载规格书</el-button>
			<el-button type="primary" @click="onRefresh">加载规格书</el-button>
		</div>
		<div ref="docxContainer" class="docx-scroll-container"></div>
	</div>
</template>
<script setup lang="ts">
import { renderAsync } from 'docx-preview'
const props = defineProps<{
	specificationId: number
	configId: number
}>()
const entityApis = useEntityApis()
const specification = ref<ZdSpecification>()
const renderUrl = ref<string>()
const renderedFile = ref<Blob>()
const docxContainer = ref<HTMLElement | null>(null)
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
const onRefresh = async () => {
	const cleanedSpecConfig = cleanSpecConfig(specification.value)
	renderUrl.value = await entityApis.specification.render(props.configId, cleanedSpecConfig)
	if (renderUrl.value && docxContainer.value) {
		renderedFile.value = await entityApis.system.download(renderUrl.value)
		console.log(renderedFile.value)
		await renderAsync(renderedFile.value, docxContainer.value)
	}
}
const onDownload = async () => {
	await onRefresh()
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

watch(() => props.configId, async () => {
	await onRefresh()
})
onMounted(async () => {
	specification.value = await entityApis.specification.getAll(props.specificationId)
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
	/* 防止内容横向溢出 */
	overflow-x: hidden;
}

.docx-scroll-container * {
	box-sizing: border-box;
	max-width: 100% !important;
	word-break: break-all;
}
</style>