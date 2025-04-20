<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        <Plus class="mr-2 h-4 w-4" />
        新建
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleClone">
        <Copy class="mr-2 h-4 w-4" />
        克隆
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleAddBom">
        <Package class="mr-2 h-4 w-4" />
        添加BOM
      </DropdownMenuItem>
      <!-- <DropdownMenuItem @click="$emit('edit')">
        <LucidePencil class="mr-2 h-4 w-4" />
        编辑
      </DropdownMenuItem> -->
      <DropdownMenuItem @click="$emit('delete', props.component)" class="text-destructive">
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
import { Plus, Copy, Package, LucidePencil, LucideTrash } from 'lucide-vue-next'
import type { ZdComponent } from '~/models/entity/component'

const props = defineProps<{
  component: ZdComponent
}>()

const emit = defineEmits<{
  (e: 'clone', component: ZdComponent): void
  (e: 'addBom', component: ZdComponent): void
  (e: 'delete', component: ZdComponent): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，component:', props.component)
  emit('clone', props.component)
}

const handleAddBom = () => {
  console.log('添加bom，component:', props.component)
  emit('addBom', props.component)
}
</script> 