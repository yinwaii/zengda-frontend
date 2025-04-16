<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm">
        <Plus class="mr-2 h-4 w-4" />
        新建
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleCreateTemplate">
        <FileText class="mr-2 h-4 w-4" />
        生成模板
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
import { Plus, FileText } from 'lucide-vue-next'
// import { useProjectStore } from '@/stores/project'

// const projectStore = useProjectStore()

const handleCreateTemplate = async () => {
  // TODO: 实现生成模板的逻辑
}
</script> 