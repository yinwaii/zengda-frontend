import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'
import type { Component, AsyncComponentOptions as VueAsyncComponentOptions } from 'vue'

export interface CustomAsyncComponentOptions {
  delay?: number
  timeout?: number
  suspensible?: boolean
  loadingComponent?: Component
  errorComponent?: Component
  onError?: (error: Error, retry: () => void, fail: () => void, attempts: number) => void
}

export const useAsyncComponent = (loader: () => Promise<any>, options: CustomAsyncComponentOptions = {}) => {
  const defaultOptions: CustomAsyncComponentOptions = {
    delay: 200,
    timeout: 10000,
    suspensible: true,
    onError: (error: Error, retry: () => void, fail: () => void, attempts: number) => {
      // 默认3次重试
      if (attempts <= 3) {
        console.warn(`组件加载失败，第${attempts}次重试...`, error)
        setTimeout(() => {
          retry()
        }, 300 * attempts)
      } else {
        console.error('组件加载失败:', error)
        fail()
      }
    }
  }

  return defineAsyncComponent({
    loader,
    ...(defaultOptions as any),
    ...(options as any)
  })
}

export default defineNuxtPlugin({
  name: 'async-component',
  setup() {
    return {
      provide: {
        asyncComponent: useAsyncComponent
      }
    }
  }
}) 