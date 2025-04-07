<template>
  <div>
    <div 
      class="flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer"
      :class="{ 'bg-muted/50': isActive }"
      @click="emit('click', node)"
    >
      <div class="flex items-center gap-1 flex-grow min-w-0 truncate">
        <button
          v-if="(node.children || []).length > 0"
          @click.stop="handleToggle"
          class="w-5 h-5 flex items-center justify-center"
        >
          <LucideChevronRight v-if="!node.expanded" class="h-4 w-4 transition-transform" />
          <LucideChevronDown v-else class="h-4 w-4 transition-transform" />
        </button>
        <span v-else class="w-5"></span>
        
        <LucideSettings2 class="w-4 h-4 text-cyan-500 flex-shrink-0" />
        
        <span class="truncate text-sm font-medium">
          {{ node.name || `配置 #${node.id}` }}
        </span>
      </div>
      
      <div class="flex items-center gap-1 ml-auto">
        <button 
          class="h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted" 
          @click.stop="emit('edit', node)"
          title="编辑"
        >
          <LucidePencil class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    
    <div v-if="node.expanded" class="pl-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucideChevronRight, LucideChevronDown, LucidePencil, LucideSettings2, LucideTrash } from 'lucide-vue-next'
import type { TreeNode } from '~/models/tree-node'

const props = defineProps<{
  node: TreeNode
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'click', node: TreeNode): void
  (e: 'edit', node: TreeNode): void
  (e: 'toggle', node: TreeNode): void
}>()

const handleToggle = () => {
  emit('toggle', props.node)
}
</script> 