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

export default defineNuxtPlugin((nuxtApp) => {
  // 注册图片懒加载指令
  nuxtApp.vueApp.directive('lazy', lazyLoadDirective)
  
  // 配置需要懒加载的组件
  nuxtApp.vueApp.component('TinyMCE', () => import('@tinymce/tinymce-vue'))
  
  // 图表组件懒加载
  nuxtApp.vueApp.component('LineChart', () => import('recharts').then(m => m.LineChart))
  nuxtApp.vueApp.component('AreaChart', () => import('recharts').then(m => m.AreaChart))
  
  // 文档预览组件懒加载
  nuxtApp.vueApp.component('DocxPreview', () => import('docx-preview'))

  return {
    provide: {
      lazyLoad: useLazyLoad
    }
  }
}) 