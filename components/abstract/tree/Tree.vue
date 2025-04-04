<template>
  <div class="space-y-1">
    <template v-for="(item, index) in items" :key="getNodeKey ? getNodeKey(item) : item.id">
      <tree-node
        :node="item"
        :expanded="isExpanded(item)"
        :selected="isSelected(item)"
        :has-children="hasChildren"
        :get-node-key="getNodeKey"
        :get-node-label="getNodeLabel"
        @click="handleNodeClick"
        @toggle="toggleNode"
        @update:expanded="(value) => updateExpanded(item, value)"
      >
        <!-- 图标插槽 -->
        <template #icon="{ node: iconNode }">
          <slot name="icon" :node="iconNode" />
        </template>
        
        <!-- 标签插槽 -->
        <template #label="{ node: labelNode, label }">
          <slot name="label" :node="labelNode" :label="label" />
        </template>
        
        <!-- 操作插槽 -->
        <template #actions="{ node: actionsNode }">
          <slot name="actions" :node="actionsNode" />
        </template>
        
        <!-- 子节点渲染 -->
        <template #children="{ node: parentNode }">
          <slot name="children" :node="parentNode" :parent="item">
            <!-- 如果有子节点，递归渲染 -->
            <div v-if="parentNode.children && parentNode.children.length" class="space-y-1">
              <abstract-tree
                :items="parentNode.children"
                :default-expanded-keys="defaultExpandedKeys"
                :get-node-key="getNodeKey"
                :get-node-label="getNodeLabel"
                :has-children="hasChildren"
                @node-click="$emit('node-click', $event)"
                @node-toggle="$emit('node-toggle', $event[0], $event[1])"
                @node-expand="$emit('node-expand', $event)"
                @node-collapse="$emit('node-collapse', $event)"
                @component-click="$emit('component-click', $event[0], $event[1])"
              >
                <!-- 图标插槽传递 -->
                <template #icon="{ node: subIconNode }">
                  <slot name="icon" :node="subIconNode" />
                </template>
                
                <!-- 标签插槽传递 -->
                <template #label="{ node: subLabelNode, label: subLabel }">
                  <slot name="label" :node="subLabelNode" :label="subLabel" />
                </template>
                
                <!-- 操作插槽传递 -->
                <template #actions="{ node: subActionsNode }">
                  <slot name="actions" :node="subActionsNode" />
                </template>
                
                <!-- 子节点插槽传递 -->
                <template #children="{ node: subNode }">
                  <slot name="children" :node="subNode" />
                </template>
                
                <!-- 组件图标插槽传递 -->
                <template #component-icon="slotProps">
                  <slot name="component-icon" v-bind="slotProps" />
                </template>

                <!-- 组件节点插槽传递 -->
                <template #component-nodes="slotProps">
                  <slot name="component-nodes" v-bind="slotProps" />
                </template>
              </abstract-tree>
            </div>
            
            <!-- 组件节点显示 -->
            <div v-if="parentNode.components && parentNode.components.length > 0" class="space-y-1 mt-1">
              <div class="text-xs text-muted-foreground ml-1 mb-1">组件 ({{ parentNode.components.length }})</div>
              <slot name="component-nodes" :components="parentNode.components" :parent="parentNode">
                <div 
                  v-for="comp in parentNode.components" 
                  :key="comp.id || comp.componentId"
                  class="flex items-center gap-1 py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer ml-1 border-l border-l-muted-foreground/30"
                  @click.stop="handleComponentClick(comp, parentNode)"
                >
                  <slot name="component-icon" :component="comp" :parent="parentNode">
                    <div class="i-lucide-puzzle text-green-500 h-4 w-4"></div>
                  </slot>
                  <span class="truncate flex-1">
                    {{ getComponentLabel(comp) }}
                  </span>
                </div>
              </slot>
            </div>
          </slot>
        </template>
      </tree-node>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import TreeNode from './TreeNode.vue'
import type { TreeNodeData, TreeProps, TreeEmits } from './types'

// 为插槽添加类型定义
defineSlots<{
  icon(props: { node: TreeNodeData }): any
  label(props: { node: TreeNodeData; label?: string }): any
  actions(props: { node: TreeNodeData }): any
  children(props: { node: TreeNodeData; parent?: TreeNodeData }): any
  'component-nodes'(props: { components: any[]; parent: TreeNodeData }): any
  'component-icon'(props: { component: any; parent: TreeNodeData }): any
}>();

const slots = useSlots()
const props = withDefaults(defineProps<TreeProps>(), {
  items: () => [],
  defaultExpandedKeys: () => [],
  getNodeKey: (node: TreeNodeData) => node.id,
  getNodeLabel: (node: TreeNodeData) => node.label || String(node.id),
  hasChildren: (node: TreeNodeData) => !!(node.children && node.children.length) || !!(node.components && node.components.length),
})

const emit = defineEmits<TreeEmits & {
  (e: 'component-click', component: any, parent: TreeNodeData): void
}>()

// 扩展的键列表
const expandedKeys = ref<(string | number)[]>(props.defaultExpandedKeys || [])
// 当前选中的节点键值
const selectedKey = ref<string | number | null>(null)

// 判断节点是否展开
const isExpanded = (node: TreeNodeData) => {
  const key = props.getNodeKey ? props.getNodeKey(node) : node.id
  return expandedKeys.value.includes(key)
}

// 判断节点是否被选中
const isSelected = (node: TreeNodeData) => {
  const key = props.getNodeKey ? props.getNodeKey(node) : node.id
  return selectedKey.value === key
}

// 更新节点展开状态
const updateExpanded = (node: TreeNodeData, expanded: boolean) => {
  const key = props.getNodeKey ? props.getNodeKey(node) : node.id
  const index = expandedKeys.value.indexOf(key)
  
  if (expanded && index === -1) {
    expandedKeys.value.push(key)
  } else if (!expanded && index !== -1) {
    expandedKeys.value.splice(index, 1)
  }
}

// 切换节点展开/折叠状态
const toggleNode = (node: TreeNodeData, expanded: boolean) => {
  updateExpanded(node, expanded)
  emit('node-toggle', node, expanded)
  
  if (expanded) {
    emit('node-expand', node)
  } else {
    emit('node-collapse', node)
  }
}

// 处理节点点击
const handleNodeClick = (node: TreeNodeData) => {
  selectedKey.value = props.getNodeKey ? props.getNodeKey(node) : node.id
  emit('node-click', node)
}

// 处理组件点击
const handleComponentClick = (component: any, parent: TreeNodeData) => {
  emit('component-click', component, parent)
}

// 获取组件标签
const getComponentLabel = (component: any) => {
  if (component.name) return component.name
  if (component.description) return component.description
  if (component.componentId) return `组件${component.componentId}`
  return `组件${component.id || ''}` 
}

// 为了在这个文件中递归使用自身，需要明确定义名称
defineOptions({
  name: 'AbstractTree'
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style> 