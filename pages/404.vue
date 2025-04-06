<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 class="text-4xl font-bold mb-4">404 - 页面未找到</h1>
    <p class="text-lg text-muted-foreground mb-8">您访问的页面不存在或已被移除</p>
    <shadcn-button @click="router.push('/')">
      返回首页
    </shadcn-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

definePageMeta({
  layout: 'default'
})
</script>
