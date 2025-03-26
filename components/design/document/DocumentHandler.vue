<template>
  <div class="document-handler">
    <div class="document-toolbar">
      <a-upload 
        :before-upload="handleFileUpload" 
        :show-upload-list="false"
        accept=".docx"
      >
        <a-button type="primary">
          导入DOCX文档
        </a-button>
      </a-upload>
      <a-button type="default" @click="handleExport" :disabled="!content">
        导出为DOCX
      </a-button>
    </div>
    
    <div class="document-editor">
      <TinyEditor 
        v-model="content" 
        :options="editorOptions"
        @editor-init="handleEditorInit"
      />
    </div>
    
    <div class="document-info" v-if="performance.length > 0">
      <h3>性能指标</h3>
      <ul>
        <li v-for="(item, index) in performance" :key="index">
          {{ item.name }}: {{ item.duration }}ms
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import TinyEditor from '~/components/design/specification/TinyEditor.vue'
import { docxToHtml, htmlToDocx } from '~/utils/document'
import type { TinyMCEEditor } from 'tinymce'

export default defineComponent({
  components: {
    TinyEditor
  },
  
  setup() {
    // 编辑器内容
    const content = ref('')
    
    // 性能指标
    const performance = reactive<Array<{name: string, duration: number}>>([])
    
    // 编辑器配置
    const editorOptions = {
      plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
      toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
    }
    
    // 处理文件上传
    const handleFileUpload = async (file: File) => {
      try {
        const startTime = Date.now()
        
        // 显示加载状态
        const loadingEl = document.createElement('div')
        loadingEl.className = 'global-loading'
        loadingEl.innerHTML = `
          <div class="spinner"></div>
          <div class="message">正在处理文档...</div>
        `
        document.body.appendChild(loadingEl)
        
        // 使用Web Worker处理文档
        const html = await docxToHtml(file)
        
        // 更新内容
        content.value = html
        
        // 记录性能
        const endTime = Date.now()
        performance.push({
          name: '文档导入',
          duration: endTime - startTime
        })
        
        // 移除加载状态
        document.body.removeChild(loadingEl)
      } catch (error) {
        console.error('处理文档失败:', error)
        alert('文档处理失败，请重试')
      }
      
      return false
    }
    
    // 处理导出
    const handleExport = async () => {
      if (!content.value) {
        alert('没有内容可导出')
        return
      }
      
      try {
        const startTime = Date.now()
        
        // 显示加载状态
        const loadingEl = document.createElement('div')
        loadingEl.className = 'global-loading'
        loadingEl.innerHTML = `
          <div class="spinner"></div>
          <div class="message">正在生成文档...</div>
        `
        document.body.appendChild(loadingEl)
        
        // 使用Web Worker处理导出
        const docxFile = await htmlToDocx(content.value, '文档.docx')
        
        // 记录性能
        const endTime = Date.now()
        performance.push({
          name: '文档导出',
          duration: endTime - startTime
        })
        
        // 创建下载
        const url = URL.createObjectURL(docxFile)
        const link = document.createElement('a')
        link.href = url
        link.download = docxFile.name
        link.click()
        
        // 清理
        URL.revokeObjectURL(url)
        
        // 移除加载状态
        document.body.removeChild(loadingEl)
      } catch (error) {
        console.error('导出文档失败:', error)
        alert('导出失败，请重试')
      }
    }
    
    // 编辑器初始化回调
    const handleEditorInit = (editor: TinyMCEEditor) => {
      console.log('编辑器初始化完成')
    }
    
    return {
      content,
      editorOptions,
      performance,
      handleFileUpload,
      handleExport,
      handleEditorInit
    }
  }
})
</script>

<style scoped>
.document-handler {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.document-toolbar {
  display: flex;
  gap: 10px;
}

.document-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 400px;
}

.document-info {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.document-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.document-info ul {
  margin: 0;
  padding: 0 0 0 20px;
}

.document-info li {
  margin-bottom: 4px;
}

:global(.global-loading) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

:global(.global-loading .spinner) {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
  margin-bottom: 15px;
}

:global(.global-loading .message) {
  color: white;
  font-size: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 