import { defineNuxtPlugin, useRouter } from '#app'
import { usePageCache } from '~/composables/use-page-cache'

export default defineNuxtPlugin(() => {
  // 只在客户端运行
  if (typeof window === 'undefined') return
  
  const router = useRouter()
  const pageCache = usePageCache()
  
  // 设置全局缓存选项，可根据项目需求调整
  pageCache.setOptions({
    max: 15,       // 最多缓存15个页面
    ttl: 1800000   // 缓存30分钟
  })
  
  // 监听路由变化，管理页面缓存
  router.beforeEach((to, from) => {
    // 确保to和from对象存在且有meta属性
    if (to && to.meta && to.meta.pageCache === false) {
      pageCache.clearAllPages()
    }
    return true
  })
  
  router.afterEach((to, from) => {
    // 确保to和from对象存在且有meta属性
    if (to && to.name && from && from.name && to.name === from.name) {
      // 刷新相同页面
      pageCache.removePage(String(to.name))
    }
    
    // 确保to对象存在且有必要的属性
    if (to && to.meta && to.meta.pageCache === undefined && to.name) {
      // 没有明确指定缓存策略的页面，默认缓存
      pageCache.addPage(String(to.name))
    }
    
    // 确保to对象和to.meta有效
    if (!to || typeof to !== 'object') return
    
    // 安全地获取meta对象，如果不存在则使用空对象
    const meta = (to.meta && typeof to.meta === 'object') ? to.meta : {}
    const keepalive = meta.keepalive
    
    // 如果没有to.name属性，则不能添加到缓存
    if (!to.name) return
    
    // 如果明确设置为false，不添加到缓存
    if (keepalive === false) return
    
    // 如果有keepalive配置且是对象
    if (keepalive && typeof keepalive === 'object') {
      // 如果有include或exclude配置，交给页面自己管理
      if (keepalive.include || keepalive.exclude) return
      
      // 否则使用全局配置并添加页面到缓存
      pageCache.addPage(to.name as string)
    } 
    // 如果keepalive为true，添加到缓存
    else if (keepalive === true && to.name) {
      pageCache.addPage(to.name as string)
    }
    
    // 如果页面需要频繁更新数据，可以在onBeforeUnmount中
    // 移除缓存：pageCache.removePage(route.name as string)
    
    // 定期在控制台输出当前缓存的页面情况(仅开发环境)
    if (process.env.NODE_ENV === 'development') {
      console.log('[PageCache] 当前缓存页面:', pageCache.activePages.value.length, 
        pageCache.activePages.value.map(p => p.name).join(', '))
    }
  })
  
  // 暴露工具函数给应用使用
  return {
    provide: {
      pageCache
    }
  }
}) 