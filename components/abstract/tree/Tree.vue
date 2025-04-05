<template>
  <div class="space-y-1">
    <template v-for="(item, index) in formattedItems" :key="getNodeKey ? getNodeKey(item) : item.id">
      <component :is="getNodeComponent(item)" :node="item" :expanded="isExpanded(item)" :selected="isSelected(item)"
        :has-children="hasChildren" :get-node-key="getNodeKey" :get-node-label="getNodeLabel" @click="handleNodeClick"
        @toggle="toggleNode" @update:expanded="(value: boolean) => updateExpanded(item, value)">
        <!-- 图标插槽 -->
        <template #icon="{ node: iconNode }">
          <slot name="icon" :node="iconNode" :type="item.type" />
        </template>

        <!-- 标签插槽 -->
        <template #label="{ node: labelNode, label }">
          <slot name="label" :node="labelNode" :label="label" :type="item.type" />
        </template>

        <!-- 操作插槽 -->
        <template #actions="{ node: actionsNode }">
          <slot name="actions" :node="actionsNode" :type="item.type" />
        </template>

        <!-- 子节点渲染 -->
        <template #children="{ node: parentNode }">
          <slot name="children" :node="parentNode" :parent="item" :type="item.type">
            <!-- 如果有子节点，递归渲染 -->
            <div v-if="parentNode.children && parentNode.children.length" class="space-y-1">
              <abstract-tree :items="parentNode.children" :default-expanded-keys="defaultExpandedKeys"
                :get-node-key="getNodeKey" :get-node-label="getNodeLabel" :has-children="hasChildren"
                :current-item-id="currentItemId" :node-components="nodeComponents" :detail-components="detailComponents"
                :dialog-components="dialogComponents" @node-click="$emit('node-click', $event)"
                @node-toggle="(node, expanded) => $emit('node-toggle', node, expanded)"
                @node-expand="$emit('node-expand', $event)" @node-collapse="$emit('node-collapse', $event)"
                @component-click="$emit('component-click', $event[0], $event[1])"
                @update:current-item="$emit('update:currentItem', $event)"
                @update:current-item-id="$emit('update:currentItemId', $event)">
                <!-- 图标插槽传递 -->
                <template #icon="slotProps">
                  <slot name="icon" v-bind="slotProps" />
                </template>

                <!-- 标签插槽传递 -->
                <template #label="slotProps">
                  <slot name="label" v-bind="slotProps" />
                </template>

                <!-- 操作插槽传递 -->
                <template #actions="slotProps">
                  <slot name="actions" v-bind="slotProps" />
                </template>

                <!-- 子节点插槽传递 -->
                <template #children="slotProps">
                  <slot name="children" v-bind="slotProps" />
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
              <slot name="component-nodes" :components="parentNode.components" :parent="parentNode" :type="item.type">
                <div v-for="comp in parentNode.components" :key="comp.id || comp.componentId"
                  class="flex items-center gap-1 py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer ml-1 border-l border-l-muted-foreground/30"
                  @click.stop="handleComponentClick(comp, parentNode)">
                  <slot name="component-icon" :component="comp" :parent="parentNode" :type="item.type">
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
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch } from 'vue'
import TreeNode from './TreeNode.vue'
import type { TreeNodeData, TreeProps, TreeEmits } from './types'

// 为插槽添加类型定义
defineSlots<{
  icon(props: { node: TreeNodeData; type?: string }): any
  label(props: { node: TreeNodeData; label?: string; type?: string }): any
  actions(props: { node: TreeNodeData; type?: string }): any
  children(props: { node: TreeNodeData; parent?: TreeNodeData; type?: string }): any
  'component-nodes'(props: { components: any[]; parent: TreeNodeData; type?: string }): any
  'component-icon'(props: { component: any; parent: TreeNodeData; type?: string }): any
}>();

const slots = useSlots()
const props = withDefaults(defineProps<TreeProps>(), {
  items: () => [],
  defaultExpandedKeys: () => [],
  getNodeKey: (node: TreeNodeData) => node.id,
  getNodeLabel: (node: TreeNodeData) => node.label || String(node.id),
  hasChildren: (node: TreeNodeData) => !!(node.children && node.children.length) || !!(node.components && node.components.length),
  nodeComponents: () => ({}),
  detailComponents: () => ({}),
  dialogComponents: () => ({}),
})

const emit = defineEmits<TreeEmits & {
  (e: 'component-click', component: any, parent: TreeNodeData): void
}>()

// 预处理items，确保所有节点都有type属性
const formattedItems = computed(() => {
  return props.items.map(item => {
    if (!item.type) {
      return { ...item, type: 'default' }
    }
    return item
  })
})

// 扩展的键列表
const expandedKeys = ref<(string | number)[]>(props.defaultExpandedKeys || [])
// 当前选中的节点键值
const selectedKey = ref<string | number | null>(props.currentItemId || null)

// 监听currentItemId变化
watch(() => props.currentItemId, (newId) => {
  if (newId !== undefined && newId !== null) {
    selectedKey.value = newId
  }
}, { immediate: true })

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
  const key = props.getNodeKey ? props.getNodeKey(node) : node.id
  selectedKey.value = key
  emit('node-click', node)
  emit('update:currentItem', node)
  emit('update:currentItemId', key)
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

// 根据节点类型获取对应的组件
const getNodeComponent = (node: TreeNodeData) => {
  if (node.type && props.nodeComponents[node.type]) {
    return props.nodeComponents[node.type]
  }

  // 默认使用TreeNode组件
  return TreeNode
}

// 为了在这个文件中递归使用自身，需要明确定义名称
defineOptions({
  name: 'AbstractTree'
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
