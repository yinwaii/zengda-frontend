<template>
  <div>
    <AbstractTree
      :items="treeItems"
      @update:selected="handleSelectionChange"
      @update:open="handleExpanded"
      @node-click="handleNodeClick"
      @component-click="handleComponentClick"
    >
      <!-- 自定义系统节点图标 -->
      <template #icon="{ node }">
        <div class="i-lucide-folder-closed h-4 w-4 text-blue-500"></div>
      </template>
      
      <!-- 自定义标签 -->
      <template #label="{ node, label }">
        <div class="flex items-center gap-1">
          <span class="truncate">{{ label }}</span>
          <span v-if="node.components && node.components.length" 
                class="text-xs bg-blue-100 text-blue-800 px-1 rounded">
            {{ node.components.length }}
          </span>
        </div>
      </template>
      
      <!-- 自定义组件图标 -->
      <template #component-icon="{ component }">
        <div class="i-lucide-puzzle text-green-500 h-4 w-4"></div>
      </template>
    </AbstractTree>
  </div>
</template>

<script setup lang="ts">
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPSystem } from '~/models/entity/psystem'
import { ref, computed, watch } from 'vue'
import { adaptSystemToTreeNode, getOriginalSystem, extendSystem } from './adapter'
import type { ZdPSystemWithComponents, ZdPSystemTreeNode } from './types'

// 支持两种类型的输入
const props = defineProps<{
  items: ZdPSystem[] | ZdPSystemWithComponents[]
}>()

// 转换为树组件可用的数据结构
const treeItems = computed<ZdPSystemTreeNode[]>(() => {
  // 检查items是否已经是ZdPSystemWithComponents类型
  return props.items.map(system => {
    if ('systemId' in system) {
      // 已经是扩展类型，直接适配为树节点
      return adaptSystemToTreeNode(system as ZdPSystemWithComponents)
    } else {
      // 是原始ZdPSystem类型，先扩展再适配
      return adaptSystemToTreeNode(extendSystem(system as ZdPSystem))
    }
  })
})

// 监视树节点数据变化
watch(treeItems, (newItems) => {
  if (newItems.length > 0) {
    // 检查是否有组件
    const hasComponents = newItems.some(item => {
      return item.components && item.components.length > 0 ||
        (item.children && item.children.some(child => 
          child.components && child.components.length > 0));
    });
    
    console.log('树节点数据中是否包含组件:', hasComponents);
    
    // 如果第一个节点有组件，打印出来看看
    if (newItems[0].components && newItems[0].components.length > 0) {
      console.log('第一个节点的组件:', newItems[0].components);
    }
  }
}, { immediate: true });

// 当前选中的项目
const selectedItems = ref<ZdPSystemWithComponents[]>([])

// 定义事件
const emit = defineEmits<{
  (e: 'update:selected', systems: ZdPSystemWithComponents[]): void
  (e: 'update:open', system: ZdPSystemWithComponents): void
  (e: 'select', system: ZdPSystemWithComponents): void
  (e: 'component-select', componentId: number): void
}>()

// 处理选择变更
function handleSelectionChange(items: TreeNodeData[]) {
  selectedItems.value = items.map(item => getOriginalSystem(item))
  emit('update:selected', selectedItems.value)
}

// 处理节点点击
function handleNodeClick(node: TreeNodeData) {
  const system = getOriginalSystem(node)
  emit('select', system)
}

// 处理组件点击
function handleComponentClick(component: any, parent: TreeNodeData) {
  console.log('组件被点击:', component);
  if (component.componentId) {
    emit('component-select', component.componentId)
  }
}

// 处理展开折叠
function handleExpanded(item: TreeNodeData) {
  emit('update:open', getOriginalSystem(item))
}

// 导出方法给父组件使用
defineExpose({
  getOriginalSystem
})
</script> 