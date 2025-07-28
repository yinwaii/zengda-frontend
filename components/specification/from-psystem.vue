<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="handleUploadSpec">上传规格书</el-button>
			<el-button type="primary" @click="handlePreviewSpec">预览规格书</el-button>
			<el-button type="primary" @click="onDownload">下载规格书</el-button>
			<el-button type="primary" @click="onAutoMatch">自动配对参数</el-button>
		</div>
		<el-empty v-if="!specId" description="请先上传规格书" />
		<specification-preview v-if="specId" v-model="dialogVisible" :specification-id="specId" />
		<specification-table v-if="specId" :specification-id="specId" :trigger="trigger" />
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	psystemId: number
}>()
const dialogVisible = ref<boolean>(false)
const specId = ref<number | null>(null)
const entityApis = useEntityApis()
const trigger = ref(0)
onMounted(async () => {
	const psystem = await entityApis.psystem.get(props.psystemId)
	specId.value = psystem.specId
})

const onDownload = async () => {
	if (!specId.value) return
	const specification = await entityApis.specification.getAll(specId.value)
	if (specification) {
		let url = specification.url
		if (url[0] === '/') url = url.slice(1)
		const specDocument = await entityApis.system.download(url)
		if (specDocument) {
			// 创建下载链接
			const url = window.URL.createObjectURL(specDocument)
			const link = document.createElement('a')
			link.href = url
			link.download = `规格书_${specification.name}.docx`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		}
	}
}

const handleUploadSpec = async () => {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = '.docx'

	input.onchange = async (event: Event) => {
		const target = event.target as HTMLInputElement
		const file = target.files?.[0]
		if (file) {
			try {
				// 使用FileReader验证文件内容
				const reader = new FileReader()
				reader.onload = async () => {
					try {
						// 确保文件内容被正确读取
						if (reader.result) {
							ElMessage.success('文件内容已读取，大小:' + (reader.result as ArrayBuffer).byteLength + '字节')

							// 创建新的Blob，确保包含完整的文件内容
							const blob = new Blob([reader.result], { type: file.type })
							const formData = new FormData()
							formData.append('file', blob, file.name)

							await entityApis.specification.modify_psystem(props.psystemId, formData)
							await onAutoMatch()
							const psystem = await entityApis.psystem.get(props.psystemId)
							specId.value = psystem.specId
							trigger.value++
						}
					} catch (error: any) {
						ElMessage.error('上传规格书失败:' + error.message)
					}
				}

				reader.onerror = () => {
					ElMessage.error('读取文件失败:' + reader.error?.message)
				}

				// 以ArrayBuffer形式读取文件
				reader.readAsArrayBuffer(file)
			} catch (error: any) {
				ElMessage.error('处理文件失败:' + error.message)
			}
		}
	}

	input.click()
}

const handlePreviewSpec = () => {
	dialogVisible.value = true
}

const onAutoMatch = async () => {
	const psystem = await entityApis.psystem.get(props.psystemId)
	const mapping = await entityApis.paramMapping.getAll(psystem.specId)
	const parameters = await entityApis.parameter.get(psystem.id, 'psystem')
	for (const mappingItem of mapping) {
		console.log(mappingItem, parameters)
		const parameter = parameters.find((p: ZdParameter) => p.name === mappingItem.specParamName)
		console.log(parameter)
		if (parameter) {
			await entityApis.paramMapping.update(psystem.specId, {
				specParamName: parameter.name,
				parameterId: parameter.id,
				specId: psystem.specId,
			})
		}
	}
	const new_parameters = parameters.map((p: ZdParameter) => {
		if (!isNaN(parseFloat(p.value)) && !isNaN(p.value)) {
			p.dtype = 'number'
		}
		return p;
	});
	await entityApis.parameter.updateBatch(new_parameters)
	ElMessage.success('自动配对参数成功')
	trigger.value++
}
</script>