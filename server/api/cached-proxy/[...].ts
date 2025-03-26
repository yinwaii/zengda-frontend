import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { hash as ohash } from 'ohash'

// 创建本地文件缓存
const storage = createStorage({
  driver: fsDriver({ base: '.nuxt/cache' })
})

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, '_')
  if (!path) {
    throw createError({
      statusCode: 400,
      message: '路径不能为空'
    })
  }

  const config = useRuntimeConfig()
  const dufsServer = config.dufsServer as string
  
  // 支持完整URL格式
  let fileUrl = path
  if (fileUrl.includes('%2F') || fileUrl.includes('%3A')) {
    fileUrl = decodeURIComponent(fileUrl)
  }
  
  // 如果不是完整URL，则拼接dufsServer
  if (!fileUrl.startsWith('http')) {
    fileUrl = `${dufsServer}/${fileUrl}`
  }
  
  // 生成缓存键
  const cacheKey = `proxy:${ohash(fileUrl)}`
  
  // 尝试从缓存获取
  const cachedData = await storage.getItem(cacheKey)
  if (cachedData) {
    console.log(`[缓存代理] 命中缓存: ${fileUrl}`)
    
    // 获取缓存的元数据
    const cachedMeta = await storage.getItem(`${cacheKey}:meta`) as { headers?: Record<string, string> } | null
    
    if (cachedMeta) {
      // 设置响应头
      for (const [key, value] of Object.entries(cachedMeta.headers || {})) {
        setResponseHeader(event, key, value)
      }
    }
    
    // 返回缓存数据
    return cachedData
  }
  
  console.log(`[缓存代理] 缓存未命中，转发请求到: ${fileUrl}`)
  
  // 设置超时控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
  
  try {
    // 转发请求到文件服务器
    const response = await fetch(fileUrl, {
      signal: controller.signal,
      headers: {
        'Accept': '*/*'
      }
    })
    
    // 清除超时
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`[缓存代理] 服务器响应错误: ${response.status} ${response.statusText}`)
      throw createError({
        statusCode: response.status,
        message: `服务器响应错误: ${response.statusText}`
      })
    }

    // 获取响应头
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // 收集要保存的头信息
    const headersToCache = {
      'Content-Type': contentType,
      'Content-Disposition': response.headers.get('content-disposition') || `attachment; filename="${path.split('/').pop()}"`,
      'Cache-Control': 'public, max-age=86400' // 24小时缓存
    }
    
    // 设置响应头
    for (const [key, value] of Object.entries(headersToCache)) {
      setResponseHeader(event, key, value)
    }
    
    // 获取二进制数据
    const buffer = await response.arrayBuffer()
    console.log(`[缓存代理] 获取成功，内容大小: ${buffer.byteLength} 字节`)
    
    // 缓存数据和元数据
    const dataToCache = Buffer.from(buffer)
    await storage.setItem(cacheKey, dataToCache)
    await storage.setItem(`${cacheKey}:meta`, {
      headers: headersToCache,
      timestamp: Date.now(),
      url: fileUrl
    })
    
    console.log(`[缓存代理] 已缓存数据: ${cacheKey}`)
    
    // 返回文件数据
    return dataToCache
  } catch (error: any) {
    // 清除超时
    clearTimeout(timeoutId)
    
    console.error('[缓存代理] 请求失败:', error)
    if (error.name === 'AbortError') {
      throw createError({
        statusCode: 504,
        message: '请求超时'
      })
    }
    
    throw createError({
      statusCode: 500,
      message: '代理请求失败: ' + (error instanceof Error ? error.message : String(error))
    })
  }
}) 