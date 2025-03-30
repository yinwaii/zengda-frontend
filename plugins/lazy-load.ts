import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'

/**
 * 简化的组件懒加载工具
 * @param loadComponent 组件加载函数
 * @returns 异步组件
 */
export const useLazyLoad = (loadComponent: () => Promise<any>) => {
  return defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
      loadComponent()
        .then(component => {
          resolve(component)
        })
        .catch(error => {
          console.error('组件加载失败', error)
          reject(error)
        })
    })
  })
}

/**
 * 图片懒加载指令
 */
export const lazyLoadDirective = {
  mounted(el: HTMLImageElement, binding: { value: string }) {
    if (!process.client) return

    // 创建一个观察器
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 当元素进入视口时加载图片
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    
    // 开始观察元素
    observer.observe(el)
  }
}

export default defineNuxtPlugin({
  name: 'lazy-load',
  setup(nuxtApp) {
    // 注册图片懒加载指令
    nuxtApp.vueApp.directive('lazy', lazyLoadDirective)
    
    return {
      provide: {
        lazyLoad: useLazyLoad
      }
    }
  }
}) 