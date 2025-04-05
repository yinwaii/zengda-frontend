<template>
  <TreeNode
    :node="node"
    :expanded="expanded"
    :selected="selected"
    :hasChildren="hasChildren"
    :getNodeKey="getNodeKey"
    :getNodeLabel="getNodeLabel"
    @click="handleClick"
    @toggle="handleToggle"
    @update:expanded="$emit('update:expanded', $event)"
  >
    <template #icon="{ node }">
      <LucideFolder v-if="node.children?.length" class="h-4 w-4 text-blue-500" />
      <LucideFileText v-else-if="node.type === 'file'" class="h-4 w-4 text-blue-400" />
      <LucideBriefcase v-else class="h-4 w-4 text-blue-600" />
    </template>
    
    <template #actions="{ node }">
      <div class="flex items-center gap-1">
        <button 
          class="p-1 hover:bg-accent rounded-sm opacity-70 hover:opacity-100"
          @click.stop="handleEdit(node)"
        >
          <LucidePencil class="h-3.5 w-3.5" />
        </button>
        <button
          v-if="node.type !== 'folder'"
          class="p-1 hover:bg-accent rounded-sm opacity-70 hover:opacity-100"
          @click.stop="handleOpen(node)"
        >
          <LucideExternalLink class="h-3.5 w-3.5" />
        </button>
      </div>
    </template>
  </TreeNode>
</template>

<script setup lang="ts">
import { LucideFolder, LucideFileText, LucideBriefcase, LucidePencil, LucideExternalLink } from 'lucide-vue-next'
import TreeNode from '~/components/abstract/tree/TreeNode.vue'
import type { TreeNodeData } from '~/components/abstract/tree/types'

defineOptions({
  name: 'ProjectTreeNode'
})

const props = defineProps<{
  node: TreeNodeData
  expanded?: boolean
  selected?: boolean
  hasChildren?: (node: TreeNodeData) => boolean
  getNodeKey?: (node: TreeNodeData) => string | number
  getNodeLabel?: (node: TreeNodeData) => string
}>()

const emit = defineEmits<{
  'click': [node: TreeNodeData]
  'toggle': [node: TreeNodeData, expanded: boolean]
  'update:expanded': [expanded: boolean]
  'edit': [node: TreeNodeData]
  'open': [node: TreeNodeData]
}>()

const handleClick = (node: TreeNodeData) => {
  emit('click', node)
}

const handleToggle = (node: TreeNodeData, expanded: boolean) => {
  emit('toggle', node, expanded)
}

const handleEdit = (node: TreeNodeData) => {
  emit('edit', node)
}

const handleOpen = (node: TreeNodeData) => {
  emit('open', node)
}
</script> 