import { defineNuxtPlugin } from '#app'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  // 只在客户端执行
  if (process.client) {
    const router = useRouter()
    const cache = new Map()

    // 在路由切换时保存页面状态
    router.beforeEach((to, from) => {
      if (from.meta.name) {
        // 只缓存必要的状态，避免缓存函数对象
        const state: Record<string, any> = {}
        const provides = nuxtApp.vueApp._context.provides
        for (const key in provides) {
          if (typeof provides[key] !== 'function' && key !== 'Symbol(router view depth)') {
            state[key] = provides[key]
          }
        }
        
        cache.set(from.meta.name, {
          scrollPosition: window.scrollY,
          state
        })
      }
    })

    // 在路由切换后恢复页面状态
    router.afterEach((to) => {
      if (to.meta.name) {
        const cached = cache.get(to.meta.name)
        if (cached) {
          window.scrollTo(0, cached.scrollPosition)
          // 恢复组件状态
          const provides = nuxtApp.vueApp._context.provides
          for (const key in cached.state) {
            if (typeof cached.state[key] !== 'function') {
              provides[key] = cached.state[key]
            }
          }
        }
      }
    })
  }
}) 