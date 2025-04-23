<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        <Settings class="mr-2 h-4 w-4" />
        操作
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleClone">
        <Copy class="mr-2 h-4 w-4" />
        克隆
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleAddComponent">
        <Package class="mr-2 h-4 w-4" />
        添加组件
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleAddSubPSystem">
        <Package class="mr-2 h-4 w-4" />
        添加子系统
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleUploadSpec">
        <FileUp class="mr-2 h-4 w-4" />
        上传规格书
      </DropdownMenuItem>
      <!-- <DropdownMenuItem @click="$emit('edit')">
        <LucidePencil class="mr-2 h-4 w-4" />
        编辑
      </DropdownMenuItem> -->
      <DropdownMenuItem @click="$emit('delete', props.psystem)" class="text-destructive">
        <LucideTrash class="mr-2 h-4 w-4" />
        删除
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Copy, Package, LucideTrash, Settings, FileUp } from 'lucide-vue-next'
import type { ZdPSystem } from '~/models/entity/psystem'

const props = defineProps<{
  psystem: ZdPSystem
}>()

const emit = defineEmits<{
  (e: 'clone', psystem: ZdPSystem): void
  (e: 'addComponent', psystem: ZdPSystem): void
  (e: 'addSubPSystem', psystem: ZdPSystem): void
  (e: 'delete', psystem: ZdPSystem): void
  (e: 'uploadSpec', psystem: ZdPSystem): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，psystem:', props.psystem)
  emit('clone', props.psystem)
}

const handleAddComponent = () => {
  emit('addComponent', props.psystem)
}

const handleAddSubPSystem = () => {
  emit('addSubPSystem', props.psystem)
}

const handleUploadSpec = () => {
  // 创建一个隐藏的文件输入框
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.doc,.docx'
  
  fileInput.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      emit('uploadSpec', props.psystem)
    }
  }
  
  fileInput.click()
}
</script> 