<template>
  <div>
    <h2>创建项目</h2>
    <el-divider />
    <el-form>
      <el-form-item label="项目名称">
        <el-input v-model="projectName" />
      </el-form-item>

      <el-form-item label="项目编号">
        <el-input v-model="projectId" />
      </el-form-item>

      <el-form-item label="产品类型">
        <el-select  v-model="productType" placeholder="Select" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="description"
          maxlength="100"
          show-word-limit
          style="width: 240px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="createProject">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

let projectName = ref('')
let projectId = ref('')
let productType = ref('')
let description = ref('')

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
]


const createProject = () => {
  // TODO: 创建项目
  console.log(projectName.value, productType.value, description.value)
}
</script>

<style>
.el-form-item {
  margin-bottom: 10px;
  width: 500px;
}
</style>
