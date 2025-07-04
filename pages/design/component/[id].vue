<template>
  <div class="p-4 h-full">
    <div v-if="pageLoading" class="flex items-center justify-center h-full">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-accent-foreground/10 h-10 w-10"></div>
        <div class="flex-1 space-y-3 py-1">
          <div class="h-2 bg-accent-foreground/10 rounded"></div>
          <div class="space-y-1">
            <div class="h-2 bg-accent-foreground/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    
    <design-dynamic-entity-tree
      v-else
      :tree-data="componentTreeData" 
      tree-title="组件详情" 
      :default-expanded-keys="expandedKeys"
      @node-click="handleNodeClick"
      @node-toggle="handleNodeToggle"
      @save="handleSave"
      @create="handleCreate"
      class="h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useRouter, useRoute } from 'vue-router'
import { useEntityTree } from '~/composables/use-entity-tree'
import { useEntityHandlers } from '~/composables/use-entity-handlers'
import { NODE_TYPES } from '~/models/entity/node-types'
import type { TreeNodeData } from '~/components/abstract/tree/types'

// 路由和API
const router = useRouter()
const route = useRoute()
const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 组件ID
const componentId = computed(() => Number(route.params.id))

// 页面状态
const pageLoading = ref(true)
const expandedKeys = ref<Array<string | number>>([])
const currentItemId = ref<string | number>('')
const currentItem = ref<any>(null)
const componentTreeData = ref<TreeNodeData[]>([])

/**
 * 保存处理函数
 */
const handleSave = async (data: any, nodeType: string) => {
  console.log('保存数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleSave(data, nodeType, loadSpecificComponent)
}

/**
 * 创建处理函数
 */
const handleCreate = async (data: any, nodeType: string) => {
  console.log('创建数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleCreate(data, nodeType, loadSpecificComponent)
}

/**
 * 处理节点点击
 */
const handleNodeClick = (node: TreeNodeData) => {
  console.log('节点点击:', node)
  currentItem.value = node
}

/**
 * 处理节点展开/折叠
 */
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
  console.log('节点切换:', node, expanded ? '展开' : '折叠')
  // 这里可以添加额外的处理逻辑
}

/**
 * 加载特定组件数据
 */
const loadSpecificComponent = async () => {
  pageLoading.value = true
  try {
    console.log('开始加载组件数据...')
    // 步骤1: 使用loadComponentById获取组件基本数据
    const { treeData: componentData } = await entityTree.loadComponentById(componentId.value)
    
    if (!componentData || componentData.length === 0) {
      toast.toast({
        title: "警告",
        description: "无法找到指定组件",
        variant: "destructive",
      })
      pageLoading.value = false
      return
    }
    
    // 初始化树数据
    let currentTreeData = [...componentData]
    
    // 步骤2: 明确使用loadBomByComponent加载组件的BOM数据
    console.log('加载BOM数据...')
    currentTreeData = await entityTree.loadBomByComponent(currentTreeData)
    
    if (currentTreeData.length > 0) {
      // 更新树数据
      componentTreeData.value = currentTreeData
      
      // 设置默认展开根节点
      const expandKeys = [currentTreeData[0].id]
      // 如果有子节点，将第一层子节点也设为展开
      if (currentTreeData[0].children && currentTreeData[0].children.length > 0) {
        expandKeys.push(currentTreeData[0].children[0].id)
      }
      expandedKeys.value = expandKeys
      
      // 设置默认选中根节点
      currentItemId.value = currentTreeData[0].id
      
      toast.toast({
        title: "成功",
        description: "组件数据加载完成",
      })
    } else {
      toast.toast({
        title: "警告",
        description: "无法加载组件子元素",
        variant: "destructive",
      })
    }
  } catch (error) {
    console.error('获取组件数据失败:', error)
    toast.toast({
      title: "错误",
      description: "获取组件数据失败",
      variant: "destructive",
    })
  } finally {
    pageLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  // 加载组件数据
  await loadSpecificComponent()
})

provide('refresh', loadSpecificComponent)
</script> 