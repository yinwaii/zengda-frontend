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
      <DropdownMenuItem @click="handleAddComponent">
        <Package class="mr-2 h-4 w-4" />
        添加组件
      </DropdownMenuItem>
      <!-- <DropdownMenuItem @click="handleAddSubPSystem">
        <Package class="mr-2 h-4 w-4" />
        添加子系统
      </DropdownMenuItem> -->
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
import { useToast } from '@/components/ui/toast'

const props = defineProps<{
  psystem: ZdPSystem
}>()

const toast = useToast()
const entityApis = useEntityApis()

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
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.docx'
  
  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      try {
        // 使用FileReader验证文件内容
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            // 确保文件内容被正确读取
            if (reader.result) {
              console.log('文件内容已读取，大小:', (reader.result as ArrayBuffer).byteLength, '字节')
              
              // 创建新的Blob，确保包含完整的文件内容
              const blob = new Blob([reader.result], { type: file.type })
              const formData = new FormData()
              formData.append('file', blob, file.name)

              await entityApis.specification.modify_psystem(toApiId(props.psystem.id), formData)
              toast.toast({
                title: '成功',
                description: '规格书上传成功'
              })
            }
          } catch (error: any) {
            console.error('上传规格书失败:', error)
            toast.toast({
              title: '错误',
              description: '上传规格书失败',
              variant: 'destructive'
            })
          }
        }

        reader.onerror = () => {
          console.error('读取文件失败:', reader.error)
          toast.toast({
            title: '错误',
            description: '读取文件失败',
            variant: 'destructive'
          })
        }

        // 以ArrayBuffer形式读取文件
        reader.readAsArrayBuffer(file)
      } catch (error) {
        console.error('处理文件失败:', error)
        toast.toast({
          title: '错误',
          description: '处理文件失败',
          variant: 'destructive'
        })
      }
    }
  }
  
  input.click()
}
</script> 