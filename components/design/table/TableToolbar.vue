<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { RotateCcw, Download, RefreshCw, Trash2, Plus } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

const props = defineProps<{
  onReset: () => void
  onRefresh?: () => void
  onExport?: () => void
  onBatchDelete?: () => void
  onCreate?: () => void
  selectedRows?: any[]
}>()

// 导出数据
const handleExport = () => {
  if (props.onExport) {
    props.onExport()
  } else {
    toast({
      title: '导出功能',
      description: '导出功能正在开发中...',
      variant: 'default'
    })
  }
}

// 刷新数据
const handleRefresh = () => {
  if (props.onRefresh) {
    props.onRefresh()
  } else {
    toast({
      title: '刷新功能',
      description: '刷新功能正在开发中...',
      variant: 'default'
    })
  }
}

// 批量删除
const handleBatchDelete = () => {
  if (!props.selectedRows?.length) {
    toast({
      title: '批量删除',
      description: '请先选择要删除的项目',
      variant: 'destructive'
    })
    return
  }

  if (props.onBatchDelete) {
    props.onBatchDelete()
  } else {
    toast({
      title: '批量删除',
      description: '批量删除功能正在开发中...',
      variant: 'default'
    })
  }
}

// 新建
const handleCreate = () => {
  if (props.onCreate) {
    props.onCreate()
  } else {
    toast({
      title: '新建功能',
      description: '新建功能正在开发中...',
      variant: 'default'
    })
  }
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" @click="onReset">
        <RotateCcw class="h-4 w-4 mr-2" />
        重置表格设置
      </Button>
      <Button variant="outline" size="sm" @click="handleRefresh">
        <RefreshCw class="h-4 w-4 mr-2" />
        刷新数据
      </Button>
      <Button variant="outline" size="sm" @click="handleExport">
        <Download class="h-4 w-4 mr-2" />
        导出数据
      </Button>
      <Button variant="default" size="sm" @click="handleCreate">
        <Plus class="h-4 w-4 mr-2" />
        新建
      </Button>
    </div>
    <div class="flex items-center gap-2">
      <Button 
        variant="destructive" 
        size="sm" 
        :disabled="!selectedRows?.length"
        @click="handleBatchDelete"
      >
        <Trash2 class="h-4 w-4 mr-2" />
        批量删除
      </Button>
    </div>
  </div>
</template> 