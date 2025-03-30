import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'lazy-routing',
  setup() {
    // 仅在客户端执行
    if (process.client) {
      // 加载所有链接的预检时机，使用IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            
            // 如果链接来自同一域名，预读取页面
            if (link.href && link.href.startsWith(window.location.origin)) {
              const prefetchLink = document.createElement('link')
              prefetchLink.rel = 'prefetch'
              prefetchLink.href = link.href
              prefetchLink.as = 'document'
              
              // 避免重复添加
              if (!document.head.querySelector(`link[rel="prefetch"][href="${link.href}"]`)) {
                document.head.appendChild(prefetchLink)
                console.log(`预读取链接: ${link.href}`)
              }
              
              // 停止观察已处理的链接
              observer.unobserve(link)
            }
          }
        })
      }, { threshold: 0.1 })

      // 在页面加载完成后开始预读取
      if (document.readyState === 'complete') {
        initPrefetch()
      } else {
        window.addEventListener('load', initPrefetch)
      }

      function initPrefetch() {
        // 延迟执行，优先加载当前页面资源
        setTimeout(() => {
          // 获取所有内部链接
          const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]')
          
          // 观察所有内部链接
          internalLinks.forEach(link => {
            observer.observe(link)
          })
          
          // 用户浏览器支持的情况下，也可以添加鼠标悬停预读取
          document.addEventListener('mouseover', (e) => {
            const target = e.target as HTMLElement
            const anchor = target.closest('a') as HTMLAnchorElement

            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
              // 创建预读取链接
              const prefetchLink = document.createElement('link')
              prefetchLink.rel = 'prefetch'
              prefetchLink.href = anchor.href
              prefetchLink.as = 'document'
              
              // 避免重复添加
              if (!document.head.querySelector(`link[rel="prefetch"][href="${anchor.href}"]`)) {
                document.head.appendChild(prefetchLink)
              }
            }
          }, { passive: true })
        }, 1000)
      }
    }
  }
}) 