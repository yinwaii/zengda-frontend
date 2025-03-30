<template>
  <AsyncLoader :loading-text="loadingText" :timeout="800">
    <div class="dynamic-editor" ref="editorContainer">
      <textarea ref="editorRef" :value="modelValue" @input="handleInput"></textarea>
    </div>
  </AsyncLoader>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import AsyncLoader from '~/components/utils/AsyncLoader.vue'
import type { TinyMCEEditor } from 'tinymce'

const props = defineProps<{
  modelValue: string
  height?: number
  loadingText?: string
  toolbar?: string
  plugins?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { $tinymce } = useNuxtApp()
const editorRef = ref<HTMLTextAreaElement | null>(null)
const editorContainer = ref<HTMLElement | null>(null)
let editor: TinyMCEEditor | null = null

// 编辑器内容变化时触发
function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// 初始化编辑器
async function initEditor() {
  if (!editorRef.value) return

  try {
    const { initTiny } = $tinymce
    
    // 编辑器配置
    const editorConfig = {
      target: editorRef.value,
      height: props.height || 500,
      plugins: props.plugins,
      toolbar: props.toolbar,
      setup: (ed: TinyMCEEditor) => {
        // 监听编辑器内容变化
        ed.on('Change', () => {
          emit('update:modelValue', ed.getContent())
        })
      }
    }
    
    // 初始化编辑器
    editor = await initTiny(editorConfig)
  } catch (error) {
    console.error('编辑器初始化失败', error)
  }
}

// 监听值变化
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getContent() !== newValue) {
    editor.setContent(newValue)
  }
})

// 组件挂载后初始化编辑器
onMounted(async () => {
  // 确保DOM已经渲染完成
  await nextTick()
  initEditor()
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})
</script>

<style scoped>
.dynamic-editor {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}
</style> 