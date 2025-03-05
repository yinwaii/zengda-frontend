<template>
  <Form :projectId="id" />
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import Form from './form.vue'
const route = useRoute()
const router = useRouter()

const id = route.query.id as string

if (id) {
  console.log('editing project', id); 
}else{
  console.log('no id');
  router.push('/project/projects')
}
</script>

<style scoped></style>