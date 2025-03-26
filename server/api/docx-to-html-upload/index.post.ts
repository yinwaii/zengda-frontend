import mammoth from 'mammoth'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { readMultipartFormData } from 'h3'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { hash as ohash } from 'ohash'

// 创建本地文件缓存
const storage = createStorage({
  driver: fsDriver({ base: '.nuxt/cache' })
})

export default defineEventHandler(async (event) => {
  try {
    console.log('[DOCX上传] 开始处理文件上传...')
    
    // 解析上传文件
    const files = await readMultipartFormData(event)
    
    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        message: '未找到上传的文件'
      })
    }
    
    // 获取文件数据
    const file = files.find(f => f.name === 'file')
    if (!file) {
      throw createError({
        statusCode: 400,
        message: '未找到名为"file"的上传文件'
      })
    }
    
    console.log('[DOCX上传] 接收到文件:', file.filename, '大小:', file.data.length, '字节')
    
    // 生成缓存键
    const cacheKey = `docx-html:${ohash(file.filename || 'unnamed')}_${ohash(file.data.toString('base64').substring(0, 100))}`
    
    // 尝试从缓存获取
    const cachedHtml = await storage.getItem(cacheKey)
    if (cachedHtml) {
      console.log(`[DOCX上传] 命中缓存: ${file.filename}`)
      
      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // 24小时缓存
      })
      
      // 返回缓存HTML
      return cachedHtml
    }
    
    console.log(`[DOCX上传] 缓存未命中，开始处理文件: ${file.filename}`)
    
    // 创建临时文件
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `uploaded_${Date.now()}.docx`)
    
    // 将上传的文件保存到临时文件
    fs.writeFileSync(tempFilePath, file.data)
    console.log(`[DOCX上传] 文件已保存到临时位置: ${tempFilePath}`)
    
    try {
      // 使用文件路径转换docx到html
      console.log(`[DOCX上传] 开始转换文件...`)
      
      // 创建自定义样式映射
      const styleMap = `
      p[style-name='heading 1'] => h1:fresh
      p[style-name='heading 2'] => h2:fresh
      p[style-name='heading 3'] => h3:fresh
      p[style-name='heading 4'] => h4:fresh
      p[style-name='heading 5'] => h5:fresh
      p[style-name='heading 6'] => h6:fresh
      p[style-name='Title'] => h1.title:fresh
      p[style-name='Subtitle'] => h2.subtitle:fresh
      p[style-name='Normal'] => p:fresh
      p[style-name='Quote'] => blockquote:fresh
      p[style-name='Intense Quote'] => blockquote.intense:fresh
      r[style-name='Strong'] => strong
      r[style-name='Emphasis'] => em
      table => table.docx-table
      r[style-name='Hyperlink'] => a
      p[style-name='heading 1'][align='center'] => h1.center:fresh
      p[style-name='heading 2'][align='center'] => h2.center:fresh
      p[style-name='heading 3'][align='center'] => h3.center:fresh
      p[align='center'] => p.center:fresh
      `;
      
      // 自定义图片转换器以保留图片尺寸
      const convertImage = (element: any) => {
        return element.read("binary").then((imageBuffer: Buffer) => {
          // 获取图片原始宽高
          const width = element.width || null;
          const height = element.height || null;
          
          // 转换为base64数据
          const base64Image = Buffer.from(imageBuffer).toString("base64");
          const imgType = element.contentType || "image/png";
          const dataUri = `data:${imgType};base64,${base64Image}`;
          
          // 创建包含宽高的图片元素
          let imgElement = `<img src="${dataUri}"`;
          if (width) imgElement += ` width="${width}"`;
          if (height) imgElement += ` height="${height}"`;
          imgElement += ` alt="文档图片" style="max-width: 100%;"`;
          imgElement += '>';
          
          return { value: imgElement };
        });
      };
      
      // 配置转换选项
      const options: any = {
        styleMap: styleMap,
        convertImage: convertImage,
        ignoreEmptyParagraphs: false,
        includeDefaultStyleMap: true,
        includeEmbeddedStyleMap: true
      };
      
      const result = await mammoth.convertToHtml({ path: tempFilePath }, options)
      const html = result.value
      
      // 注入额外的CSS样式以支持居中等格式
      const enhancedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          .center { text-align: center; }
          .title { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 16pt; }
          .subtitle { font-size: 18pt; font-style: italic; text-align: center; margin-bottom: 16pt; }
          table.docx-table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          table.docx-table td, table.docx-table th { border: 1px solid #ddd; padding: 8px; }
          blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; font-style: italic; }
          blockquote.intense { background-color: #f8f8f8; }
          img { display: block; margin: 10px auto; max-width: 100%; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
      `;
      
      // 记录转换警告
      if (result.messages.length > 0) {
        console.warn('[DOCX上传] 转换警告:', result.messages)
      }
      
      // 转换完成后删除临时文件
      fs.unlinkSync(tempFilePath)
      console.log(`[DOCX上传] 临时文件已删除`)
      
      // 缓存转换结果
      await storage.setItem(cacheKey, enhancedHtml)
      await storage.setItem(`${cacheKey}:meta`, {
        timestamp: Date.now(),
        filename: file.filename
      })
      
      console.log(`[DOCX上传] 已缓存转换结果: ${cacheKey}`)
      
      console.log(`[DOCX上传] 转换成功，HTML大小: ${enhancedHtml.length} 字符`)
      
      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // 24小时缓存
      })
      
      // 返回HTML内容
      return enhancedHtml
    } catch (error: any) {
      // 出错时也要删除临时文件
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
        console.log(`[DOCX上传] 错误处理中删除临时文件`)
      }
      
      throw error
    }
  } catch (error: any) {
    console.error('[DOCX上传] 处理上传文件失败:', error)
    throw createError({
      statusCode: 500,
      message: '处理上传文件失败: ' + (error instanceof Error ? error.message : String(error))
    })
  }
}) 