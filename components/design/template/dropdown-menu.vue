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
      <DropdownMenuItem @click="handleAddPsystem">
        <Layers class="mr-2 h-4 w-4" />
        添加产品系统
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleAddComponent">
        <Package class="mr-2 h-4 w-4" />
        添加组件
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
import { Plus, Copy, Layers, Package } from 'lucide-vue-next'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
  template: ZdTemplate
}>()

const emit = defineEmits<{
  (e: 'clone', template: ZdTemplate): void
  (e: 'addPsystem', template: ZdTemplate): void
  (e: 'addComponent', template: ZdTemplate): void
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
</script> 