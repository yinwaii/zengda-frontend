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
      <LucideFile v-if="!node.children?.length" class="h-4 w-4 text-amber-500" />
      <LucideFiles v-else class="h-4 w-4 text-amber-600" />
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
          class="p-1 hover:bg-accent rounded-sm opacity-70 hover:opacity-100"
          @click.stop="handleDownload(node)"
        >
          <LucideDownload class="h-3.5 w-3.5" />
        </button>
      </div>
    </template>
  </TreeNode>
</template>

<script setup lang="ts">
import { LucideFile, LucideFiles, LucidePencil, LucideDownload } from 'lucide-vue-next'
import TreeNode from '~/components/abstract/tree/TreeNode.vue'
import type { TreeNodeData } from '~/components/abstract/tree/types'

defineOptions({
  name: 'SpecificationTreeNode'
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
  'download': [node: TreeNodeData]
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

const handleDownload = (node: TreeNodeData) => {
  emit('download', node)
}
</script> 