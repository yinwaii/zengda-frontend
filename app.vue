<template>
  <div id="el">
    <nuxt-route-announcer/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
// const layout = 'shadcn'
import { Toaster } from '~/components/ui/toast'
</script>