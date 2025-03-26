<!-- TinyEditor.vue - 一个使用client-only的懒加载包装组件 -->
<template>
  <client-only>
    <lazy-editor 
      v-model="localValue" 
      :init="props.init"
      @onChange="handleChange"
    />
    <template #fallback>
      <div class="border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-muted/20">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <span class="text-sm text-muted-foreground">加载编辑器中...</span>
        </div>
      </div>
    </template>
  </client-only>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  init: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'onChange'])

// 使用本地值来处理v-model
const localValue = ref(props.modelValue)

// 监听父组件传入的值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
  }
})

// 监听本地值变化，向上传递
watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleChange = (e: any) => {
  emit('onChange', e)
}

// 使用defineAsyncComponent懒加载真正的编辑器组件
// 只有在组件第一次渲染时才会加载
const LazyEditor = defineAsyncComponent({
  loader: () => import('./RealTinyEditor.vue'),
  delay: 200,
  timeout: 10000
})
</script>

<style scoped>
.tiny-editor {
  width: 100%;
}
</style> 