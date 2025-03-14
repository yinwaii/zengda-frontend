<template>
  <div class="login-container flex min-h-screen w-full">
    <!-- Welcome Section -->
    <div class="welcome-section hidden sm:flex w-full sm:w-1/2 flex-col items-center justify-center bg-gray-100">
      <div class="system-name absolute top-4 left-4 flex items-center">
        <img src="@/assets/imgs/logo.png" alt="Logo" class="w-12 h-full" />
        <span class="text-xl font-semibold ml-2">产品设计系统</span>
      </div>
      <img src="@/assets/imgs/login.svg" alt="Welcome" class="w-1/2 mb-6" />
      <h1 class="text-3xl font-bold mb-2">欢迎来到产品设计系统</h1>
      <p class="text-gray-600">请登录以继续使用</p>
    </div>

    <!-- Login Section -->
    <div class="login-section w-full sm:w-1/2 flex items-center justify-center bg-white">
      <Transition name="fade" appear>
        <login />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'personal' });
</script>

<style scoped>
.login-container {
  margin: 0;
  padding: 0;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
