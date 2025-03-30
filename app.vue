<template>
  <div id="el">
    <!-- 路由加载指示器 -->
    <div v-if="isRouteLoading" class="route-loading-indicator">
      <div class="loader"></div>
    </div>
    
    <!-- 主界面采用异步加载 -->
    <nuxt-route-announcer/>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <Suspense>
        <NuxtPage />
        <template #fallback>
          <div class="page-loading">
            <div class="spinner"></div>
            <div class="text">加载中...</div>
          </div>
        </template>
      </Suspense>
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Toaster } from '~/components/ui/toast'

// const layout = 'shadcn'

// 路由加载状态
const isRouteLoading = ref(false)
const router = useRouter()

// 注册路由事件
onMounted(() => {
  router.beforeEach(() => {
    isRouteLoading.value = true
    return true
  })

  router.afterEach(() => {
    // 稍微延迟关闭加载指示器，以避免闪烁
    setTimeout(() => {
      isRouteLoading.value = false
    }, 100)
  })
  
  // 添加资源预取
  if (typeof window !== 'undefined') {
    // 预取常用页面
    const pagesToPrefetch = ['/']
    
    // 使用requestIdleCallback在空闲时间预取资源
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        pagesToPrefetch.forEach(page => {
          // 使用 Nuxt 提供的 useRouter 实现预加载
          const route = router.resolve(page)
          if (route) {
            // 使用链接预取代替动态导入
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.href = route.href
            link.as = 'document'
            document.head.appendChild(link)
          }
        })
      }, { timeout: 2000 })
    } else {
      setTimeout(() => {
        pagesToPrefetch.forEach(page => {
          const route = router.resolve(page)
          if (route) {
            // 使用链接预取代替动态导入
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.href = route.href
            link.as = 'document'
            document.head.appendChild(link)
          }
        })
      }, 1000)
    }
  }
})

// 全局资源预加载
if (process.client) {
  // 使用requestIdleCallback处理非关键资源
  const prefetchResources = () => {
    const { $resourceHints } = useNuxtApp()
    if ($resourceHints) {
      // 预连接常用CDN
      $resourceHints.preconnect('cdn.jsdelivr.net')
      $resourceHints.preconnect('fonts.googleapis.com')
    }
  }

  // 使用requestIdleCallback延迟处理
  if (window.requestIdleCallback) {
    window.requestIdleCallback(prefetchResources, { timeout: 2000 })
  } else {
    setTimeout(prefetchResources, 1000)
  }
  
  // 添加路由变化监听，滚动到顶部
  router.afterEach(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}
</script>

<style>
/* 路由加载指示器样式 */
.route-loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, transparent, #3b82f6, transparent);
  z-index: 9999;
  animation: loader 1s ease-in-out infinite;
}

@keyframes loader {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 页面加载样式 */
.page-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

.text {
  color: #4b5563;
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 全局样式 */
html, body {
  scroll-behavior: smooth;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* 加载指示器样式 */
.nuxt-loading-indicator {
  background: repeating-linear-gradient(
    to right,
    #4f46e5 0%,
    #818cf8 50%,
    #4f46e5 100%
  );
  height: 3px;
}
</style>