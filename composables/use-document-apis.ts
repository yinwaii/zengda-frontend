export const useDocumentApis = () => {
  const { public: publicConfig } = useRuntimeConfig()
  const apiBase = publicConfig.apiBase || ''
  
  return {
    // 获取文档转换为HTML
    docxToHtml: async (filename: string | File) => {
      try {
        // 如果传入的是File对象，上传文件并转换
        if (filename instanceof File) {
          // 使用FormData上传文件
          const formData = new FormData()
          formData.append('file', filename)

          const response = await fetch(`${apiBase}/api/docx-to-html-upload`, {
            method: 'POST',
            body: formData
          })
          
          if (!response.ok) {
            throw new Error(`转换失败: ${response.status} ${response.statusText}`)
          }
          
          return await response.text()
        }
        
        // 如果是字符串，视为URL或文件名
        const url = filename.includes('://') 
          ? encodeURIComponent(filename) 
          : filename
          
        const response = await fetch(`${apiBase}/api/docx-to-html/${url}`)
        
        if (!response.ok) {
          throw new Error(`转换失败: ${response.status} ${response.statusText}`)
        }
        
        return await response.text()
      } catch (error) {
        console.error('获取文档HTML失败:', error)
        throw error
      }
    },
    
    // 下载原始文档
    downloadDocx: async (filename: string) => {
      try {
        const url = filename.includes('://') 
          ? encodeURIComponent(filename) 
          : filename
        
        const response = await fetch(`${apiBase}/api/proxy/${url}`, {
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        })
        
        if (!response.ok) {
          throw new Error(`下载失败: ${response.status} ${response.statusText}`)
        }
        
        return await response.blob()
      } catch (error) {
        console.error('下载文档失败:', error)
        throw error
      }
    }
  }
} 