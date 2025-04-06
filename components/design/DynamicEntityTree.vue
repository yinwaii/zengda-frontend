<template>
  <div class="flex h-full">
    <!-- 左侧树 -->
    <div class="w-[320px] min-w-[320px] h-full border-r pr-2 overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ treeTitle }}</h2>
        <shadcn-button size="sm" variant="outline" @click="handleAddNew">
          <LucidePlus class="h-4 w-4 mr-1" />
          新建
        </shadcn-button>
      </div>
      
      <abstract-tree
        :items="treeData"
        :default-expanded-keys="expandedKeys"
        :node-components="nodeComponents"
        :detail-components="detailComponents"
        :dialog-components="dialogComponents"
        v-model:current-item="currentItem"
        v-model:current-item-id="currentItemId"
        @node-click="handleNodeClick"
        @node-toggle="handleNodeToggle"
      >
        <!-- 图标插槽 -->
        <template #icon="{ node, type }">
          <component :is="getNodeIcon(type)" class="h-4 w-4" :class="getIconColorClass(type)" />
        </template>
      </abstract-tree>
    </div>
    
    <!-- 右侧详情 -->
    <div class="flex-1 pl-4 overflow-auto">
      <template v-if="currentItem">
        <component 
          :is="getDetailComponent(currentItem.type)" 
          :key="currentItemId"
          v-bind="getComponentDataProps(currentItem)"
          :is-editing="isEditing"
          @edit="startEditing"
          @cancel="cancelEditing"
          @submit="handleSubmit"
        />
      </template>
      <template v-else>
        <div class="flex h-full items-center justify-center text-muted-foreground">
          <p>请从左侧选择一个项目查看详情</p>
        </div>
      </template>
    </div>
    
    <!-- 对话框 -->
    <component
      v-if="showDialog"
      :is="getDialogComponent(dialogType)"
      v-model:open="showDialog"
      v-bind="dialogProps"
      @save="handleDialogSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { LucideFile, LucideFolder, LucideBox, LucideSettings, LucideCode, LucideCpu, LucidePlus } from 'lucide-vue-next'
import AbstractTree from '~/components/abstract/tree/Tree.vue'
import TreeNode from '~/components/abstract/tree/TreeNode.vue'
import { NODE_TYPES } from '~/utils/treeNodeFactory'
import type { TreeNodeData } from '~/components/abstract/tree/types'

// 导入各模块的组件
import BomDetail from '~/components/design/bom/detail.vue'
import BomDialog from '~/components/design/bom/dialog.vue'
import ComponentDetail from '~/components/design/component/detail.vue'
import ComponentDialog from '~/components/design/component/dialog.vue'
import ProjectDetail from '~/components/design/project/detail.vue'
import ProjectDialog from '~/components/design/project/dialog.vue'
import TemplateDetail from '~/components/design/projectTemplate/detail.vue'
import TemplateDialog from '~/components/design/projectTemplate/dialog.vue'
import PsystemDetail from '~/components/design/psystem/detail.vue'
import PsystemDialog from '~/components/design/psystem/dialog.vue'
import SpecificationDetail from '~/components/design/specification/detail.vue'
import SpecificationDialog from '~/components/design/specification/dialog.vue'

const props = defineProps<{
  treeData: TreeNodeData[]
  treeTitle?: string
  defaultExpandedKeys?: (string | number)[]
  // 可选的初始选中项ID
  initialItemId?: string | number | null
  // 可选的初始数据加载方法
  loadData?: () => Promise<any[]>
}>()

const emit = defineEmits<{
  // 节点点击事件
  (e: 'node-click', node: TreeNodeData): void
  // 节点切换展开/折叠事件
  (e: 'node-toggle', node: TreeNodeData, expanded: boolean): void
  // 数据保存事件
  (e: 'save', data: any, nodeType: string): void
  // 新数据创建事件
  (e: 'create', data: any, nodeType: string): void
}>()

// 当前状态管理
const currentItem = ref<TreeNodeData | null>(null)
const currentItemId = ref<string | number | null>(props.initialItemId || null)
const isEditing = ref(false)
const showDialog = ref(false)
const dialogType = ref('')
const dialogProps = ref<Record<string, any>>({})
const expandedKeys = ref<(string | number)[]>(props.defaultExpandedKeys || [])

// 图标映射
const iconMap: Record<string, any> = {
  [NODE_TYPES.BOM]: LucideBox,
  [NODE_TYPES.COMPONENT]: LucideCpu,
  [NODE_TYPES.PROJECT]: LucideFolder,
  [NODE_TYPES.TEMPLATE]: LucideFile,
  [NODE_TYPES.PSYSTEM]: LucideSettings,
  [NODE_TYPES.SPECIFICATION]: LucideCode,
  'default': LucideFile
}

// 图标颜色映射
const iconColorMap: Record<string, string> = {
  [NODE_TYPES.BOM]: 'text-blue-500',
  [NODE_TYPES.COMPONENT]: 'text-green-500',
  [NODE_TYPES.PROJECT]: 'text-yellow-500',
  [NODE_TYPES.TEMPLATE]: 'text-purple-500',
  [NODE_TYPES.PSYSTEM]: 'text-red-500',
  [NODE_TYPES.SPECIFICATION]: 'text-indigo-500',
  'default': 'text-gray-500'
}

// 组件映射
const nodeComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: TreeNode,
  [NODE_TYPES.COMPONENT]: TreeNode,
  [NODE_TYPES.PROJECT]: TreeNode,
  [NODE_TYPES.TEMPLATE]: TreeNode,
  [NODE_TYPES.PSYSTEM]: TreeNode,
  [NODE_TYPES.SPECIFICATION]: TreeNode,
  'default': TreeNode
}

// 详情组件映射
const detailComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: BomDetail,
  [NODE_TYPES.COMPONENT]: ComponentDetail,
  [NODE_TYPES.PROJECT]: ProjectDetail,
  [NODE_TYPES.TEMPLATE]: TemplateDetail,
  [NODE_TYPES.PSYSTEM]: PsystemDetail,
  [NODE_TYPES.SPECIFICATION]: SpecificationDetail
}

// 对话框组件映射
const dialogComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: BomDialog,
  [NODE_TYPES.COMPONENT]: ComponentDialog,
  [NODE_TYPES.PROJECT]: ProjectDialog,
  [NODE_TYPES.TEMPLATE]: TemplateDialog,
  [NODE_TYPES.PSYSTEM]: PsystemDialog,
  [NODE_TYPES.SPECIFICATION]: SpecificationDialog
}

// 获取节点图标
const getNodeIcon = (type: string = 'default') => {
  return iconMap[type] || iconMap.default
}

// 获取图标颜色类
const getIconColorClass = (type: string = 'default') => {
  return iconColorMap[type] || iconColorMap.default
}

// 获取详情组件
const getDetailComponent = (type: string = 'default') => {
  return detailComponents[type] || null
}

// 获取对话框组件
const getDialogComponent = (type: string = 'default') => {
  return dialogComponents[type] || null
}

// 获取详情组件的数据props
const getComponentDataProps = (node: TreeNodeData) => {
  if (!node) return {}
  
  const propName = getPropNameByType(node.type)
  
  // 创建节点的深拷贝，避免直接修改原始节点导致反应式更新
  const nodeCopy = JSON.parse(JSON.stringify(node))
  
  // 递归遍历节点树，检查是否有component类型的节点，如果有则标记需要加载其BOM信息
  const traverseAndEnrichNodes = (treeNode: any) => {
    // 如果是组件节点且有bomId，但没有关联的BOM数据，则标记需要加载
    if (treeNode.type === NODE_TYPES.COMPONENT && 
        treeNode.originalData && 
        treeNode.originalData.bomId && 
        !treeNode.bomData) {
      // 只记录日志，不修改节点数据
      console.log('发现组件节点需要加载BOM数据:', treeNode.originalData.id, treeNode.originalData.bomId)
    }
    
    // 递归处理子节点
    if (treeNode.children && treeNode.children.length > 0) {
      for (let i = 0; i < treeNode.children.length; i++) {
        traverseAndEnrichNodes(treeNode.children[i])
      }
    }
  }
  
  // 仅在非BOM节点上执行遍历，避免不必要的处理
  if (node.type !== NODE_TYPES.BOM) {
    traverseAndEnrichNodes(nodeCopy)
  }
  
  // 构建基础属性对象
  const props: Record<string, any> = {}
  
  // 根据节点类型添加特定属性
  if (node.type === NODE_TYPES.BOM) {
    // BOM类型只传递bom和parameters属性
    props.bom = node.originalData || node
    props.parameters = node.parameters || []
  } else {
    // 其他类型
    props[propName] = node.originalData || node
    props.parameters = node.parameters || []
    props.data = node
  }
  
  return props
}

// 根据类型获取对应的prop名称
const getPropNameByType = (type?: string) => {
  switch (type) {
    case NODE_TYPES.BOM:
      return 'bom'
    case NODE_TYPES.COMPONENT:
      return 'component'
    case NODE_TYPES.PROJECT:
      return 'project'
    case NODE_TYPES.TEMPLATE:
      return 'projectTemplate'
    case NODE_TYPES.PSYSTEM:
      return 'system'
    case NODE_TYPES.SPECIFICATION:
      return 'specification'
    default:
      return 'item'
  }
}

// 处理节点点击
const handleNodeClick = (node: TreeNodeData) => {
  emit('node-click', node)
  isEditing.value = false // 点击新节点时退出编辑模式
}

// 处理节点展开/折叠
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
  emit('node-toggle', node, expanded)
}

// 处理编辑
const startEditing = () => {
  isEditing.value = true
}

// 处理取消编辑
const cancelEditing = () => {
  isEditing.value = false
}

// 处理提交
const handleSubmit = (formData: any) => {
  if (!currentItem.value) return
  emit('save', formData, currentItem.value.type || 'default')
  isEditing.value = false // 提交后退出编辑模式
}

// 处理添加新项
const handleAddNew = () => {
  // 默认使用当前选中项的类型，如果没有选中项，则使用第一个节点的类型
  const type = currentItem.value?.type || 
               (props.treeData[0]?.type || NODE_TYPES.PROJECT)
  
  dialogType.value = type
  dialogProps.value = {}
  showDialog.value = true
}

// 处理对话框保存
const handleDialogSave = (data: any) => {
  emit('create', data, dialogType.value)
  showDialog.value = false
}
</script> 