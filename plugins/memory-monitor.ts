import { defineNuxtPlugin } from '#app'

// 扩展 Performance 接口
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const monitor = () => {
      const used = performance.memory?.usedJSHeapSize || 0
      const total = performance.memory?.totalJSHeapSize || 0
      const limit = performance.memory?.jsHeapSizeLimit || 0
      
      console.debug('Memory Usage:', {
        used: `${(used / 1024 / 1024).toFixed(2)}MB`,
        total: `${(total / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(limit / 1024 / 1024).toFixed(2)}MB`,
        percentage: `${((used / limit) * 100).toFixed(2)}%`
      })

      // 如果内存使用超过80%，发出警告
      if (used / limit > 0.8) {
        console.warn('Memory usage is high! Consider refreshing the page.')
      }
    }

    // 每分钟监控一次内存使用
    const interval = setInterval(monitor, 60000)

    // 在组件挂载后开始监控
    monitor()

    // 在应用销毁时清理
    nuxtApp.hook('app:created', () => {
      monitor()
    })

    // 确保在应用关闭时清理定时器
    nuxtApp.hook('app:error', () => {
      clearInterval(interval)
    })
  }
}) 