<template>
  <div class="flex items-center space-x-2">
    <Button variant="outline" size="sm" @click="showExportDialog = true">
      <Download class="w-4 h-4 mr-2" />
      导出
    </Button>
  </div>
  <ExportDialog
    v-model:show="showExportDialog"
    :columns="columns"
    @export="handleExport"
  />
</template>

<script setup lang="ts">
import ExportDialog from './ExportDialog.vue'
import { exportTableData } from '@/utils/export'
import { ref } from 'vue'
import { Download } from 'lucide-vue-next'
import type { ExportOptions } from '@/utils/export'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  data: any[]
  columns: any[]
}>()

const showExportDialog = ref(false)

const handleExport = (options: ExportOptions) => {
  // 确保在客户端环境中执行
  if (process.client) {
    exportTableData(props.data, props.columns, options)
    showExportDialog.value = false
  }
}
</script> 