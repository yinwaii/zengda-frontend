<template>
  <el-page-header @back="router.back()">
    <template #content>
      <span class="text-large font-600 mr-3"> 项目详情 </span>
    </template>
  </el-page-header>
  
  <h2>项目信息</h2>
  <h3 v-if="project">项目ID: {{ project.id }}</h3>
  <h3 v-if="project">项目名称: {{ project.project_name }}</h3>
  <h3 v-if="project">产品类型: {{ project.product_type }}</h3>
  <h3 v-if="project">描述: {{ project.description }}</h3>

  TODO: 模块显示
  </template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && !isNaN(parseInt(route.params.id))
  }
})

const router = useRouter()
const route = useRoute()
const id = route.params.id

interface Project {
  id: number,
  create_time: string,
  project_name: string,
  product_type: string,
  description: string,
}

const project = ref<Project | null>(null)
await axios.get(`/api/projects/${id}`).then((res) => {
  project.value = res.data['data']
  console.log(project.value)
}).catch((error) => {
  console.log(error)
})
</script>

<style>

</style>