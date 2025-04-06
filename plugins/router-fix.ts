import { defineNuxtPlugin } from '#app'
import { useRouter } from 'vue-router'

// 使用一个全局变量来追踪插件是否已经运行
let isRouterFixApplied = false

export default defineNuxtPlugin((nuxtApp) => {
  // 如果插件已经运行过，则直接返回以避免重复执行
  if (isRouterFixApplied) {
    return
  }
  
  // 标记插件已运行
  isRouterFixApplied = true
  
  console.log('Router fix plugin running...')
  
  // 仅在客户端环境中执行
  if (process.client) {
    try {
      // 获取路由实例
      const router = useRouter()
      
      // 添加通配符路由处理程序
      if (router) {
        // 添加通配符路由来处理404
        router.addRoute({
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('../pages/404.vue')
        })
      }
      
      // 如果nuxtApp.$router不存在，创建一个空的对象
      if (!nuxtApp.$router) {
        console.warn('$router not found in nuxtApp, creating a placeholder...')
        nuxtApp.$router = router || {
          currentRoute: {
            value: {
              path: '',
              name: '',
              params: {},
              query: {},
              hash: '',
              fullPath: '',
              matched: [],
              meta: {},
              redirectedFrom: undefined
            }
          },
          options: {},
          getRoutes: () => [],
          hasRoute: () => false,
          resolve: () => ({
            name: '',
            path: '',
            params: {},
            query: {},
            hash: '',
            fullPath: '',
            matched: [],
            meta: {},
            href: '',
            redirectedFrom: undefined
          }),
          push: () => Promise.resolve(),
          replace: () => Promise.resolve(),
          go: () => {},
          back: () => {},
          forward: () => {},
          beforeEach: () => () => {},
          beforeResolve: () => () => {},
          afterEach: () => () => {},
          onError: () => () => {},
          isReady: () => Promise.resolve(),
          install: () => {}
        }
      }
      
      // 如果nuxtApp._route不存在，创建一个空对象
      if (!nuxtApp._route) {
        console.warn('_route not found in nuxtApp, creating a placeholder...')
        nuxtApp._route = {
          path: '',
          name: '',
          params: {},
          query: {},
          hash: '',
          fullPath: '',
          matched: [],
          meta: {},
          redirectedFrom: undefined
        }
      }
      
      // 确保meta对象存在
      if (nuxtApp._route && !nuxtApp._route.meta) {
        nuxtApp._route.meta = {}
      }
      
      console.log('Router fix plugin complete')
    } catch (error) {
      console.error('Error in Router fix plugin:', error)
    }
  }
}) 