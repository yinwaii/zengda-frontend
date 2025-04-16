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
      <DropdownMenuItem @click="handleAddSubPsystem">
        <Layers class="mr-2 h-4 w-4" />
        添加子产品系统
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

const handleClone = async () => {
  // TODO: 实现克隆逻辑
}

const handleAddSubPsystem = async () => {
  // TODO: 实现添加子产品系统逻辑
}

const handleAddComponent = async () => {
  // TODO: 实现添加组件逻辑
}
</script> 