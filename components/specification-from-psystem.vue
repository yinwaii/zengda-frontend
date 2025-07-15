<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="handleUploadSpec">插入规格书</el-button>
			<el-button type="primary" @click="handlePreviewSpec">预览规格书</el-button>
		</div>
		<specification-preview v-if="specId" v-model="dialogVisible" :specification-id="specId" />
		<specification-table v-if="specId" :specification-id="specId" />
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	psystemId: number
}>()
const dialogVisible = ref<boolean>(false)
const specId = ref<number | null>(null)
const entityApis = useEntityApis()
onMounted(async () => {
	const psystem = await entityApis.psystem.get(props.psystemId)
	specId.value = psystem.specId
})

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
</script>