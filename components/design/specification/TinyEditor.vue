<template>
  <div class="tiny-editor-wrapper">
    <div ref="editorRef" :id="editorId"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import tinymce from 'tinymce/tinymce'
import { useTinymce } from '~/plugins/tinymce.client'

export default defineComponent({
  name: 'TinyEditor',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    init: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['update:modelValue', 'onInit', 'change'],
  
  setup(props, { emit }) {
    const editorRef = ref<HTMLElement | null>(null)
    const editorId = `tiny-editor-${Date.now()}`
    const editor = ref<any>(null)
    const content = ref(props.modelValue)
    const initialized = ref(false)
    
    // 获取tinymce实例
    const { initTiny } = useTinymce()
    
    // 配置
    const editorConfig = computed(() => {
      return {
        selector: `#${editorId}`,
        ...props.init,
        setup: (ed: any) => {
          // 保存编辑器实例
          editor.value = ed
          
          // 处理初始化
          ed.on('init', () => {
            initialized.value = true
            ed.setContent(content.value)
            
            // 发送初始化事件
            emit('onInit', ed)
          })
          
          // 处理内容变化
          ed.on('change input blur', () => {
            const newContent = ed.getContent()
            if (content.value !== newContent) {
              content.value = newContent
              emit('update:modelValue', newContent)
              emit('change', { editor: ed, content: newContent })
            }
          })
          
          // 执行用户传入的setup
          if (props.init && props.init.setup) {
            props.init.setup(ed)
          }
        }
      }
    })
    
    // 监听v-model变化
    watch(() => props.modelValue, (val) => {
      if (val !== content.value) {
        content.value = val
        if (editor.value && initialized.value) {
          editor.value.setContent(val)
        }
      }
    })
    
    // 初始化编辑器
    onMounted(() => {
      if (typeof tinymce !== 'undefined') {
        tinymce.init(editorConfig.value)
      }
    })
    
    // 清理
    onBeforeUnmount(() => {
      if (editor.value) {
        try {
          editor.value.destroy()
        } catch (e) {
          console.error('销毁编辑器失败', e)
        }
      }
    })
    
    return {
      editorRef,
      editorId,
      content
    }
  }
})
</script>

<style scoped>
.tiny-editor-wrapper {
  width: 100%;
  min-height: 200px;
}
</style> 