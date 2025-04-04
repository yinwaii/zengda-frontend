<template>
  <div class="project-tree">
    <abstract-tree
      :items="[project]"
      :has-children="nodeHasChildren"
      :get-node-key="getNodeKey"
      :get-node-label="getNodeLabel"
      @node-click="handleNodeClick"
    >
      <!-- 自定义项目节点图标 -->
      <template #icon="{ node }">
        <LucideFolder v-if="isProject(node)" class="h-4 w-4 text-amber-500" />
        <LucideBookTemplate v-else-if="isTemplate(node)" class="h-4 w-4 text-blue-500" />
        <LucideFileText v-else-if="isSpecification(node)" class="h-4 w-4 text-green-500" />
        <LucideFolder v-else class="h-4 w-4 text-gray-500" />
      </template>
      <slot></slot>
    </abstract-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  LucideFolder, 
  LucideBookTemplate, 
  LucideFileText 
} from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { TreeNodeData } from '~/components/abstract/tree/types'

const props = defineProps<{
  project: ZdProject
  selectedProjectId?: number
}>()

const emit = defineEmits<{
  select: [project: ZdProject]
  'template-select': [template: ZdTemplate]
}>()

// 状态控制
const isExpanded = ref(false)
const template = ref<ZdTemplate | null>(null)

// 类型检查
const isProject = (node: any): node is ZdProject => {
  return node && node.id === props.project.id
}

const isTemplate = (node: any): node is ZdTemplate => {
  return node && template.value && node.id === template.value?.id
}

const isSpecification = (node: any): boolean => {
  return false
}

// 节点属性获取函数
const nodeHasChildren = (node: TreeNodeData): boolean => {
  if (isProject(node)) {
    return !!props.project.templateId
  }
  return false
}

const getNodeKey = (node: TreeNodeData) => {
  if (isProject(node)) return `project-${node.id}`
  if (isTemplate(node)) return `template-${node.id}`
  return String(node.id)
}

const getNodeLabel = (node: TreeNodeData) => {
  return node.name || String(node.id)
}

// 事件处理函数
const handleNodeClick = (node: TreeNodeData) => {
  if (isProject(node)) {
    emit('select', node)
  }
}

// 导出状态和方法供子组件使用
defineExpose({
  isExpanded,
  template,
  isProject,
  isTemplate,
  isSpecification
})
</script> 