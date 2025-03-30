/**
 * 文档处理工具库
 * 提供DOCX、HTML等格式转换和处理功能
 */

// @ts-ignore
import mammoth from 'mammoth'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { useWorker } from './useWorkers'
import * as docxLib from 'docx'
import { renderAsync } from 'docx-preview'
const { Document: DocxDocument, Packer: DocxPacker, Paragraph: DocxParagraph, TextRun: DocxTextRun } = docxLib

/**
 * 将DOCX文件转换为HTML
 * 该转换在Web Worker中进行，减轻主线程负担
 */
export const docxToHtml = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('开始处理DOCX文件:', file.name)
      
      // 创建加载提示
      const loadingEl = document.createElement('div')
      loadingEl.className = 'docx-loading'
      loadingEl.innerHTML = '<div class="spinner"></div><div>正在处理文档...</div>'
      loadingEl.style.position = 'fixed'
      loadingEl.style.top = '50%'
      loadingEl.style.left = '50%'
      loadingEl.style.transform = 'translate(-50%, -50%)'
      loadingEl.style.padding = '20px'
      loadingEl.style.background = 'rgba(0,0,0,0.7)'
      loadingEl.style.color = 'white'
      loadingEl.style.borderRadius = '8px'
      loadingEl.style.zIndex = '9999'
      loadingEl.style.display = 'flex'
      loadingEl.style.flexDirection = 'column'
      loadingEl.style.alignItems = 'center'
      loadingEl.style.gap = '10px'
      
      // 添加旋转动画
      const style = document.createElement('style')
      style.textContent = `
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `
      document.head.appendChild(style)
      document.body.appendChild(loadingEl)

      try {
        // 首先尝试使用 docx-preview
        const container = document.createElement('div')
        await renderAsync(file, container)
        const html = container.innerHTML
        
        // 移除加载提示
        document.body.removeChild(loadingEl)
        document.head.removeChild(style)
        
        resolve(html)
      } catch (previewError) {
        console.warn('docx-preview 渲染失败，尝试使用 mammoth:', previewError)
        
        try {
          // 使用 mammoth 作为备选方案
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          
          // 移除加载提示
          document.body.removeChild(loadingEl)
          document.head.removeChild(style)
          
          resolve(result.value)
        } catch (mammothError) {
          console.error('mammoth 转换失败:', mammothError)
          throw new Error('文档转换失败，请检查文件格式是否正确')
        }
      }
    } catch (error) {
      console.error('文档处理失败:', error)
      // 确保移除加载提示
      const loadingEl = document.querySelector('.docx-loading')
      const styleEl = document.querySelector('style')
      if (loadingEl) document.body.removeChild(loadingEl)
      if (styleEl) document.head.removeChild(styleEl)
      reject(error)
    }
  })
}

/**
 * 将HTML转换为DOCX文件
 * 由于复杂性，部分在主线程中处理
 */
export const htmlToDocx = async (html: string, fileName: string = 'document.docx'): Promise<File> => {
  // 仅在浏览器环境运行
  if (typeof window === 'undefined') {
    throw new Error('此函数仅在浏览器环境中可用')
  }
  
  try {
    const loadingId = `docx-loading-${Date.now()}`
    showLoadingIndicator(loadingId, '正在创建文档...')
    
    // 尝试使用Worker进行HTML预处理
    let cleanHtml = html
    try {
      const worker = getDocxWorker()
      if (worker.isReady.value) {
        cleanHtml = await worker.preprocessHtml(html)
      }
    } catch (err) {
      console.warn('使用Worker预处理HTML失败，使用默认处理', err)
      // 简单清理HTML
      cleanHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .trim()
    }
    
    // 在主线程上创建DOCX
    // 使用requestIdleCallback在空闲时执行，避免阻塞UI
    return new Promise((resolve, reject) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          try {
            const file = createDocxFile(cleanHtml, fileName)
            hideLoadingIndicator(loadingId)
            resolve(file)
          } catch (err) {
            hideLoadingIndicator(loadingId)
            reject(err)
          }
        }, { timeout: 5000 })
      } else {
        // 降级方案
        setTimeout(async () => {
          try {
            const file = createDocxFile(cleanHtml, fileName)
            hideLoadingIndicator(loadingId)
            resolve(file)
          } catch (err) {
            hideLoadingIndicator(loadingId)
            reject(err)
          }
        }, 0)
      }
    })
  } catch (error) {
    console.error('HTML转DOCX失败:', error)
    hideLoadingIndicator(`docx-loading-${Date.now()}`)
    throw error
  }
}

// 辅助函数：创建DOCX文件
const createDocxFile = (html: string, fileName: string): Promise<File> => {
  // 简单实现：提取文本并创建段落
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const textContent = doc.body.textContent || ''
  
  // 创建文档
  const docxDocument = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun(textContent)]
        })
      ]
    }]
  })
  
  // 生成文件
  return Packer.toBlob(docxDocument).then(blob => {
    return new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  })
}

// 显示加载指示器
const showLoadingIndicator = (id: string, message: string) => {
  if (typeof document === 'undefined') return
  
  let indicator = document.getElementById(id)
  if (!indicator) {
    indicator = document.createElement('div')
    indicator.id = id
    indicator.style.position = 'fixed'
    indicator.style.top = '50%'
    indicator.style.left = '50%'
    indicator.style.transform = 'translate(-50%, -50%)'
    indicator.style.background = 'rgba(0, 0, 0, 0.7)'
    indicator.style.color = 'white'
    indicator.style.padding = '15px 20px'
    indicator.style.borderRadius = '5px'
    indicator.style.zIndex = '9999'
    indicator.style.display = 'flex'
    indicator.style.alignItems = 'center'
    indicator.style.gap = '10px'
    
    const spinner = document.createElement('div')
    spinner.style.width = '20px'
    spinner.style.height = '20px'
    spinner.style.borderRadius = '50%'
    spinner.style.border = '2px solid #ffffff'
    spinner.style.borderTopColor = 'transparent'
    spinner.style.animation = 'spin 1s linear infinite'
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    
    document.head.appendChild(style)
    indicator.appendChild(spinner)
    indicator.appendChild(document.createTextNode(message))
    document.body.appendChild(indicator)
  } else {
    indicator.textContent = message
  }
}

// 隐藏加载指示器
const hideLoadingIndicator = (id: string) => {
  if (typeof document === 'undefined') return
  
  const indicator = document.getElementById(id)
  if (indicator) {
    indicator.remove()
  }
}

/**
 * 辅助函数：将 HTML 元素转换为 docx 段落
 * @param element HTML元素
 * @returns 转换后的段落数组
 */
const convertHtmlToParagraphs = (element: Element): Paragraph[] => {
  const paragraphs: Paragraph[] = []
  
  // 处理文本节点
  if (element.nodeType === Node.TEXT_NODE) {
    const text = element.textContent?.trim()
    if (text) {
      paragraphs.push(new Paragraph({
        children: [new TextRun(text)]
      }))
    }
    return paragraphs
  }

  // 处理元素节点
  for (const child of Array.from(element.children)) {
    const tagName = child.tagName.toLowerCase()
    
    switch (tagName) {
      case 'h1':
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(child.textContent || '')]
        }))
        break
      case 'h2':
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun(child.textContent || '')]
        }))
        break
      case 'h3':
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun(child.textContent || '')]
        }))
        break
      case 'p':
        paragraphs.push(new Paragraph({
          children: [new TextRun(child.textContent || '')]
        }))
        break
      default:
        paragraphs.push(...convertHtmlToParagraphs(child))
    }
  }

  return paragraphs
}

/**
 * 优化HTML内容，清理不必要的标签和属性
 * @param html HTML内容
 * @returns 清理后的HTML
 */
export const cleanHtml = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  
  // 移除所有script标签
  const scripts = div.querySelectorAll('script')
  scripts.forEach(script => script.remove())
  
  // 移除所有style标签
  const styles = div.querySelectorAll('style')
  styles.forEach(style => style.remove())
  
  // 移除可能有安全风险的属性
  const elements = div.querySelectorAll('*')
  elements.forEach(el => {
    el.removeAttribute('onclick')
    el.removeAttribute('onload')
    el.removeAttribute('onerror')
  })
  
  return div.innerHTML
}

/**
 * 简单的HTML转DOCX
 * 注意：这个实现非常基础，只能处理简单文本
 * 复杂的HTML转DOCX应该使用后端实现
 * @param html HTML内容
 * @param title 文档标题
 * @returns DOCX文件Blob对象
 */
export const simpleHtmlToDocx = async (html: string, title: string): Promise<Blob> => {
  const div = document.createElement('div')
  div.innerHTML = html
  
  // 提取纯文本内容
  const text = div.textContent || div.innerText || ''
  
  // 创建简单的DOCX文档
  const doc = new Document({
    title,
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun(text)
            ],
          }),
        ],
      },
    ],
  })
  
  // 生成DOCX文件
  return await Packer.toBlob(doc)
}

/**
 * 将HTML内容保存为下载文件
 * @param html HTML内容
 * @param filename 文件名
 */
export const saveHtmlAsFile = (html: string, filename: string): void => {
  const cleanedHtml = cleanHtml(html)
  const blob = new Blob([cleanedHtml], { type: 'text/html;charset=utf-8' })
  
  // 创建下载链接
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 从URL加载文档内容
 * @param url 文档URL
 * @returns 文档内容
 */
export const loadDocumentFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error('加载文档失败:', error)
    throw new Error('加载文档失败')
  }
}

// 创建Worker URL (仅在客户端)
const getWorkerUrl = () => {
  if (typeof window === 'undefined') return ''
  
  return new URL('@/utils/docxWorker.ts', import.meta.url).href
}

// 懒加载worker
let docxWorkerInstance: ReturnType<typeof useWorker> | null = null

// 获取Worker实例
const getDocxWorker = () => {
  if (!docxWorkerInstance) {
    docxWorkerInstance = useWorker({
      workerUrl: getWorkerUrl()
    })
  }
  return docxWorkerInstance
} 