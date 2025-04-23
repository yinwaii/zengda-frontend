export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  const config = useRuntimeConfig()
  const dufsServer = config.public.dufsServer as string || ''
  
  try {
    // 从dufs服务器获取文件
    const response = await fetch(`${dufsServer}/${filename}`, {
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    })
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `文件下载失败: ${response.statusText}`
      })
    }
    
    // 获取二进制数据
    const arrayBuffer = await response.arrayBuffer()
    
    // 设置响应头
    setResponseHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`
    })
    
    // 返回文件数据
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('获取文件失败:', error)
    throw createError({
      statusCode: 500,
      message: '获取文件失败'
    })
  }
}) 