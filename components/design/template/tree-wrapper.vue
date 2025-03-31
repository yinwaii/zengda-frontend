<template>
  <div>
    <AbstractTree
      :items="treeItems"
      @update:selected="handleSelectionChange"
      @update:open="handleExpanded"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPSystem } from '~/models/entity/psystem'
import { ref, computed } from 'vue'
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

// 当前选中的项目
const selectedItems = ref<ZdPSystemWithComponents[]>([])

// 定义事件
const emit = defineEmits<{
  (e: 'update:selected', systems: ZdPSystemWithComponents[]): void
  (e: 'update:open', system: ZdPSystemWithComponents): void
}>()

// 处理选择变更
function handleSelectionChange(items: TreeNodeData[]) {
  selectedItems.value = items.map(item => getOriginalSystem(item))
  emit('update:selected', selectedItems.value)
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