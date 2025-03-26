import mammoth from 'mammoth'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  
  if (!filename) {
    throw createError({
      statusCode: 400,
      message: '文件名不能为空'
    })
  }
  
  // 重定向到新的缓存API
  return sendRedirect(event, `/api/cached-docx-to-html/${filename}`, 301)
}) 