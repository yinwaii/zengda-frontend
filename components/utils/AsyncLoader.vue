<template>
  <div :class="{ 'async-container': true, 'loading': loading }">
    <Suspense>
      <slot></slot>
      <template #fallback>
        <div class="loading-container">
          <div class="async-loader"></div>
          <div v-if="loadingText" class="loading-text">{{ loadingText }}</div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  loadingText?: string
  timeout?: number
}>()

const loading = ref(true)
let timer: number | null = null

// 模拟加载过程
onMounted(() => {
  timer = window.setTimeout(() => {
    loading.value = false
  }, props.timeout || 500)
})

// 清理定时器
onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
.async-container {
  position: relative;
  min-height: 200px;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: inherit;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
}

.async-loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary, #3b82f6);
  animation: spin 1s ease infinite;
  margin-bottom: 12px;
}

.loading-text {
  font-size: 14px;
  color: var(--muted-foreground, #6b7280);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 10;
}
</style> 