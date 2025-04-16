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
      <DropdownMenuItem @click="handleAddSubSpecification">
        <FileText class="mr-2 h-4 w-4" />
        添加子规范
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleBindPsystem">
        <Link class="mr-2 h-4 w-4" />
        绑定产品系统
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
import { Plus, Copy, FileText, Link } from 'lucide-vue-next'

const handleClone = async () => {
  // TODO: 实现克隆逻辑
}

const handleAddSubSpecification = async () => {
  // TODO: 实现添加子规范逻辑
}

const handleBindPsystem = async () => {
  // TODO: 实现绑定产品系统逻辑
}
</script> 