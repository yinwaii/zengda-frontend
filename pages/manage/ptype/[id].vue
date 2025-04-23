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
      :tree-data="ptypeTreeData"
      tree-title="产品类型详情"
      :default-expanded-keys="expandedKeys"
      @node-click="handleNodeClick"
      @node-toggle="handleNodeToggle"
      @save="handleSave"
      @create="handleCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useEntityTree } from '~/composables/use-entity-tree'
import { useEntityHandlers } from '~/composables/use-entity-handlers'
import { useEntityApis } from '@/composables/use-entity-apis'
import { NODE_TYPES } from '~/models/entity/node-types'
import { generateCompositeId, getPtypeTreeNodeStruct } from '~/utils/treeNodeFactory'
import { toApiId } from '~/utils/idConverter'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPType } from '~/models/entity/ptype'
import type { ZdTemplate } from '~/models/entity/template'

// 页面元数据
definePageMeta({
  name: 'manage-ptype-detail',
  keepalive: false,
  // keepalive: {
  //   max: 10,
  //   include: ['manage-ptype-detail']
  // },
  middleware: [() => {}]
})

const route = useRoute()
const id = ref(route.params.id)
const ptypeId = computed(() => Number(id.value))
const { toast } = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 页面状态
const pageLoading = ref(true)
const ptypeTreeData = ref<TreeNodeData[]>([])
const expandedKeys = ref<(string | number)[]>([])
const editingPType = ref<ZdPType | undefined>(undefined)

/**
 * 根据产品类型ID加载模板数据
 * @param ptypeData 产品类型节点数据
 * @returns 更新后的节点数组，包含模板子节点
 */
const loadTemplateByPType = async (ptypeData: TreeNodeData[]): Promise<TreeNodeData[]> => {
  if (!ptypeData || ptypeData.length === 0) return ptypeData

  try {
    // 获取所有模板
    const response = await entityApis.template.getByPage(0, 100)
    const templates = response.content
    
    if (!templates || templates.length === 0) {
      console.log('未找到任何模板数据')
      return ptypeData
    }
    
    // 筛选出productTypeId匹配当前产品类型的模板
    const currentPType = ptypeData[0].originalData as ZdPType
    const matchingTemplates = templates.filter((template: ZdTemplate) => 
      template.productTypeId === toApiId(currentPType.id)
    )
    
    console.log(`找到 ${matchingTemplates.length} 个匹配的模板`)
    
    if (matchingTemplates.length === 0) return ptypeData
    
    // 将匹配的模板转换为节点并添加到产品类型节点下
    const templateNodes = matchingTemplates.map((template: ZdTemplate) => {
      // 转换模板为节点
      const templateWithCompositeId = {
        ...template,
        id: generateCompositeId(NODE_TYPES.TEMPLATE, template.id)
      }
      
      return entityTree.templateTreeNodeFactory(templateWithCompositeId)
    })
    
    // 将模板节点添加为产品类型节点的子节点
    ptypeData[0].children = templateNodes
    
    return ptypeData
  } catch (error) {
    console.error('加载模板数据失败:', error)
    toast({
      title: '加载失败',
      description: '无法获取模板数据',
      variant: 'destructive'
    })
    return ptypeData
  }
}

/**
 * 为模板节点加载子节点（产品系统、组件等）
 * @param ptypeData 产品类型节点数据，其中可能包含模板节点
 * @returns 更新后的节点数组，包含完整的子树
 */
const loadTemplateChildren = async (ptypeData: TreeNodeData[]): Promise<TreeNodeData[]> => {
  if (!ptypeData || ptypeData.length === 0 || !ptypeData[0].children || ptypeData[0].children.length === 0) {
    return ptypeData
  }
  
  try {
    // 获取所有模板节点
    const templateNodes = ptypeData[0].children.filter(node => node.type === NODE_TYPES.TEMPLATE)
    
    // 为每个模板节点加载子节点
    for (const templateNode of templateNodes) {
      // 提取模板ID
      const templateId = Number(templateNode.originalId)
      
      // 使用现有的loadEntityChildren方法加载所有子元素
      const { treeData: childrenData } = await entityTree.loadEntityChildren([templateNode], {
        loadSystems: true,
        loadComponents: true,
        loadFullComponents: true,
        loadBoms: true,
        loadSpecifications: true
      })
      
      if (childrenData.length > 0) {
        // 更新模板节点的子节点
        const index = ptypeData[0].children.findIndex(node => node.id === templateNode.id)
        if (index !== -1) {
          ptypeData[0].children[index] = childrenData[0]
        }
      }
    }
    
    return ptypeData
  } catch (error) {
    console.error('加载模板子节点失败:', error)
    return ptypeData
  }
}

/**
 * 加载产品类型详情及其关联数据
 */
const loadPTypeData = async () => {
  pageLoading.value = true
  
  try {
    // 获取产品类型详情
    const ptype = await entityApis.ptype.get(ptypeId.value)
    
    if (!ptype) {
      toast({
        title: '警告',
        description: '未找到指定产品类型',
        variant: 'destructive'
      })
      pageLoading.value = false
      return
    }
    
    // 保存产品类型数据用于编辑
    editingPType.value = ptype
    
    // 使用产品类型节点工厂创建节点
    const ptypeNode = {
      ...ptype,
      id: generateCompositeId(NODE_TYPES.PTYPE, ptype.id)
    }
    const ptypeTreeNode = getPtypeTreeNodeStruct(ptypeNode)
    
    // 设置初始树数据
    ptypeTreeData.value = [ptypeTreeNode]
    
    // 加载关联的模板数据
    ptypeTreeData.value = await loadTemplateByPType(ptypeTreeData.value)
    
    // 加载模板的子节点
    ptypeTreeData.value = await loadTemplateChildren(ptypeTreeData.value)
    
    // 设置默认展开的节点
    if (ptypeTreeData.value.length > 0) {
      expandedKeys.value = [ptypeTreeData.value[0].id]
    }
    
    toast({
      title: '成功',
      description: '产品类型数据加载完成'
    })
  } catch (error) {
    console.error('加载产品类型数据失败:', error)
    toast({
      title: '错误',
      description: '获取产品类型数据失败',
      variant: 'destructive'
    })
  } finally {
    pageLoading.value = false
  }
}

/**
 * 处理节点点击
 */
const handleNodeClick = (node: TreeNodeData) => {
  console.log('节点点击:', node)
}

/**
 * 处理节点展开/折叠
 */
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
  console.log('节点切换:', node, expanded ? '展开' : '折叠')
}

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
  console.log('保存数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleSave(data, nodeType, loadPTypeData)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
  console.log('创建数据:', data, '节点类型:', nodeType)
  return entityHandlers.handleCreate(data, nodeType, loadPTypeData)
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  id.value = newId
  loadPTypeData()
})

// 初始化数据
onMounted(async () => {
  await loadPTypeData()
})
</script> 