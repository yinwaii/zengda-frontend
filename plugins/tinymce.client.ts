import { defineNuxtPlugin } from '#app'
import type { TinyMCEEditor } from 'tinymce'

// 直接导入TinyMCE核心
import tinymce from 'tinymce/tinymce'

// 必须的组件
import 'tinymce/icons/default/icons'
import 'tinymce/themes/silver/theme'
import 'tinymce/models/dom/model'

// 导入常用插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/help'
import 'tinymce/plugins/wordcount'

// 导出TinyMCE初始化函数
export const useTinymce = () => {
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    return {
      tinymce: null,
      initTiny: async () => null,
      isLoaded: false
    }
  }

  // 初始化函数
  const initTiny = async (options: any = {}) => {
    return new Promise<TinyMCEEditor | null>((resolve, reject) => {
      try {
        tinymce.init({
          ...options,
          setup: (editor: TinyMCEEditor) => {
            // 调用原始setup函数
            if (options.setup) {
              options.setup(editor)
            }
            
            editor.on('init', () => {
              resolve(editor)
            })
          },
          base_url: '/plugins/tinymce',
          skin: 'oxide',
          content_css: 'default'
        }).then(editors => {
          if (editors && editors.length > 0) {
            resolve(editors[0])
          } else {
            resolve(null)
          }
        }).catch(error => {
          console.error('TinyMCE初始化失败:', error)
          reject(error)
        })
      } catch (error) {
        console.error('TinyMCE初始化失败:', error)
        reject(error)
        return null
      }
    })
  }
  
  return {
    tinymce,
    initTiny,
    isLoaded: true
  }
}

// 加载TinyMCE样式函数
const loadTinyMCEStyles = () => {
  if (typeof window === 'undefined') return

  // 预加载样式
  const basePath = '/plugins/tinymce'
  const styleUrls = [
    `${basePath}/skins/ui/oxide/skin.min.css`,
    `${basePath}/skins/ui/oxide/content.min.css`,
    `${basePath}/skins/content/default/content.min.css`
  ]
  
  // 添加样式到头部
  styleUrls.forEach(url => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      document.head.appendChild(link)
    }
  })
}

export default defineNuxtPlugin({
  name: 'tinymce',
  enforce: 'pre',
  setup() {
    // 仅在客户端执行
    if (process.client) {
      // 设置TinyMCE的基本URL
      if (tinymce) {
        tinymce.baseURL = '/plugins/tinymce'
      }
      
      // 加载样式
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          loadTinyMCEStyles()
        }, { timeout: 2000 })
      } else {
        setTimeout(() => {
          loadTinyMCEStyles()
        }, 500)
      }
    }

    return {
      provide: {
        tinymce: useTinymce()
      }
    }
  }
}) 