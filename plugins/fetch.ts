export default defineNuxtPlugin(() => {
  const userStore = useUserStore()

  // 添加请求拦截器
  addRouteMiddleware('auth', (to) => {
    if (!userStore.checkAuth() && to.path !== '/login') {
      return navigateTo('/login')
    }
  })

  // 配置全局 $fetch
  globalThis.$fetch = $fetch.create({
    credentials: 'include',
    onRequest({ options }) {
      const token = userStore.token
      if (token) {
        const headers = new Headers(options.headers)
				headers.set('Token', token)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        userStore.logout()
        navigateTo('/login')
      }
    }
  })
}) 