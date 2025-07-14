<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="handleUploadSpec">插入物料</el-button>
		</div>
		<specification-table :specification-id="specId" />
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	psystemId: number
}>()

const specId = ref<number>(0)
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
							console.log('文件内容已读取，大小:', (reader.result as ArrayBuffer).byteLength, '字节')

							// 创建新的Blob，确保包含完整的文件内容
							const blob = new Blob([reader.result], { type: file.type })
							const formData = new FormData()
							formData.append('file', blob, file.name)

							await entityApis.specification.modify_psystem(props.psystemId, formData)
						}
					} catch (error: any) {
						console.error('上传规格书失败:', error)
					}
				}

				reader.onerror = () => {
					console.error('读取文件失败:', reader.error)
				}

				// 以ArrayBuffer形式读取文件
				reader.readAsArrayBuffer(file)
			} catch (error) {
				console.error('处理文件失败:', error)
			}
		}
	}

	input.click()
}
</script>