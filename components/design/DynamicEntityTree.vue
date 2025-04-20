<template>
  <div class="flex h-full">
    <!-- 左侧树 -->
    <div class="w-[320px] min-w-[320px] h-full border-r pr-2 overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ treeTitle }}</h2>
        <!-- 模板下拉菜单 -->
        <TemplateDropdownMenu
          v-if="currentItem && currentItem.type === 'TEMPLATE'"
          :template="(currentItem.originalData as ZdTemplate)"
          @clone="handleClone"
          @addPsystem="handleAddPsystem"
          @addComponent="handleAddComponent"
          @addConfiguration="handleAddConfiguration"
        />
        <!-- 项目下拉菜单 -->
        <ProjectDropdownMenu
          v-else-if="currentItem && currentItem.type === 'PROJECT'"
          :project="(currentItem.originalData as ZdProject)"
          @clone="handleClone"
        />
        <!-- 产品系统下拉菜单 -->
        <PsystemDropdownMenu
          v-else-if="currentItem && currentItem.type === 'PSYSTEM'"
          :psystem="(currentItem.originalData as ZdPSystem)"
          @clone="handleClone"
          @addComponent="handleAddComponent"
        />
        <!-- 组件下拉菜单 -->
        <ComponentDropdownMenu
          v-else-if="currentItem && currentItem.type === 'COMPONENT'"
          :component="(currentItem.originalData as ZdComponent)"
          @clone="handleClone"
        />
        <!-- BOM下拉菜单 -->
        <BomDropdownMenu
          v-else-if="currentItem && currentItem.type === 'BOM'"
          :bom="(currentItem.originalData as ZdBom)"
          @clone="handleClone"
        />
        <!-- 规格下拉菜单 -->
        <SpecificationDropdownMenu
          v-else-if="currentItem && currentItem.type === 'SPECIFICATION'"
          :specification="(currentItem.originalData as ZdSpecification)"
          @clone="handleClone"
        />
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
        class="tree-container"
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
          @save="(data: any) => currentItem && emit('save', data, currentItem.type || 'default')"
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
    <component
      v-if="showMenuDialog"
      :is="getMenuDialogComponent(menuDialogType)"
      v-model="showMenuDialog"
      v-bind="menuDialogProps"
      @submit="handleMenuDialogSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, toRaw, watch } from 'vue'
import { LucideFile, LucideFolder, LucideBox, LucideSettings, LucideCode, LucidePlus, LucideTag, LucideSettings2, LucideLayoutTemplate, LucidePackage, LucideComponent, LucideFileSpreadsheet, LucideBoxes } from 'lucide-vue-next'
import AbstractTree from '~/components/abstract/tree/Tree.vue'
import TreeNode from '~/components/abstract/tree/TreeNode.vue'
import { NODE_TYPES } from '~/models/entity/node-types'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdTemplate } from '~/models/entity/template'

// 导入各模块的组件
import BomDetail from '~/components/design/bom/detail.vue'
import BomDialog from '~/components/design/bom/dialog.vue'
import ComponentDetail from '~/components/design/component/detail.vue'
import ComponentDialog from '~/components/design/component/dialog.vue'
import ProjectDetail from '~/components/design/project/detail.vue'
import ProjectDialog from '~/components/design/project/dialog.vue'
import TemplateDetail from '~/components/design/template/detail.vue'
import TemplateDialog from '~/components/design/template/dialog.vue'
import PsystemDetail from '~/components/design/psystem/details.vue'
import PsystemDialog from '~/components/design/psystem/dialog.vue'
import SpecificationDetail from '~/components/design/specification/detail.vue'
import SpecificationDialog from '~/components/design/specification/dialog.vue'
import PtypeDetail from '~/components/design/ptype/detail.vue'
import PtypeDialog from '~/components/design/ptype/dialog.vue'
import ConfigurationDetail from '~/components/design/configuration/detail.vue'
import ConfigurationDialog from '~/components/design/configuration/dialog.vue'
import ProjectDropdownMenu from '~/components/design/project/dropdown-menu.vue'
import TemplateDropdownMenu from '~/components/design/template/dropdown-menu.vue'
import PsystemDropdownMenu from '~/components/design/psystem/dropdown-menu.vue'
import ComponentDropdownMenu from '~/components/design/component/dropdown-menu.vue'
import BomDropdownMenu from '~/components/design/bom/dropdown-menu.vue'
import SpecificationDropdownMenu from '~/components/design/specification/dropdown-menu.vue'
import TemplateAddPsystemDialog from '~/components/design/template/add-psystem-dialog.vue'
import TemplateAddComponentDialog from '~/components/design/template/add-component-dialog.vue'
import PsystemAddComponentDialog from '~/components/design/psystem/add-component-dialog.vue'
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
  // 克隆事件
  (e: 'clone', template: ZdTemplate): void
}>()

// 当前状态管理
const currentItem = ref<TreeNodeData | null>(null)
const currentItemId = ref<string | number | null>(props.initialItemId || null)
const isEditing = ref(false)
const showDialog = ref(false)
const dialogType = ref('')
const dialogProps = ref<Record<string, any>>({})
const expandedKeys = ref<(string | number)[]>(props.defaultExpandedKeys || [])
const showMenuDialog = ref(false)
const menuDialogType = ref('')
const menuDialogProps = ref<Record<string, any>>({})

// 节点类型对应的图标
const iconMap: Record<string, any> = {
  PROJECT: LucideFolder,
  COMPONENT: LucideComponent,
  BOM: LucidePackage,
  PSYSTEM: LucideCode,
  TEMPLATE: LucideLayoutTemplate,
  SPECIFICATION: LucideFileSpreadsheet,
  CONFIGURATION: LucideSettings2,
  PTYPE: LucideBoxes,
  default: LucideFile
}

// 节点类型对应的图标颜色
const iconColorMap: Record<string, string> = {
  PROJECT: 'text-yellow-500',
  COMPONENT: 'text-violet-500',
  BOM: 'text-green-500',
  PSYSTEM: 'text-blue-500',
  TEMPLATE: 'text-orange-500',
  SPECIFICATION: 'text-indigo-500',
  CONFIGURATION: 'text-cyan-500',
  PTYPE: 'text-pink-500',
  default: 'text-gray-500'
}

// 组件映射
const nodeComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: TreeNode,
  [NODE_TYPES.COMPONENT]: TreeNode,
  [NODE_TYPES.PROJECT]: TreeNode,
  [NODE_TYPES.TEMPLATE]: TreeNode,
  [NODE_TYPES.PSYSTEM]: TreeNode,
  [NODE_TYPES.SPECIFICATION]: TreeNode,
  [NODE_TYPES.PTYPE]: TreeNode,
  'default': TreeNode
}

// 详情组件映射
const detailComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: BomDetail,
  [NODE_TYPES.COMPONENT]: ComponentDetail,
  [NODE_TYPES.PROJECT]: ProjectDetail,
  [NODE_TYPES.TEMPLATE]: TemplateDetail,
  [NODE_TYPES.PSYSTEM]: PsystemDetail,
  [NODE_TYPES.SPECIFICATION]: SpecificationDetail,
  [NODE_TYPES.PTYPE]: PtypeDetail,
  [NODE_TYPES.CONFIGURATION]: ConfigurationDetail,
  'default': null
}

// 对话框组件映射
const dialogComponents: Record<string, any> = {
  [NODE_TYPES.BOM]: BomDialog,
  [NODE_TYPES.COMPONENT]: ComponentDialog,
  [NODE_TYPES.PROJECT]: ProjectDialog,
  [NODE_TYPES.TEMPLATE]: TemplateDialog,
  [NODE_TYPES.PSYSTEM]: PsystemDialog,
  [NODE_TYPES.SPECIFICATION]: SpecificationDialog,
  [NODE_TYPES.PTYPE]: PtypeDialog,
  [NODE_TYPES.CONFIGURATION]: ConfigurationDialog
}

const menuDialogComponents: Record<string, any> = {
  'template-add-psystem': TemplateAddPsystemDialog,
  'template-add-component': TemplateAddComponentDialog,
  'psystem-add-component': PsystemAddComponentDialog,
  // 'template-add-configuration': TemplateAddConfigurationDialog
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

const getMenuDialogComponent = (type: string = 'default') => {
  return menuDialogComponents[type] || null
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
    props[propName].id = node.id
    props[propName].type = node.type
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
      return 'template'
    case NODE_TYPES.PSYSTEM:
      return 'system'
    case NODE_TYPES.SPECIFICATION:
      return 'specification'
    case NODE_TYPES.PTYPE:
      return 'ptype'
    case NODE_TYPES.CONFIGURATION:
      return 'configuration'
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


// 处理对话框保存
const handleDialogSave = (data: any) => {
  if (dialogType.value === NODE_TYPES.TEMPLATE) {
    emit('create', data, dialogType.value)
  }
  showDialog.value = false
}

// 处理克隆事件
const handleClone = (item: any) => {
  console.log('DynamicEntityTree 收到克隆事件，item:', item)
  
  // 根据节点类型打开对应的对话框进行克隆
  const nodeType = item.type || 'default'
  console.log('nodeType:', nodeType)
  dialogType.value = nodeType
  dialogProps.value = {
    open: true,
    [getPropNameByType(nodeType)]: item,
    isClone: true
  }
  showDialog.value = true
}

// 处理添加PSYSTEM事件
const handleAddPsystem = (template: ZdTemplate) => {
  console.log('DynamicEntityTree 收到添加PSYSTEM事件，template:', template)
  // 打开PSYSTEM对话框进行添加
  menuDialogType.value = 'template-add-psystem'
  menuDialogProps.value = {
    modelValue: true,
    templateId: toApiId(template.id)
  }
  showMenuDialog.value = true
}

// 处理添加COMPONENT事件
const handleAddComponent = (item: any) => {
  console.log('DynamicEntityTree 收到添加COMPONENT事件，item:', item)
  // 根据节点类型打开对应的对话框进行添加
  if (item.type === 'TEMPLATE') {
    menuDialogType.value = 'template-add-component'
    menuDialogProps.value = {
      modelValue: true,
      templateId: toApiId(item.id)
    }
  } else if (item.type === 'PSYSTEM') {
    menuDialogType.value = 'psystem-add-component'
    menuDialogProps.value = {
      modelValue: true,
      psystemId: toApiId(item.id)
    }
  }
  showMenuDialog.value = true
}

const handleAddConfiguration = (template: ZdTemplate) => {
  console.log('DynamicEntityTree 收到添加CONFIGURATION事件，template:', template)
  // 打开CONFIGURATION对话框进行添加
  menuDialogType.value = 'template-add-configuration'
  menuDialogProps.value = {
    open: true,
    template,
    isClone: false
  }
  showMenuDialog.value = true
}

// 处理菜单对话框提交
const handleMenuDialogSubmit = (data: any) => {
  console.log('DynamicEntityTree 收到菜单对话框提交，data:', data)
  // 根据菜单对话框类型执行不同的操作
  switch (menuDialogType.value) {
    case 'template-add-psystem':
      // 处理添加PSYSTEM事件
      break
  }
  // 关闭菜单对话框
  showMenuDialog.value = false
}
</script>

<style scoped>
.tree-container :deep(.tree-node) {
  padding-left: 0.75rem;
  position: relative;
}

.tree-container :deep(.tree-node::before) {
  content: '';
  position: absolute;
  left: 0.375rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--border-color);
}

.tree-container :deep(.tree-node:last-child::before) {
  height: 50%;
}

.tree-container :deep(.tree-node:first-child::before) {
  top: 50%;
}

.tree-container :deep(.tree-node-content) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0;
}

.tree-container :deep(.tree-node-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}
</style> 
