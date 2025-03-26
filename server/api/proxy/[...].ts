import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { hash as ohash } from 'ohash'

// 创建本地文件缓存
const storage = createStorage({
  driver: fsDriver({ base: '.nuxt/cache' })
})

export default defineEventHandler(async (event) => {
  try {
    // 获取请求路径中的目标URL
    const params = getRouterParams(event)
    let targetUrl = Array.isArray(params.wild) ? params.wild.join('/') : params.wild || ''
    
    // 解码URL（如果是编码的）
    if (targetUrl.includes('%2F') || targetUrl.includes('%3A')) {
      targetUrl = decodeURIComponent(targetUrl)
    }
    
    // 确保是完整URL
    if (!targetUrl.startsWith('http')) {
      const config = useRuntimeConfig()
      const dufsServer = config.dufsServer as string
      targetUrl = `${dufsServer}/${targetUrl}`
    }
    
    // 获取请求方法
    const method = event.method
    console.log(`[代理] ${method} ${targetUrl}`)
    
    // 获取请求头
    const headers = getRequestHeaders(event) || {}
    const acceptHeader = headers['accept'] || '*/*'
    
    // 为二进制文件生成缓存键
    let cacheKey = null
    if (method === 'GET' && acceptHeader.includes('application/') || acceptHeader === '*/*') {
      cacheKey = `proxy:${ohash(targetUrl)}`
      
      // 尝试从缓存获取
      const cachedResponse = await storage.getItem(cacheKey)
      const cachedMeta = await storage.getItem(`${cacheKey}:meta`) as any || {}
      
      if (cachedResponse) {
        console.log(`[代理] 命中缓存: ${targetUrl}`)
        
        // 设置响应头
        setResponseHeaders(event, {
          'Content-Type': cachedMeta.contentType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=86400', // 24小时缓存
          'Content-Length': cachedMeta.size?.toString() || undefined
        })
        
        return cachedResponse
      }
    }
    
    // 设置超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
    
    try {
      // 构建请求选项
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Accept': acceptHeader
        },
        signal: controller.signal
      }
      
      // 添加请求体（如果是POST/PUT等请求）
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const body = await readBody(event)
        if (body) {
          fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
        }
      }
      
      // 发送请求
      const response = await fetch(targetUrl, fetchOptions)
      
      // 清除超时
      clearTimeout(timeoutId)
      
      // 检查响应状态
      if (!response.ok) {
        console.error(`[代理] 请求失败: ${response.status} ${response.statusText}`)
        throw createError({
          statusCode: response.status,
          message: `代理请求失败: ${response.statusText}`
        })
      }
      
      // 获取响应内容类型
      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      
      // 根据内容类型处理响应
      let responseData: any
      
      // 根据接受的内容类型确定如何解析响应
      if (acceptHeader.includes('application/json')) {
        responseData = await response.json()
      } else if (acceptHeader.includes('text/')) {
        responseData = await response.text()
      } else {
        // 二进制数据
        const buffer = await response.arrayBuffer()
        responseData = Buffer.from(buffer)
        
        // 缓存二进制数据
        if (cacheKey) {
          await storage.setItem(cacheKey, responseData)
          await storage.setItem(`${cacheKey}:meta`, {
            timestamp: Date.now(),
            url: targetUrl,
            contentType,
            size: buffer.byteLength
          })
          console.log(`[代理] 已缓存响应: ${cacheKey}, 大小: ${buffer.byteLength} 字节`)
        }
      }
      
      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400' // 24小时缓存
      })
      
      return responseData
    } catch (error: any) {
      // 清除超时
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw createError({
          statusCode: 504,
          message: '代理请求超时'
        })
      }
      
      throw error
    }
  } catch (error: any) {
    console.error('[代理] 请求失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: '代理请求失败: ' + (error.message || String(error))
    })
  }
}) 