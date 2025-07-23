export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  // 不需要登录的路由
  const publicRoutes = ['/login', '/register', '/welcome']

  // 如果访问的是公开路由，直接放行
  if (publicRoutes.includes(to.path)) {
    return
  }

  // 检查是否已登录
  if (!userStore.checkAuth()) {
    // 未登录则重定向到登录页
    // console.log('未登录')
    return navigateTo('/login')
  }
})
