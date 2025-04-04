<template>
  <div class="tree-node space-y-1">
    <div class="flex items-center gap-1">
      <!-- 展开/折叠按钮 -->
      <slot name="toggle-icon" v-bind="toggleProps">
        <button 
          v-if="hasChildren && typeof hasChildren === 'function' ? hasChildren(node) : node.children?.length" 
          class="p-1 hover:bg-accent rounded-sm"
          @click="handleToggle"
        >
          <slot name="toggle-button" v-bind="toggleProps">
            <LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expanded }]" />
          </slot>
        </button>
        <div v-else class="w-6"></div>
      </slot>

      <!-- 节点内容 -->
      <div 
        class="flex-1 flex items-center gap-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
        :class="{ 'bg-accent': selected }"
        @click="handleClick"
      >
        <!-- 节点图标插槽 -->
        <slot name="icon" :node="node">
          <LucideFolder class="h-4 w-4 text-blue-400" />
        </slot>

        <!-- 节点标签插槽 -->
        <slot name="label" :node="node" :label="getNodeLabel && typeof getNodeLabel === 'function' ? getNodeLabel(node) : node.label || ''">
          <span class="flex-1 truncate">{{ getNodeLabel && typeof getNodeLabel === 'function' ? getNodeLabel(node) : node.label || '' }}</span>
        </slot>

        <!-- 节点操作插槽 -->
        <slot name="actions" :node="node"></slot>
      </div>
    </div>

    <!-- 子节点渲染 -->
    <div v-if="expanded" class="ml-6 space-y-1">
      <slot name="children" :node="node"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { LucideChevronRight, LucideFolder } from 'lucide-vue-next'
import type { TreeNodeData } from './types'

defineOptions({
  name: 'TreeNode'
})

const props = defineProps<{
  node: TreeNodeData
  expanded?: boolean
  selected?: boolean
  hasChildren?: (node: TreeNodeData) => boolean
  getNodeKey?: (node: TreeNodeData) => string | number
  getNodeLabel?: (node: TreeNodeData) => string
}>()

// 定义插槽，使它们有正确的类型
interface ToggleProps {
  expanded: boolean
  node: TreeNodeData
  toggle: (e: MouseEvent) => void
}

defineSlots<{
  icon(props: { node: TreeNodeData }): any
  label(props: { node: TreeNodeData; label: string }): any
  actions(props: { node: TreeNodeData }): any
  children(props: { node: TreeNodeData }): any
  'toggle-icon'(props: ToggleProps): any
  'toggle-button'(props: ToggleProps): any
}>()

const emit = defineEmits<{
  'click': [node: TreeNodeData]
  'toggle': [node: TreeNodeData, expanded: boolean]
  'update:expanded': [expanded: boolean]
}>()

// 内部展开状态
const internalExpanded = ref(props.expanded || false)

// 监听外部的展开状态变化
watch(() => props.expanded, (newVal) => {
  if (newVal !== undefined) {
    internalExpanded.value = newVal
  }
})

// 计算得到的展开状态
const expanded = computed({
  get: () => internalExpanded.value,
  set: (value) => {
    internalExpanded.value = value
    emit('update:expanded', value)
  }
})

// 节点点击处理
const handleClick = () => {
  emit('click', props.node)
}

// 切换展开/折叠状态
const handleToggle = (e: MouseEvent) => {
  e.stopPropagation() // 阻止冒泡，避免触发节点点击
  expanded.value = !expanded.value
  emit('toggle', props.node, expanded.value)
}

// 传递给插槽的切换按钮属性
const toggleProps = computed(() => ({
  expanded: expanded.value,
  node: props.node,
  toggle: handleToggle
}))
</script>

<style scoped>
.tree-node {
  position: relative;
}
</style> 