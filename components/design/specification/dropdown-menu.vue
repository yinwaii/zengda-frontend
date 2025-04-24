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
      <!-- <DropdownMenuItem @click="handleAddPtype">
        <Boxes class="mr-2 h-4 w-4" />
        添加产品类型
      </DropdownMenuItem> -->
      <!-- <DropdownMenuItem @click="$emit('edit')" class="text-destructive">
        <LucidePencil class="mr-2 h-4 w-4" />
        编辑
      </DropdownMenuItem> -->
      <!-- <DropdownMenuItem @click="$emit('delete', props.specification)" class="text-destructive">
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
import { Copy, Boxes, LucideTrash, Settings } from 'lucide-vue-next'
import type { ZdSpecification } from '~/models/entity/specification'

const props = defineProps<{
  specification: ZdSpecification
}>()

const emit = defineEmits<{
  (e: 'clone', specification: ZdSpecification): void
  (e: 'addPtype', specification: ZdSpecification): void
  (e: 'delete', specification: ZdSpecification): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，specification:', props.specification)
  emit('clone', props.specification)
}

const handleAddPtype = () => {
  emit('addPtype', props.specification)
}
</script> 