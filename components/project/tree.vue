<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const template = ref(null)
const isExpanded = ref(false)

// 项目ID变化时重新加载数据
watch(() => props.project, async (newProject) => {
  // 如果项目发生变化且不是加载中状态，自动获取模板数据
  if (newProject && newProject.templateId && newProject.name !== '加载中...' && !template.value) {
    isExpanded.value = true  // 自动展开项目节点
    await fetchTemplateData() // 获取模板数据
  }
}, { immediate: true, deep: true })

const fetchTemplateData = async () => {
  // Implementation of fetchTemplateData function
}
</script>

<style>
  /* No changes to style section */
</style> 