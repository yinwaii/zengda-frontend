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
      :tree-data="bomTreeData" 
      tree-title="物料清单详情" 
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
import { ref, onMounted, computed } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useRouter, useRoute } from 'vue-router'
import { useEntityTree } from '~/composables/useEntityTree'
import { useEntityHandlers } from '~/composables/useEntityHandlers'
import { NODE_TYPES } from '~/utils/treeNodeFactory'
import type { TreeNodeData } from '~/components/abstract/tree/types'

// 添加 keepalive 配置
definePageMeta({
  name: 'design-bom-detail',
  keepalive: false,
  pageTransition: false,
  layout: 'default'
})

// 通过路由获取BOM ID
const route = useRoute()
const router = useRouter()
const bomId = computed(() => {
  // 确保路由参数存在并且是有效的数字
  if (route && route.params && route.params.id) {
    const id = Number(route.params.id)
    return isNaN(id) ? 0 : id
  }
  return 0
})

const { toast } = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// BOM树数据
const bomTreeData = ref<TreeNodeData[]>([])

// 添加页面初始加载状态
const pageLoading = ref(true)

// 默认展开的节点
const expandedKeys = ref<(string | number)[]>([])

// 当前选中项
const currentItemId = ref<string | number>('')
const currentItem = ref<any>(null)

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
  console.log('保存数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleSave(data, nodeType, loadBomDetail)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
  console.log('创建数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleCreate(data, nodeType, loadBomDetail)
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
 * 加载BOM详情数据
 */
const loadBomDetail = async () => {
  if (!bomId.value) {
    toast({
      title: "错误", 
      description: "无效的物料清单ID",
      variant: "destructive",
    })
    router.push('/design/bom') // 导航回列表页
    return
  }

  pageLoading.value = true
  try {
    console.log('开始加载BOM数据...')
    
    // 获取BOM详情
    const bom = await entityApis.bom.get(bomId.value)
    if (!bom) {
      toast({
        title: "警告", 
        description: "无法获取物料清单详情",
        variant: "destructive",
      })
      pageLoading.value = false
      router.push('/design/bom') // 导航回列表页
      return
    }
    
    console.log('BOM数据加载成功:', bom)
    
    // 创建BOM节点
    const bomNode = entityTree.bomTreeNodeFactory({
      ...bom,
      type: NODE_TYPES.BOM,
      id: bom.id,
      label: bom.number || `BOM ${bom.id}`
    })
    
    // 如果BOM有子物料项，转换为子节点
    if (bom.items && bom.items.length > 0) {
      bomNode.children = bom.items.map((item, index) => ({
        id: `${bomNode.id}:item-${index}`,
        originalId: item.itemId,
        label: item.itemName || `物料 ${item.itemId}`,
        type: 'bom-item',
        originalData: item
      }))
    }
    
    // 更新树数据
    bomTreeData.value = [bomNode]
    
    // 设置默认展开根节点
    expandedKeys.value = [bomNode.id]
    
    // 如果有子节点，设置为展开
    if (bomNode.children && bomNode.children.length > 0) {
      expandedKeys.value.push(bomNode.children[0].id)
    }
    
    toast({
      title: "成功",
      description: "物料清单数据加载完成",
    })
  } catch (error) {
    console.error('获取物料清单数据失败:', error)
    toast({
      title: "错误",
      description: "获取物料清单数据失败",
      variant: "destructive",
    })
  } finally {
    pageLoading.value = false
  }
}

// 初始化时加载数据
onMounted(async () => {
  if (bomId.value) {
    await loadBomDetail()
  } else {
    toast({
      title: "错误", 
      description: "未指定物料清单ID",
      variant: "destructive",
    })
    router.push('/design/bom')
  }
})
</script> 