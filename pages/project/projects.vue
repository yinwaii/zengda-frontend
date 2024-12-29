<template>
  <!-- <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="Please input"
    @select="handleSelect"
  /> -->
  <el-table :data="tableData" style="width: 100%" :height="800" stripe>
    <el-table-column prop="id" label="ID"  />
    <el-table-column prop="create_time" label="创建时间" width="180" />
    <el-table-column prop="project_name" label="项目名称" width="180" />
    <el-table-column prop="product_type" label="产品类型" width="180" />
    <el-table-column prop="description" label="描述" width="180" show-overflow-tooltip />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="handleDetail(row.id)">
          Detail
        </el-button> 
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Project {
  id: number,
  create_time: string,
  project_name: string,
  product_type: string,
  description: string,
}

let tableData: Project[] = reactive([])

await axios.get('/api/projects').then((res) => {
  tableData = res.data['data']['project_list']
  console.log(tableData)
}).catch((error) => {
  console.log(error)
})

function handleDetail(id: number) {
  router.push(`/project/${id}`)
  console.log(id)
}
</script>

<style lang="scss" scoped>
.el-table {
  height: 100%;
  margin-top: 20px;
} 
</style>
