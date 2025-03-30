<template>
  <div class="lazy-image-container" :style="{ height: `${height}px` }">
    <img
      ref="imageRef"
      :data-src="src"
      :src="placeholder || defaultPlaceholder"
      :alt="alt"
      :class="{ 'lazy-image': true, 'loaded': isLoaded }"
      @load="onLoadComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  height?: number
  width?: number
  placeholder?: string
}>()

// 默认占位图（1x1像素的透明图片）
const defaultPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
let observer: IntersectionObserver | null = null

// 图片加载完成事件
function onLoadComplete() {
  isLoaded.value = true
}

// 初始化IntersectionObserver
onMounted(() => {
  if (!window.IntersectionObserver) {
    // 如果浏览器不支持 IntersectionObserver，直接加载图片
    loadImage()
    return
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && imageRef.value) {
        loadImage()
        observer?.unobserve(imageRef.value)
      }
    })
  }, { threshold: 0.1 })

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }
})

// 加载图片
function loadImage() {
  if (imageRef.value) {
    const dataSrc = imageRef.value.getAttribute('data-src')
    if (dataSrc) {
      // 预加载图片
      const img = new Image()
      img.onload = () => {
        if (imageRef.value) {
          imageRef.value.src = dataSrc
        }
      }
      img.src = dataSrc
    }
  }
}

// 清理
onBeforeUnmount(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value)
    observer = null
  }
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: #f5f5f5;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
  opacity: 0;
  filter: blur(10px);
}

.lazy-image.loaded {
  opacity: 1;
  filter: blur(0);
}
</style> 