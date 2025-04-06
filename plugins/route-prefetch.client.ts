import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin({
  name: 'route-prefetch',
  setup() {
    // 仅在客户端执行
    if (process.client) {
      const router = useRouter()
      
      // 准备要预加载的路由路径列表
      const prefetchRoutes = [
        '/',
        // 移除不存在的路由
        // '/dashboard',
        // '/user/profile',
        // '/editor'
        
        // 可以添加项目中存在的路由
        '/design/project',
        '/design/template',
        '/system/dept',
        '/system/menu',
        '/system/role',
        '/system/user'
      ]
      
      const prefetchAll = () => {
        // 当网络空闲时预加载所有关键路由
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            prefetchRoutes.forEach(routePath => {
              try {
                // 使用router.resolve获取路由
                const route = router.resolve(routePath)
                if (route.matched.length && route.matched[0].components?.default) {
                  // 使用预取功能而不是直接调用组件
                  const path = route.href || routePath
                  const link = document.createElement('link')
                  link.rel = 'prefetch'
                  link.href = path
                  link.as = 'document'
                  
                  if (!document.head.querySelector(`link[rel="prefetch"][href="${path}"]`)) {
                    document.head.appendChild(link)
                    console.log(`预加载路由: ${routePath}`)
                  }
                }
              } catch (e) {
                // 忽略无效路由
              }
            })
          }, { timeout: 2000 })
        } else {
          // 回退机制
          setTimeout(() => {
            prefetchRoutes.forEach(routePath => {
              try {
                const route = router.resolve(routePath)
                if (route.matched.length) {
                  // 使用预取功能而不是直接调用组件
                  const path = route.href || routePath
                  const link = document.createElement('link')
                  link.rel = 'prefetch'
                  link.href = path
                  link.as = 'document'
                  
                  if (!document.head.querySelector(`link[rel="prefetch"][href="${path}"]`)) {
                    document.head.appendChild(link)
                  }
                }
              } catch (e) {
                // 忽略无效路由
              }
            })
          }, 1000)
        }
      }
      
      // 当页面进入idle状态时预加载
      if (document.readyState === 'complete') {
        prefetchAll()
      } else {
        window.addEventListener('load', prefetchAll)
      }

      // 鼠标悬停预加载
      document.addEventListener('mouseover', (e) => {
        // 检查是否是链接元素
        const target = e.target as HTMLElement
        const anchor = target.closest('a') as HTMLAnchorElement
        
        if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
          // 提取路径
          const path = anchor.pathname
          
          // 使用预取功能而不是直接调用组件
          try {
            const route = router.resolve(path)
            if (route.matched.length) {
              const prefetchPath = route.href || path
              const link = document.createElement('link')
              link.rel = 'prefetch'
              link.href = prefetchPath
              link.as = 'document'
              
              if (!document.head.querySelector(`link[rel="prefetch"][href="${prefetchPath}"]`)) {
                document.head.appendChild(link)
              }
            }
          } catch (e) {
            // 忽略错误
          }
        }
      }, { passive: true })
    }
  }
}) 