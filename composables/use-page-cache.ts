import { ref, watch, nextTick } from 'vue'

interface CacheOptions {
  max?: number
  ttl?: number // 缓存存活时间(毫秒)
}

interface CacheItem {
  name: string
  timestamp: number
}

// 创建一个全局缓存管理工具
export const usePageCache = () => {
  // 当前活跃的缓存页面
  const activePages = ref<CacheItem[]>([])
  
  // 全局缓存选项
  const globalOptions = ref<CacheOptions>({
    max: 20,       // 默认最多缓存20个页面
    ttl: 3600000   // 默认缓存1小时
  })
  
  // 设置全局缓存选项
  const setOptions = (options: CacheOptions) => {
    // 先更新选项
    globalOptions.value = {
      ...globalOptions.value,
      ...options
    }
    
    // 使用 nextTick 确保在下一个 DOM 更新周期执行
    nextTick(() => {
      applyLimits()
    })
  }
  
  // 添加页面到缓存
  const addPage = (name: string) => {
    // 检查是否已存在
    const existingIndex = activePages.value.findIndex(p => p.name === name)
    
    if (existingIndex >= 0) {
      // 更新现有页面的时间戳
      activePages.value[existingIndex].timestamp = Date.now()
    } else {
      // 添加新页面
      activePages.value.push({
        name,
        timestamp: Date.now()
      })
      
      // 使用 nextTick 确保在下一个 DOM 更新周期执行
      nextTick(() => {
        applyLimits()
      })
    }
    
    return {
      // 提供移除方法
      remove: () => removePage(name)
    }
  }
  
  // 从缓存中移除页面
  const removePage = (name: string) => {
    const index = activePages.value.findIndex(p => p.name === name)
    if (index >= 0) {
      activePages.value.splice(index, 1)
      return true
    }
    return false
  }
  
  // 清除所有缓存
  const clearAllPages = () => {
    activePages.value = []
  }
  
  // 应用缓存限制(按时间戳排序，移除最旧的或超时的)
  const applyLimits = () => {
    try {
      const now = Date.now()
      const { max, ttl } = globalOptions.value
      
      // 先移除过期页面
      if (ttl) {
        activePages.value = activePages.value.filter(page => {
          return (now - page.timestamp) < ttl
        })
      }
      
      // 如果超过最大数量，按时间戳排序后移除最旧的
      if (max && activePages.value.length > max) {
        // 按时间戳降序排序
        activePages.value.sort((a, b) => b.timestamp - a.timestamp)
        // 只保留max个缓存页面
        activePages.value = activePages.value.slice(0, max)
      }
    } catch (error) {
      console.error('缓存限制应用失败:', error)
    }
  }
  
  // 获取要缓存的页面名称列表
  const getIncludedPages = () => {
    try {
      return activePages.value.map(p => p.name)
    } catch (error) {
      console.error('获取缓存页面列表失败:', error)
      return []
    }
  }
  
  // 定期检查缓存
  watch(activePages, () => {
    // 每次缓存变化时应用限制
    applyLimits()
  }, { deep: true })
  
  // 定期清理过期页面(每10分钟)
  if (typeof window !== 'undefined') {
    setInterval(() => {
      applyLimits()
    }, 600000)
  }
  
  return {
    activePages,
    addPage,
    removePage,
    clearAllPages,
    setOptions,
    getIncludedPages
  }
} 