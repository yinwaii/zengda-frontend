<template>
  <shadcn-dropdown-menu>
    <shadcn-dropdown-menu-trigger as-child>
      <shadcn-button variant="ghost" size="icon" class="h-8 w-8 p-0">
        <LucideMoreHorizontal class="h-4 w-4" />
        <span class="sr-only">操作</span>
      </shadcn-button>
    </shadcn-dropdown-menu-trigger>
    <shadcn-dropdown-menu-content align="end">
      <shadcn-dropdown-menu-item @click="$emit('view')">
        <LucideEye class="mr-2 h-4 w-4" />
        <span>查看</span>
      </shadcn-dropdown-menu-item>
      <shadcn-dropdown-menu-item @click="$emit('edit')">
        <LucidePencil class="mr-2 h-4 w-4" />
        <span>编辑</span>
      </shadcn-dropdown-menu-item>
      <shadcn-dropdown-menu-separator />
      <shadcn-dropdown-menu-item @click="$emit('query')">
        <LucideSearch class="mr-2 h-4 w-4" />
        <span>查询物料详情</span>
      </shadcn-dropdown-menu-item>
      <shadcn-dropdown-menu-separator />
      <shadcn-dropdown-menu-item class="text-destructive focus:text-destructive" @click="$emit('delete')">
        <LucideTrash class="mr-2 h-4 w-4" />
        <span>删除</span>
      </shadcn-dropdown-menu-item>
    </shadcn-dropdown-menu-content>
  </shadcn-dropdown-menu>
</template>

<script setup lang="ts">
import { 
  LucideMoreHorizontal, 
  LucideEye, 
  LucidePencil, 
  LucideTrash,
  LucideSearch
} from 'lucide-vue-next'

defineEmits<{
  view: []
  edit: []
  delete: []
  query: []
}>()
</script> 