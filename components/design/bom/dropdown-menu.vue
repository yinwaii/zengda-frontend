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
      <DropdownMenuItem @click="handleAddSpecification">
        <FileSpreadsheet class="mr-2 h-4 w-4" />
        添加规格
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
import { Plus, Copy, FileSpreadsheet } from 'lucide-vue-next'
import type { ZdBom } from '~/models/entity/bom'

const props = defineProps<{
  bom: ZdBom
}>()

const emit = defineEmits<{
  (e: 'clone', bom: ZdBom): void
  (e: 'addSpecification', bom: ZdBom): void
}>()

const handleClone = () => {
  console.log('克隆按钮被点击，bom:', props.bom)
  emit('clone', props.bom)
}

const handleAddSpecification = () => {
  emit('addSpecification', props.bom)
}
</script> 