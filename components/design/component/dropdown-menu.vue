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
      <DropdownMenuItem @click="handleAddSubComponent">
        <PackagePlus class="mr-2 h-4 w-4" />
        添加子组件
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleAddBom">
        <ListPlus class="mr-2 h-4 w-4" />
        添加BOM
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
import { Plus, Copy, PackagePlus, ListPlus } from 'lucide-vue-next'

const handleClone = async () => {
  // TODO: 实现克隆逻辑
}

const handleAddSubComponent = async () => {
  // TODO: 实现添加子组件逻辑
}

const handleAddBom = async () => {
  // TODO: 实现添加BOM逻辑
}
</script> 