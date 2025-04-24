<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        <Settings class="mr-2 h-4 w-4" />
        操作
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <!-- <DropdownMenuItem @click="handleClone">
        <Copy class="mr-2 h-4 w-4" />
        克隆
      </DropdownMenuItem> -->
      <DropdownMenuItem @click="handleAddPsystem">
        <Layers class="mr-2 h-4 w-4" />
        添加模块
      </DropdownMenuItem>
      <!-- <DropdownMenuItem @click="handleAddComponent">
        <Package class="mr-2 h-4 w-4" />
        添加组件
      </DropdownMenuItem> -->
      <DropdownMenuItem @click="handleUploadSpec">
        <FileUp class="mr-2 h-4 w-4" />
        上传规格书
      </DropdownMenuItem>
      <!-- <DropdownMenuItem @click="$emit('edit')" class="text-destructive">
        <LucidePencil class="mr-2 h-4 w-4" />
        编辑
      </DropdownMenuItem> -->
      <!-- <DropdownMenuItem @click="$emit('delete', props.template)" class="text-destructive">
        <LucideTrash class="mr-2 h-4 w-4" />
        删除
      </DropdownMenuItem> -->
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
import { Copy, Layers, Package, LucideTrash, Settings, FileUp } from 'lucide-vue-next'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
  template: ZdTemplate
}>()

const emit = defineEmits<{
  (e: 'clone', template: ZdTemplate): void
  (e: 'addPsystem', template: ZdTemplate): void
  (e: 'addComponent', template: ZdTemplate): void
  (e: 'delete', template: ZdTemplate): void
  (e: 'uploadSpec', template: ZdTemplate): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，template:', props.template)
  emit('clone', props.template)
}

const handleAddPsystem = () => {
  emit('addPsystem', props.template)
}

const handleAddComponent = () => {
  emit('addComponent', props.template)
}

const entityApis = useEntityApis()

const refresh = inject('refresh') as () => Promise<void>

const handleUploadSpec = async () => {
  // 创建一个隐藏的文件输入框
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.doc,.docx'
  
  fileInput.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      await entityApis.specification.modify_template(toApiId(props.template.id), file)
    }
    await refresh()
  }
  
  fileInput.click()
}
</script> 