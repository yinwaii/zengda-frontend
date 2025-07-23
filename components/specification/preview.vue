<template>
	<el-dialog v-model="dialogTableVisible" title="规格书预览" width="800" :close-on-click-modal="true">
		<div ref="docxContainer" class="docx-scroll-container"></div>
	</el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { renderAsync } from 'docx-preview'

const props = defineProps<{
  specificationId: number
}>()

const dialogTableVisible = defineModel<boolean>('dialogTableVisible')

const specification = ref<ZdSpecification>()
const entityApis = useEntityApis()
const specDocument = ref<Blob>()
const docxContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  console.log('onMounted')
  await onRefresh()
})

const onRefresh = async () => {
  if (!specDocument.value) {
    specification.value = await entityApis.specification.getAll(props.specificationId)
    if (specification.value) {
      let url = specification.value.url
      if (url[0] === '/') url = url.slice(1)
      specDocument.value = await entityApis.system.download(url)
    }
  }
	console.log(specDocument.value,docxContainer.value)
  if (specDocument.value && docxContainer.value) {
    // 渲染 Word 文档
    await renderAsync(specDocument.value, docxContainer.value)
  }
}
watch(() => dialogTableVisible.value, async () => {
  await onRefresh()
})
watch(() => docxContainer.value, async () => {
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
  /* 防止内容横向溢出 */
  overflow-x: hidden;
}
.docx-scroll-container * {
  box-sizing: border-box;
  max-width: 100% !important;
  word-break: break-all;
}
</style>