import { defineNuxtPlugin } from '#app'

/**
 * 资源预加载优先级
 */
enum ResourcePriority {
  HIGH = 'high',
  LOW = 'low'
}

/**
 * 关键资源预加载管理器
 */
export const ResourceHints = {
  /**
   * DNS预解析 - 用于提前解析域名
   * @param domain 需要预解析的域名
   */
  dnsPrefetch(domain: string): void {
    if (!process.client) return
    
    if (!domain.startsWith('http')) {
      domain = `https://${domain}`
    }
    
    const url = new URL(domain)
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = url.origin
    
    if (!document.head.querySelector(`link[rel="dns-prefetch"][href="${url.origin}"]`)) {
      document.head.appendChild(link)
    }
  },
  
  /**
   * 预连接 - 提前建立TCP连接
   * @param url 需要预连接的URL
   * @param crossorigin 是否跨域
   */
  preconnect(url: string, crossorigin = true): void {
    if (!process.client) return
    
    if (!url.startsWith('http')) {
      url = `https://${url}`
    }
    
    const urlObj = new URL(url)
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = urlObj.origin
    
    if (crossorigin) {
      link.crossOrigin = 'anonymous'
    }
    
    if (!document.head.querySelector(`link[rel="preconnect"][href="${urlObj.origin}"]`)) {
      document.head.appendChild(link)
    }
  },
  
  /**
   * 预加载资源
   * @param url 资源URL
   * @param as 资源类型
   * @param priority 优先级
   */
  preload(url: string, as: string, priority: ResourcePriority = ResourcePriority.HIGH): void {
    if (!process.client) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    link.as = as
    
    if (priority) {
      link.setAttribute('fetchpriority', priority)
    }
    
    if (!document.head.querySelector(`link[rel="preload"][href="${url}"]`)) {
      document.head.appendChild(link)
    }
  },
  
  /**
   * 预获取资源(低优先级)
   * @param url 资源URL
   */
  prefetch(url: string): void {
    if (!process.client) return
    
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    
    if (!document.head.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
      document.head.appendChild(link)
    }
  }
}

export default defineNuxtPlugin({
  name: 'resource-hints',
  setup() {
    if (process.client) {
      // 预连接常用的第三方资源
      const commonDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net'
      ]
      
      // 延迟加载非关键预连接
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          commonDomains.forEach(domain => {
            ResourceHints.preconnect(domain)
            ResourceHints.dnsPrefetch(domain)
          })
        }, { timeout: 2000 })
      } else {
        setTimeout(() => {
          commonDomains.forEach(domain => {
            ResourceHints.preconnect(domain)
            ResourceHints.dnsPrefetch(domain)
          })
        }, 1000)
      }
    }

    return {
      provide: {
        resourceHints: ResourceHints
      }
    }
  }
})