<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Excel文件处理测试</h1>
    
    <!-- 文件上传区域 -->
    <div class="mb-6">
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :show-file-list="false"
        accept=".xlsx,.xls"
        @change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import { UploadFilled } from '@element-plus/icons-vue'

const handleFileChange = (file: any) => {
  const reader = new FileReader()
  
  reader.onload = (e: any) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      
      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // 将工作表转换为JSON
      const jsonResult = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

			console.log(jsonResult)
      
			ElMessage.success(`成功提取 ${jsonResult.length} 行数据`)
    } catch (error) {
      console.error('处理Excel文件时出错:', error)
      ElMessage.error('处理Excel文件时出错，请检查文件格式')
    }
  }
  
  reader.readAsArrayBuffer(file.raw)
}
</script>

<style scoped>
.upload-demo {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.upload-demo:hover {
  border-color: #409eff;
}
</style>