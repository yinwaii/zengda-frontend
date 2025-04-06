import * as mammoth from 'mammoth'
import { renderAsync } from 'docx-preview'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { hash as ohash } from 'ohash'
import { JSDOM } from 'jsdom'

// 确保缓存目录存在
const CACHE_DIR = './.nuxt/cache/docx-html'
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    console.log(`[DOCX转HTML] 创建缓存目录: ${CACHE_DIR}`)
  }
} catch (error) {
  console.error(`[DOCX转HTML] 创建缓存目录失败: ${error}`)
}

// 创建本地文件缓存
const storage = createStorage({
  driver: fsDriver({ base: CACHE_DIR })
})

export default defineEventHandler(async (event) => {
  try {
    const filename = getRouterParam(event, 'filename')
    if (!filename) {
      throw createError({
        statusCode: 400,
        message: '文件名不能为空'
      })
    }

    // 解码文件名，如果是URL编码
    let fileUrl = decodeURIComponent(filename)
    console.log(`[DOCX转HTML] 处理文件: ${fileUrl}`)

    // 检查缓存
    const cacheKey = `docx-html:${ohash(fileUrl)}`
    const cachedData = await storage.getItem(cacheKey)
    
    if (cachedData) {
      console.log(`[DOCX转HTML] 命中缓存: ${fileUrl}`)
      
      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // 24小时缓存
      })
      
      return cachedData
    }
    
    console.log(`[DOCX转HTML] 缓存未命中，开始下载文件: ${fileUrl}`)
    
    // 处理文件URL
    let finalFileUrl = fileUrl;
    
    // 如果不是完整URL，加上服务器地址
    if (!finalFileUrl.startsWith('http://') && !finalFileUrl.startsWith('https://')) {
      // 从环境变量或配置获取文件服务器地址
      const config = useRuntimeConfig()
      const dufsServer = config.dufsServer || process.env.DUFS_SERVER || 'http://localhost:6990'
      finalFileUrl = `${dufsServer}/${finalFileUrl}`
    }
    
    // 下载文件
    console.log(`[DOCX转HTML] 下载文件: ${finalFileUrl}`)
    
    // 设置超时时间
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
    
    let response
    try {
      response = await fetch(finalFileUrl, { 
        signal: controller.signal 
      })
      clearTimeout(timeoutId)
    } catch (err: any) {
      clearTimeout(timeoutId)
      console.error(`[DOCX转HTML] 下载文件失败: ${finalFileUrl}`, err)
      throw createError({
        statusCode: 500,
        message: `下载文件失败: ${err.message}`
      })
    }
    
    if (!response.ok) {
      console.error(`[DOCX转HTML] 文件服务器响应错误: ${response.status} ${response.statusText}`)
      throw createError({
        statusCode: response.status,
        message: `文件服务器响应错误: ${response.statusText}`
      })
    }
    
    // 检查内容类型
    const contentType = response.headers.get('content-type') || ''
    console.log(`[DOCX转HTML] 文件类型: ${contentType}`)
    
    // 获取文件内容
    const fileBuffer = await response.arrayBuffer()
    console.log(`[DOCX转HTML] 文件下载成功: ${finalFileUrl}, 大小: ${fileBuffer.byteLength} 字节`)
    
    // 检查文件内容是否为空
    if (fileBuffer.byteLength === 0) {
      throw createError({
        statusCode: 400,
        message: '文件内容为空'
      })
    }
    
    // 检查文件类型，确保是DOCX文件
    if (!contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') &&
        !contentType.includes('application/octet-stream')) {
      console.warn(`[DOCX转HTML] 警告: 文件类型可能不是DOCX文件: ${contentType}`)
    }
    
    // 使用jsdom创建虚拟DOM环境
    const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
    const { window } = jsdom
    
    // 全局添加DOMParser到JSDOM的window对象
    if (!window.DOMParser) {
      window.DOMParser = class DOMParser {
        parseFromString(str: string, type: string) {
          return new JSDOM(str, { contentType: type }).window.document;
        }
      };
    }
    
    // 全局添加Node和其他必要的对象
    if (!global.window) {
      (global as any).window = window;
    }
    if (!global.document) {
      (global as any).document = window.document;
    }
    if (!global.Node) {
      (global as any).Node = window.Node;
    }
    if (!global.DOMParser) {
      global.DOMParser = window.DOMParser;
    }
    
    try {
      console.log(`[DOCX转HTML] 使用docx-preview渲染文档...`)
      
      // 创建容器
      const container = window.document.createElement('div')
      if (!container) {
        throw new Error('创建容器元素失败')
      }
      
      window.document.body.appendChild(container)
      
      // 使用docx-preview渲染
      await renderAsync(fileBuffer, container, undefined, {
        className: 'docx-viewer',
        inWrapper: true,
        ignoreWidth: true,
        ignoreHeight: true,
        ignoreFonts: false,
        breakPages: true,
        debug: false
      })
      
      // 添加样式
      const styleElement = window.document.createElement('style')
      styleElement.textContent = `
        .docx-viewer {
          width: 100%;
          margin: 0 auto;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        .docx-viewer table {
          border-collapse: collapse;
          width: 100%;
        }
        .docx-viewer td, .docx-viewer th {
          padding: 8px;
        }
        .docx-viewer img {
          max-width: 100%;
          height: auto;
        }
        .docx-viewer p {
          margin: 0;
          padding: 0;
          min-height: 1em;
        }
        .docx-wrapper {
          padding: 20px;
          background-color: white;
        }
      `
      container.prepend(styleElement)
      
      // 创建HTML
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${styleElement.outerHTML}
        </head>
        <body>
          ${container.innerHTML}
        </body>
        </html>
      `
      
      console.log(`[DOCX转HTML] docx-preview渲染成功，HTML大小: ${html.length}`)
      
      // 缓存结果
      await storage.setItem(cacheKey, html)
      
      // 保存元数据
      await storage.setItem(`${cacheKey}:meta`, {
        timestamp: Date.now(),
        fileUrl,
        contentType
      })
      
      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // 24小时缓存
      })
      
      return html
    } catch (error) {
      // 记录docx-preview错误
      console.error(`[DOCX转HTML] docx-preview渲染失败，尝试使用mammoth作为备选:`, error)
      
      // 将ArrayBuffer保存为临时文件
      const tempFilePath = path.join(os.tmpdir(), `${ohash(fileUrl)}.docx`)
      await fs.promises.writeFile(tempFilePath, Buffer.from(fileBuffer))
      
      try {
        // 使用mammoth作为备选
        const mammothResult = await mammoth.convertToHtml({ path: tempFilePath }, {
          styleMap: [
            "p[style-name='Title'] => h1.title",
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "p[style-name='Heading 5'] => h5:fresh",
            "p[style-name='Heading 6'] => h6:fresh"
          ],
          // 自定义图片转换器，保留图片尺寸
          convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(function(imageBuffer) {
              return {
                src: `data:${image.contentType};base64,${imageBuffer}`
              }
            })
          })
        })
        
        // 创建HTML文档
        const styleCSS = `
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          td, th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #333;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
          h1.title {
            font-size: 2em;
            text-align: center;
          }
        `
          
        const mammothHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${styleCSS}</style>
          </head>
          <body>
            <div class="mammoth-content">
              ${mammothResult.value}
            </div>
          </body>
          </html>
        `
        
        console.log(`[DOCX转HTML] mammoth转换成功，HTML大小: ${mammothHtml.length}`)
        
        // 缓存结果
        await storage.setItem(cacheKey, mammothHtml)
        
        // 保存元数据
        await storage.setItem(`${cacheKey}:meta`, {
          timestamp: Date.now(),
          fileUrl,
          contentType,
          converter: 'mammoth'
        })
        
        // 删除临时文件
        try {
          await fs.promises.unlink(tempFilePath)
        } catch (err: any) {
          console.warn(`[DOCX转HTML] 删除临时文件失败: ${tempFilePath}`, err)
        }
        
        // 设置响应头
        setResponseHeaders(event, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=86400' // 24小时缓存
        })
        
        return mammothHtml
      } catch (mammothError: any) {
        console.error(`[DOCX转HTML] mammoth转换也失败:`, mammothError)
        
        // 删除临时文件
        try {
          await fs.promises.unlink(tempFilePath)
        } catch (err: any) {
          console.warn(`[DOCX转HTML] 删除临时文件失败: ${tempFilePath}`, err)
        }
        
        throw createError({
          statusCode: 500,
          message: `文档转换失败: ${mammothError.message}`
        })
      }
    }
  } catch (error: any) {
    console.error(`[DOCX转HTML] 处理异常:`, error)
    
    if (error.name === 'AbortError') {
      throw createError({
        statusCode: 504,
        message: '下载文件超时，请稍后重试'
      })
    }
    
    // 如果已经是H3Error，直接抛出
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: `下载并转换文件失败: ${error.message}`
    })
  }
}) 