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
  <el-divider />


  <h2>模块信息</h2>
  <!-- TODO: 模块信息可能还要封装一个组件 -->
  <el-space :fill="false" direction="horizontal" wrap >
    <el-card style="min-width: 300px; height: auto;" shadow="hover" v-for="idx in 10" :key="idx">
      <template #header>
        <div class="card-header">
          模块名称{{ idx }}
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer>Footer content</template>
    </el-card>
    
  </el-space>

  <el-divider />

  <el-descriptions title="联系人">
    <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
    <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>
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

<style></style>