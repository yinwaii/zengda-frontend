// useWorkers.ts - Web Worker 管理工具
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

// Worker配置选项
export interface WorkerOptions {
  workerUrl: string
  workerName?: string
  dependencies?: string[]
}

// Worker响应结构
export interface WorkerResponse {
  type: string
  id: string
  success: boolean
  error?: string
  html?: string
  messages?: string[]
  [key: string]: any
}

// DocxToHtml结果接口
export interface DocxToHtmlResult {
  html: string
  messages?: string[]
}

// PreprocessHtml结果接口
export interface PreprocessHtmlResult {
  html: string
}

/**
 * Worker管理钩子
 * 用于创建和管理Web Worker的生命周期
 */
export function useWorker(options: WorkerOptions) {
  const { workerUrl, workerName = 'documentWorker' } = options

  // Worker状态
  const worker: Ref<Worker | null> = ref(null)
  const isReady: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  // 消息队列和回调映射
  const callbacks = new Map<string, (response: WorkerResponse) => void>()

  // 创建Worker
  const createWorker = () => {
    try {
      // 仅在客户端创建Worker
      if (typeof window === 'undefined') {
        return
      }

      // 检查URL是否有效
      if (!workerUrl) {
        error.value = '无效的Worker URL'
        return
      }

      // 创建Worker实例
      worker.value = new Worker(workerUrl, { name: workerName, type: 'module' })

      // 设置消息处理器
      worker.value.onmessage = handleWorkerMessage
      worker.value.onerror = (event) => {
        console.error('Worker错误:', event)
        error.value = `Worker错误: ${event.message}`
      }
    } catch (err) {
      console.error('创建Worker失败:', err)
      error.value = err instanceof Error ? err.message : String(err)
    }
  }

  // 处理Worker消息
  const handleWorkerMessage = (event: MessageEvent) => {
    const response = event.data as WorkerResponse

    if (response.type === 'READY') {
      isReady.value = response.success
      if (!response.success) {
        error.value = response.error || 'Worker初始化失败'
      }
      return
    }

    // 查找并执行对应的回调
    const callback = callbacks.get(response.id)
    if (callback) {
      callback(response)
      callbacks.delete(response.id)
    }
  }

  // 发送消息到Worker并等待响应
  const sendMessage = <T>(type: string, payload?: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!worker.value) {
        reject(new Error('Worker未初始化'))
        return
      }

      // 生成唯一ID
      const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 注册回调
      callbacks.set(id, (response: WorkerResponse) => {
        if (response.success) {
          resolve(response as unknown as T)
        } else {
          reject(new Error(response.error || '未知错误'))
        }
      })

      // 发送消息
      worker.value.postMessage({ type, id, payload })
    })
  }

  // 将DOCX文件转换为HTML
  const docxToHtml = async (file: File): Promise<string> => {
    try {
      // 将文件转换为ArrayBuffer
      const buffer = await file.arrayBuffer()

      // 发送转换请求
      const response = await sendMessage<WorkerResponse>('DOCX_TO_HTML', { buffer })
      
      if (response.html) {
        return response.html
      }
      throw new Error('转换结果为空')
    } catch (error) {
      console.error('转换DOCX到HTML失败:', error)
      throw error
    }
  }

  // 预处理HTML
  const preprocessHtml = async (html: string): Promise<string> => {
    try {
      // 发送预处理请求
      const response = await sendMessage<WorkerResponse>('PREPROCESS_HTML', { html })
      
      if (response.html) {
        return response.html
      }
      throw new Error('预处理结果为空')
    } catch (error) {
      console.error('预处理HTML失败:', error)
      throw error
    }
  }

  // 生命周期钩子
  onMounted(() => {
    createWorker()
  })

  onBeforeUnmount(() => {
    // 清理Worker资源
    if (worker.value) {
      worker.value.terminate()
      worker.value = null
    }
  })

  return {
    worker,
    isReady,
    error,
    sendMessage,
    docxToHtml,
    preprocessHtml
  }
} 