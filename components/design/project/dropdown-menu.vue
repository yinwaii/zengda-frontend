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
      <!-- <DropdownMenuItem @click="$emit('delete', props.project)" class="text-destructive">
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
import { Copy, Layers, Settings } from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import { LucideTrash } from 'lucide-vue-next'
// import { useProjectStore } from '@/stores/project'

// const projectStore = useProjectStore()

const props = defineProps<{
  project: ZdProject
}>()

const emit = defineEmits<{
  (e: 'clone', project: ZdProject): void
  (e: 'addPsystem', project: ZdProject): void
  (e: 'delete', project: ZdProject): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，project:', props.project)
  emit('clone', props.project)
}

const handleAddPsystem = () => {
  emit('addPsystem', props.project)
}
</script> 