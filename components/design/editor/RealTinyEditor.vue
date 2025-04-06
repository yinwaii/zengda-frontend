<!-- RealTinyEditor.vue - 实际加载TinyMCE的组件 -->
<template>
  <div :id="editorId" ref="editorRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { TinyMCEEditor } from 'tinymce'

export default defineComponent({
  name: 'RealTinyEditor',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    init: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'onChange'],
  
  async setup(props, { emit }) {
    const editorRef = ref<HTMLElement | null>(null)
    const editorId = `tiny-editor-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const editor = ref<TinyMCEEditor | null>(null)
    const content = ref(props.modelValue || '')
    const isInitialized = ref(false)
    
    // 编辑器配置
    const editorConfig = computed(() => {
      return {
        ...props.init,
        // 这个选择器必须保持不变
        selector: `#${editorId}`,
        // 如果设置了只读模式，则禁用编辑功能
        readonly: props.readonly,
        // 初始化回调
        setup: (ed: TinyMCEEditor) => {
          // 保存编辑器实例
          editor.value = ed
          
          // 添加事件监听器
          ed.on('init', () => {
            isInitialized.value = true
            
            // 设置初始内容
            ed.setContent(content.value)
            
            // 只有在非只读模式下才添加内容变更监听
            if (!props.readonly) {
              ed.on('change keyup undo redo', () => {
                const newContent = ed.getContent()
                if (newContent !== content.value) {
                  content.value = newContent
                  emit('update:modelValue', newContent)
                  emit('onChange', { 
                    target: ed,
                    content: newContent
                  })
                }
              })
            }
          })
          
          // 允许自定义setup回调
          if (props.init && typeof props.init.setup === 'function') {
            props.init.setup(ed)
          }
        }
      }
    })
    
    // 监听内容变化
    watch(
      () => props.modelValue,
      (val) => {
        if (val !== content.value) {
          content.value = val || ''
          if (editor.value && isInitialized.value) {
            editor.value.setContent(content.value)
          }
        }
      }
    )
    
    // 初始化编辑器
    onMounted(async () => {
      try {
        await nextTick()
        if (!window.tinymce || !editorRef.value) return
        
        // 初始化编辑器
        window.tinymce.init(editorConfig.value)
      } catch (error) {
        console.error('初始化编辑器失败:', error)
      }
    })
    
    // 销毁编辑器
    onBeforeUnmount(() => {
      if (editor.value) {
        editor.value.destroy()
        editor.value = null
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
/* 预加载显示样式 */
div {
  min-height: 200px;
}
</style> 