<template>
  <shadcn-dropdown-menu>
    <shadcn-dropdown-menu-trigger asChild>
      <shadcn-button variant="ghost" size="icon">
        <LucideMoreVertical class="h-4 w-4" />
      </shadcn-button>
    </shadcn-dropdown-menu-trigger>
    <shadcn-dropdown-menu-content>
      <shadcn-dropdown-menu-item @click="$emit('edit', configuration)">
        <div class="flex items-center">
          <LucidePencil class="mr-2 h-4 w-4" />
          编辑
        </div>
      </shadcn-dropdown-menu-item>
      <slot></slot>
      <shadcn-dropdown-menu-separator />
      <shadcn-dropdown-menu-item @click="$emit('delete', configuration)" class="text-red-500 focus:text-red-500">
        <div class="flex items-center">
          <LucideTrash class="mr-2 h-4 w-4" />
          删除
        </div>
      </shadcn-dropdown-menu-item>
    </shadcn-dropdown-menu-content>
  </shadcn-dropdown-menu>
</template>

<script setup lang="ts">
import { LucideMoreVertical, LucidePencil, LucideTrash } from 'lucide-vue-next'

const props = defineProps<{
  configuration: any
}>()

const emit = defineEmits<{
  (e: 'edit', configuration: any): void
  (e: 'delete', configuration: any): void
}>()
</script> 