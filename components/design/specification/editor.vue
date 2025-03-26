<template>
  <div class="editor-wrapper">
    <client-only>
      <!-- TinyMCE编辑器 -->
      <TinyEditor
        v-model="content"
        :init="editorConfig"
        class="editor-container"
        @onInit="handleEditorInit"
      />
    </client-only>
    
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="flex items-center gap-2">
        <shadcn-button variant="default" @click="handleSave">
          保存
        </shadcn-button>
        <div class="relative">
          <input
            type="file"
            accept=".docx"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="handleFileChange"
          />
          <shadcn-button variant="outline">
            导入
          </shadcn-button>
        </div>
        <shadcn-button variant="outline" @click="handleExport">
          导出
        </shadcn-button>
      </div>
    </div>
    
    <!-- 添加内存管理组件 -->
    <MemoryGC :interval="30000" :clear-cache="true" :stats="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { LucideDownload, LucideFileDown, LucideSave } from 'lucide-vue-next'
import type { TinyMCEEditor } from 'tinymce'
import { docxToHtml, htmlToDocx } from '~/utils/document'
import { useEntityApis } from '~/composables/use-entity-apis'
import { useApis } from '~/composables/use-apis'
import type { ZdSpecificationMeta } from '~/models/entity/specification'
import TinyEditor from '~/components/design/specification/TinyEditor.vue'
import { useDocumentApis } from '~/composables/use-document-apis'
import MemoryGC from '~/components/utils/MemoryGC.vue'

const props = withDefaults(defineProps<{
  specId: number
  fileTag?: string | null
  name: string
  latestVersionId?: number | null
  docId?: number | null
}>(), {
  fileTag: null,
  latestVersionId: null,
  docId: null
})

const emit = defineEmits<{
  'save': [],
  'onInit': [editor: TinyMCEEditor]
}>()

const tinymceKey = import.meta.env.PUBLIC_TINYMCE_API_KEY
const entityApis = useEntityApis()
const content = ref('')
const loading = ref(false)
const defaultContent = '<p>开始编辑您的规格书内容...</p>'

const documentApis = useDocumentApis()

// TinyMCE 编辑器配置
const editorConfig = computed(() => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return {
    height: '100%', // 设置为100%高度以适应容器
    min_height: 300,
    resize: false, // 禁用手动调整大小，使用容器控制
    menubar: 'file edit view insert format tools table',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
      'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'wordcount', 'pagebreak', 'nonbreaking', 'template', 'help',
      'hr', 'paste', 'print', 'textpattern', 'visualchars', 'emoticons', 'directionality'
    ],
    extended_valid_elements: 'img[class|src|border=0|alt|title|width|height|style|role]',
    toolbar: [
      'undo redo | formatselect fontselect fontsizeselect | forecolor backcolor | removeformat',
      'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist',
      'link image media table | pagebreak nonbreaking | code fullscreen | preview print'
    ].join(' | '),
    toolbar_mode: 'wrap',
    promotion: false,
    skin: 'oxide',
    content_css: [
      'default',
      // 添加自定义样式
      `${baseUrl}/tinymce-content.css`
    ],
    // 添加自动调整大小功能
    auto_resize: true,
    // 图片上传功能
    paste_data_images: true,
    automatic_uploads: true,
    image_advtab: true,
    image_caption: true,
    // 表格增强
    table_default_attributes: {
      border: '1'
    },
    table_default_styles: {
      'border-collapse': 'collapse',
      'width': '100%'
    },
    table_responsive_width: true,
    // 配置内容样式
    content_style: `
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      img { max-width: 100%; height: auto; }
      .center { text-align: center; }
      .title { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 16pt; }
      .subtitle { font-size: 18pt; font-style: italic; text-align: center; margin-bottom: 16pt; }
      table.docx-table { border-collapse: collapse; width: 100%; margin: 10px 0; }
      table.docx-table td, table.docx-table th { border: 1px solid #ddd; padding: 8px; }
      blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; font-style: italic; }
      blockquote.intense { background-color: #f8f8f8; }
    `,
    // 添加自定义格式选项
    style_formats: [
      { title: '标题样式', items: [
          { title: '居中标题', selector: 'h1,h2,h3,h4,h5,h6', classes: 'center' },
          { title: '正文标题', selector: 'h1', classes: 'title' },
          { title: '副标题', selector: 'h2', classes: 'subtitle' }
        ]
      },
      { title: '对齐方式', items: [
          { title: '居中', selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table', classes: 'center' }
        ]
      },
      { title: '图片布局', items: [
          { title: '响应式图片', selector: 'img', styles: { 'max-width': '100%', 'height': 'auto' } },
          { title: '居中图片', selector: 'img', styles: { 'display': 'block', 'margin-left': 'auto', 'margin-right': 'auto' } }
        ]
      }
    ],
    setup: function(editor: TinyMCEEditor) {
      editor.on('change', () => {
        content.value = editor.getContent()
      })
      
      // 窗口大小变化时重新设置编辑器高度
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => {
          editor.setContent(editor.getContent())
        })
      }
      
      // 添加自定义按钮来应用样式
      try {
        if (editor.ui?.registry) {
          editor.ui.registry.addButton('applyDocxStyles', {
            text: '应用文档样式',
            onAction: function() {
              // 应用文档样式
              if (editor.execCommand) {
                editor.execCommand('mceApplyStyle', false, { tag: 'p', styles: { textAlign: 'justify' } });
              }
            }
          });
        }
      } catch (err) {
        console.warn('注册自定义按钮失败:', err);
      }
    }
  }
})

const api = useApis()

// 处理文件上传
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await handleBeforeUpload(file)
    // 重置input，允许选择相同文件
    input.value = ''
  }
}

// 处理下载
const handleDownload = async () => {
  // 如果没有specId，返回默认内容
  if (!props.specId) {
    console.log('新规格模式，无需下载')
    content.value = defaultContent
    return
  }

  // 如果已经有缓存的内容，直接使用
  const cacheKey = `spec_content_${props.specId}_${props.fileTag}`
  const cachedContent = sessionStorage.getItem(cacheKey)
  if (cachedContent) {
    console.log('使用缓存的内容')
    content.value = cachedContent
    loading.value = false
    return
  }

  loading.value = true
  console.log('开始获取规格书数据')

  try {
    // 显示加载状态
    const loadingEl = document.createElement('div')
    loadingEl.className = 'loading-indicator'
    loadingEl.innerHTML = '<div>正在获取文档...</div>'
    loadingEl.style.position = 'fixed'
    loadingEl.style.top = '50%'
    loadingEl.style.left = '50%'
    loadingEl.style.transform = 'translate(-50%, -50%)'
    loadingEl.style.padding = '10px 20px'
    loadingEl.style.background = 'rgba(0,0,0,0.7)'
    loadingEl.style.color = 'white'
    loadingEl.style.borderRadius = '4px'
    loadingEl.style.zIndex = '9999'
    document.body.appendChild(loadingEl)
    
    const specResponse = await entityApis.specification.getAll(props.specId)
    console.log('获取规格书数据成功:', specResponse)

    if (!specResponse || !specResponse.url) {
      console.error('规格书数据不存在或URL为空')
      content.value = defaultContent
      loading.value = false
      document.body.removeChild(loadingEl)
      return
    }

    try {
      console.log('开始处理文件:', specResponse.url)
      
      loadingEl.innerHTML = '<div>正在转换文档...</div>'
      
      // 使用新的缓存API进行转换
      const encodedUrl = encodeURIComponent(specResponse.url)
      console.log('发送编码后的URL:', encodedUrl)
      
      // 通过缓存API获取转换后的HTML
      const htmlResponse = await fetch(`/api/cached-docx-to-html/${encodedUrl}`)
      
      if (!htmlResponse.ok) {
        throw new Error(`文档转换失败: ${htmlResponse.status} ${htmlResponse.statusText}`)
      }
      
      // 获取HTML内容
      const html = await htmlResponse.text()
      console.log('文档转换成功')

      // 缓存转换后的内容
      sessionStorage.setItem(cacheKey, html)
      content.value = html
      
      // 移除加载状态
      document.body.removeChild(loadingEl)
    } catch (error) {
      console.error('处理文件失败:', error)
      
      // 提供更详细的错误信息
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // 更新加载状态显示错误
      loadingEl.innerHTML = `<div style="color: #ff4d4f">转换失败: ${errorMessage}</div>`
      loadingEl.style.background = 'rgba(0,0,0,0.8)'
      
      // 3秒后移除错误提示
      setTimeout(() => {
        if (document.body.contains(loadingEl)) {
          document.body.removeChild(loadingEl)
        }
      }, 3000)
      
      content.value = `<div style="color: red; padding: 20px;">
        <h3>文档转换失败</h3>
        <p>错误信息: ${errorMessage}</p>
        <p>请尝试重新导入文档或联系管理员。</p>
      </div>`
    }
  } catch (error) {
    console.error('获取规格书数据失败:', error)
    content.value = defaultContent
    
    // 移除可能存在的加载状态
    const existingLoadingEl = document.querySelector('.loading-indicator')
    if (existingLoadingEl && existingLoadingEl.parentNode) {
      existingLoadingEl.parentNode.removeChild(existingLoadingEl)
    }
  } finally {
    loading.value = false
  }
}

// 导出为DOCX
const handleExport = async () => {
  try {
    const docx = await htmlToDocx(content.value)
    const blob = new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.name}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出DOCX失败:', error)
  }
}

// 保存规格书
const handleSave = async () => {
  try {
    // 如果文件标签不存在，从名称生成一个
    const fileTag = props.fileTag || generateFileTagFromName(props.name)

    // 如果最新版本ID不存在，默认为0
    const lastVersionId = props.latestVersionId || 0

    // 创建规格书元数据
    const specMeta: ZdSpecificationMeta = {
      name: props.name,
      fileTag: fileTag,
      lastVersionId: lastVersionId
    }

    // 将HTML内容转换为文件
    const file = new File([content.value], `${props.name}.html`, { type: 'text/html' })

    // 更新规格书
    await entityApis.specification.update(
      fileTag,
      file,
      specMeta
    )

    emit('save')
  } catch (error) {
    console.error('保存规格书失败:', error)
  }
}

// 从名称生成文件标签
const generateFileTagFromName = (name: string): string => {
  // 转换为小写，替换空格和特殊字符为下划线，添加时间戳确保唯一性
  const baseTag = name.toLowerCase()
    .replace(/\s+/g, '_')         // 替换空格为下划线
    .replace(/[^\w\-]/g, '')      // 移除特殊字符
    .substring(0, 30)             // 限制长度
  
  // 添加时间戳确保唯一性
  return `${baseTag}_${Date.now()}`
}

// 处理文件导入
const handleBeforeUpload = async (file: File) => {
  try {
    // 显示加载状态
    const loadingEl = document.createElement('div')
    loadingEl.className = 'loading-indicator'
    loadingEl.innerHTML = '<div>正在导入文档...</div>'
    loadingEl.style.position = 'fixed'
    loadingEl.style.top = '50%'
    loadingEl.style.left = '50%'
    loadingEl.style.transform = 'translate(-50%, -50%)'
    loadingEl.style.padding = '10px 20px'
    loadingEl.style.background = 'rgba(0,0,0,0.7)'
    loadingEl.style.color = 'white'
    loadingEl.style.borderRadius = '4px'
    loadingEl.style.zIndex = '9999'
    document.body.appendChild(loadingEl)
    
    // 使用Web Worker处理转换
    const html = await docxToHtml(file)
    
    // 设置编辑器内容
    content.value = html
    
    // 移除加载状态
    document.body.removeChild(loadingEl)
    
    // 显示成功提示
    alert('导入成功')
  } catch (error) {
    console.error('导入文档失败:', error)
    alert('导入失败，请重试')
  }
  
  return false
}

// 编辑器初始化回调
const handleEditorInit = (editor: TinyMCEEditor) => {
  console.log('编辑器初始化成功')
  emit('onInit', editor)
}

// 页面初始化
onMounted(async () => {
  try {
    console.log('编辑器组件挂载，正在初始化...')
    await handleDownload()
  } catch (error) {
    console.error('初始化编辑器内容失败:', error)
    content.value = defaultContent
  }
})

defineExpose({
  handleDownload,
  handleExport,
  handleSave
})
</script>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 75vh;
  max-height: 75vh;
  overflow: hidden;
}

.editor-container {
  flex: 1;
  height: calc(75vh - 60px); /* 减去工具栏和间距的高度 */
  min-height: 300px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: auto;
}

:deep(.tox-tinymce) {
  height: 100% !important;
  min-height: 300px !important;
}

:deep(.tox-sidebar-wrap) {
  height: 100% !important;
}

:deep(.tox-edit-area) {
  height: 100% !important;
}

:deep(.tox-edit-area__iframe) {
  height: 100% !important;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  height: 44px;
}

.placeholder-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1677ff;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-height: 768px) {
  .editor-wrapper {
    height: 70vh;
    max-height: 70vh;
  }
  
  .editor-container {
    height: calc(70vh - 60px);
  }
}

@media (max-height: 600px) {
  .editor-wrapper {
    height: 65vh;
    max-height: 65vh;
  }
  
  .editor-container {
    height: calc(65vh - 60px);
  }
}
</style> 