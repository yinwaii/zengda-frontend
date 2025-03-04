<template>
  <div id="el">
    <nuxt-route-announcer/>
    <nuxt-layout :name="layout">
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
const layout = 'default'
</script>