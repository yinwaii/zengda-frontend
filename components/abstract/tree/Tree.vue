<template>
  <div class="space-y-1">
    <template v-for="(item, index) in items" :key="getNodeKey ? getNodeKey(item) : item.id">
      <!-- 使用作用域插槽传递节点渲染函数 -->
      <slot 
        name="node" 
        :node="item" 
        :index="index"
        :expanded="isExpanded(item)"
        :on-toggle="(node: TreeNodeData, expanded: boolean) => toggleNode(node, expanded)"
        :on-click="(node: TreeNodeData) => handleNodeClick(node)"
      >
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
          <!-- 将所有插槽转发到TreeNode -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
            <slot :name="slotName" v-bind="slotData" />
          </template>
          
          <!-- 特殊处理子节点渲染 -->
          <template #children="{ node }">
            <slot name="children" :node="node" :parent="item">
              <!-- 默认子节点渲染逻辑 - 递归使用Tree组件 -->
              <tree 
                v-if="node.children?.length"
                :items="node.children"
                :default-expanded-keys="defaultExpandedKeys"
                :get-node-key="getNodeKey"
                :get-node-label="getNodeLabel"
                :has-children="hasChildren"
                @node-click="$emit('node-click', $event)"
                @node-toggle="$emit('node-toggle', $event[0], $event[1])"
                @node-expand="$emit('node-expand', $event)"
                @node-collapse="$emit('node-collapse', $event)"
              >
                <!-- 将所有插槽转发到子树 -->
                <template v-for="(_, childSlotName) in $slots" #[childSlotName]="slotData">
                  <slot :name="childSlotName" v-bind="slotData" />
                </template>
              </tree>
              
              <!-- 自定义子节点数组的插槽 -->
              <template v-if="node && typeof node === 'object'">
                <template v-for="childTypeName in Object.keys(node)" :key="childTypeName">
                  <slot 
                    v-if="childTypeName !== 'children' && Array.isArray(node[childTypeName])" 
                    :name="`${childTypeName}-children`" 
                    :items="node[childTypeName]"
                    :parent="node"
                  ></slot>
                </template>
              </template>
            </slot>
          </template>
        </tree-node>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, defineComponent } from 'vue'
import TreeNode from './TreeNode.vue'
import type { TreeNodeData, TreeProps, TreeEmits } from './types'

// 自递归组件需要显式注册
const Tree = defineComponent({
  name: 'AbstractTree',
  setup: () => {},
})

const slots = useSlots()
const props = withDefaults(defineProps<TreeProps>(), {
  items: () => [],
  defaultExpandedKeys: () => [],
  getNodeKey: (node: TreeNodeData) => node.id,
  getNodeLabel: (node: TreeNodeData) => node.label || String(node.id),
  hasChildren: (node: TreeNodeData) => !!(node.children && node.children.length),
})

const emit = defineEmits<TreeEmits>()

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
</script>

<style scoped>
/* 可以添加自定义样式 */
</style> 