import { defineNuxtPlugin } from '#app'
import type { TinyMCEEditor } from 'tinymce'

// 导出TinyMCE初始化函数，通过动态导入实现按需加载
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
    return new Promise<TinyMCEEditor | null>(async (resolve, reject) => {
      try {
        // 动态导入TinyMCE核心和必要组件
        const tinymce = (await import('tinymce/tinymce')).default
        
        // 导入必须的组件
        await Promise.all([
          import('tinymce/icons/default/icons'),
          import('tinymce/themes/silver/theme'),
          import('tinymce/models/dom/model')
        ])
        
        // 根据需要的插件动态导入
        const pluginsToLoad = [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount',
          'pagebreak', 'emoticons', 'directionality', 'nonbreaking', 'visualchars'
        ]
        
        // 并行加载插件
        await Promise.all(
          pluginsToLoad.map(plugin => {
            // 使用字符串字面量而不是模板字符串，避免Vite分析错误
            return import(/* @vite-ignore */ 'tinymce/plugins/' + plugin).catch(err => 
              console.warn(`警告: 插件 ${plugin} 加载失败:`, err)
            )
          })
        )
        
        console.log('TinyMCE 核心和插件加载完成')
        
        // 默认配置
        const defaultOptions = {
          base_url: '/plugins/tinymce',
          skin: 'oxide',
          content_css: 'default',
          table_sizing_mode: 'relative',
          plugins: pluginsToLoad.join(' '),
          toolbar: [
            'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | pagebreak | help',
            'emoticons | ltr rtl | visualchars | nonbreaking'
          ].join(' | '),
          menubar: 'file edit view insert format tools table help',
          toolbar_mode: 'wrap',
          forced_root_block: 'p',
          paste_data_images: true,
          browser_spellcheck: true,
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
          license_key: 'gpl',
          // 添加性能优化选项
          cache_suffix: `?v=${Date.now()}`, // 避免缓存问题
          inline_styles: false, // 减少不必要的样式处理
          entity_encoding: 'raw', // 减少编码处理
          convert_urls: false, // 避免URL转换
          // 减少重绘次数
          visual: false,
          // 延迟初始化
          init_instance_callback: (editor: any) => {
            setTimeout(() => {
              if (editor.notificationManager) {
                editor.notificationManager.open({
                  text: '编辑器初始化完成',
                  type: 'success',
                  timeout: 2000
                });
              } else {
                console.log('编辑器初始化完成');
              }
            }, 100);
          }
        }

        tinymce.init({
          ...defaultOptions,
          ...options,
          setup: (editor: TinyMCEEditor) => {
            // 调用原始setup函数
            if (options.setup) {
              options.setup(editor)
            }
            
            editor.on('init', () => {
              resolve(editor)
            })
          }
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
    tinymce: null, // 动态加载，不再提前暴露tinymce实例
    initTiny,
    isLoaded: true
  }
}

// 仅在需要时加载样式
const loadTinyMCEStyles = () => {
  if (typeof window === 'undefined') return

  const basePath = '/plugins/tinymce'
  const styleUrls = [
    `${basePath}/skins/ui/oxide/skin.min.css`,
    `${basePath}/skins/ui/oxide/content.min.css`,
    `${basePath}/skins/content/default/content.min.css`
  ]
  
  // 使用requestIdleCallback延迟加载非关键样式
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      styleUrls.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = url
          document.head.appendChild(link)
        }
      })
    }, { timeout: 2000 })
  } else {
    setTimeout(() => {
      styleUrls.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = url
          document.head.appendChild(link)
        }
      })
    }, 500)
  }
}

export default defineNuxtPlugin({
  name: 'tinymce',
  enforce: 'pre',
  setup() {
    // 仅在客户端执行
    if (process.client) {
      // 异步加载TinyMCE资源
      import('tinymce/tinymce').then(module => {
        const tinymce = module.default
        tinymce.baseURL = '/plugins/tinymce'
        
        // 延迟加载样式
        loadTinyMCEStyles()
      }).catch(err => {
        console.error('TinyMCE加载失败:', err)
      })
    }

    return {
      provide: {
        tinymce: useTinymce()
      }
    }
  }
}) 