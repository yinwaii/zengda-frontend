<!-- 内存垃圾回收辅助组件 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

// 组件属性
const props = defineProps<{
  // 是否启用定期GC
  enabled?: boolean
  // GC间隔(毫秒)
  interval?: number
  // 离开页面时是否触发GC
  gcOnUnmount?: boolean
  // 离开页面时是否清除页面缓存
  clearCache?: boolean
  // 统计信息
  stats?: boolean
}>()

// 默认值
const enabled = props.enabled !== false
const interval = props.interval || 60000 // 默认1分钟
const gcOnUnmount = props.gcOnUnmount !== false
const clearCache = props.clearCache === true
const stats = props.stats === true

// 对性能API的引用
const perf = typeof performance !== 'undefined' ? performance : undefined

// 定期GC任务ID
let gcIntervalId: any = null

// 上次内存使用情况
let lastMemoryUsage: any = null

// 主动触发垃圾回收
const triggerGC = () => {
  if (typeof window === 'undefined') return
  
  try {
    // 尝试通过压力测试触发垃圾回收
    // 注意：这不会直接调用GC，但可能促使浏览器更频繁地进行GC
    const arr = []
    for (let i = 0; i < 1000; i++) {
      arr.push(new ArrayBuffer(1024 * 1024)) // 分配1MB
    }
    
    // 输出内存使用统计
    if (stats && perf && 'memory' in perf) {
      const memory = (perf as any).memory
      if (memory) {
        const currentUsage = {
          totalJSHeapSize: memory.totalJSHeapSize,
          usedJSHeapSize: memory.usedJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        }
        
        // 计算使用百分比
        const usagePercent = (currentUsage.usedJSHeapSize / currentUsage.jsHeapSizeLimit * 100).toFixed(2)
        
        // 如果有上次记录，计算变化
        if (lastMemoryUsage) {
          const diff = currentUsage.usedJSHeapSize - lastMemoryUsage.usedJSHeapSize
          const diffMB = (diff / 1024 / 1024).toFixed(2)
          const changeDirection = diff > 0 ? '增加' : '减少'
          
          console.log(`[MemoryGC] 内存使用: ${(currentUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB / ${(currentUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB (${usagePercent}%)`)
          console.log(`[MemoryGC] 与上次相比 ${changeDirection} ${Math.abs(parseFloat(diffMB))}MB`)
        } else {
          console.log(`[MemoryGC] 内存使用: ${(currentUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB / ${(currentUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB (${usagePercent}%)`)
        }
        
        // 更新上次使用记录
        lastMemoryUsage = currentUsage
      }
    }
  } catch (e) {
    console.error('[MemoryGC] GC触发失败:', e)
  }
}

// 清除页面缓存
const clearPageCache = () => {
  if (typeof window === 'undefined') return
  
  try {
    // 尝试调用nuxtApp提供的页面缓存清理
    const nuxtApp = useNuxtApp()
    if (nuxtApp.$pageCache) {
      const route = useRoute()
      if (route.name) {
        nuxtApp.$pageCache.removePage(String(route.name))
        if (stats) {
          console.log(`[MemoryGC] 已从缓存中移除页面: ${String(route.name)}`)
        }
      }
    }
  } catch (e) {
    console.error('[MemoryGC] 清除页面缓存失败:', e)
  }
}

// 组件挂载
onMounted(() => {
  // 初始GC
  if (enabled) {
    setTimeout(triggerGC, 1000)
    
    // 设置定期GC
    if (interval > 0) {
      gcIntervalId = setInterval(triggerGC, interval)
      
      if (stats) {
        console.log(`[MemoryGC] 已启动，间隔: ${interval / 1000}秒`)
      }
    }
  }
})

// 组件卸载前清理
onBeforeUnmount(() => {
  // 清除定期GC任务
  if (gcIntervalId) {
    clearInterval(gcIntervalId)
    gcIntervalId = null
  }
  
  // 离开时触发GC
  if (gcOnUnmount) {
    triggerGC()
  }
  
  // 清除页面缓存
  if (clearCache) {
    clearPageCache()
  }
  
  if (stats) {
    console.log('[MemoryGC] 已停止')
  }
})
</script>

<template>
  <!-- 不渲染任何内容的工具组件 -->
</template> 