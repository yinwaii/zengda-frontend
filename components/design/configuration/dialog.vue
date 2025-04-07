<template>
  <shadcn-dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <shadcn-dialog-content class="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ editingItem?.id ? '编辑配置' : '新增配置' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ editingItem?.id ? '修改配置信息' : '创建一个新的配置' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <div class="flex flex-1 overflow-hidden mt-4">
        <!-- 左侧项目树 -->
        <div class="w-[300px] min-w-[300px] border-r pr-4 overflow-auto">
          <!-- 隐藏项目和模板选择器，仅展示当前所选 -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <shadcn-label for="project_id">项目</shadcn-label>
              <span class="text-sm font-medium">{{ selectedProject?.name || '加载中...' }}</span>
            </div>
            <div class="flex justify-between">
              <shadcn-label for="template_id">模板</shadcn-label>
              <span class="text-sm font-medium">{{ selectedTemplate?.name || '加载中...' }}</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <shadcn-label>组件结构</shadcn-label>
            <div class="border rounded-md p-2 h-[400px] overflow-auto">
              <abstract-tree
                v-if="treeData.length > 0"
                :items="treeData"
                :default-expanded-keys="expandedKeys"
                :node-components="nodeComponents"
                v-model:current-item="currentNode"
                v-model:current-item-id="currentNodeId"
                @node-click="handleNodeClick"
                @node-toggle="handleNodeToggle"
              >
                <!-- 图标插槽 -->
                <template #icon="{ node, type }">
                  <component :is="getNodeIcon(type)" class="h-4 w-4" :class="getIconColorClass(type)" />
                </template>
              </abstract-tree>
              <div v-else class="flex h-full items-center justify-center text-muted-foreground">
                <p>加载组件结构中...</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧参数表单 -->
        <div class="flex-1 pl-4 overflow-auto">
          <div v-if="currentNode" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">{{ currentNode.originalData?.name || '组件参数' }}</h3>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <shadcn-label for="useComponent">使用组件</shadcn-label>
                  <shadcn-switch id="useComponent" v-model="componentConfig.useComponent" />
                </div>
                <div v-if="componentConfig.useComponent" class="flex items-center gap-2">
                  <shadcn-label for="componentCount">数量</shadcn-label>
                  <shadcn-input 
                    id="componentCount" 
                    v-model="componentConfig.count" 
                    type="number" 
                    min="1" 
                    class="w-20" 
                  />
                </div>
              </div>
            </div>
            
            <div v-if="parameters.length > 0">
              <shadcn-auto-form
                v-model:modelValue="formData"
                :schema="formSchema"
                :field-config="fieldConfig"
                @submit="handleFormSubmit"
              />
            </div>
            <div v-else class="text-center text-muted-foreground py-4">
              该组件没有参数，但您可以选择是否使用该组件及数量
            </div>
          </div>
          <div v-else class="flex h-full items-center justify-center text-muted-foreground">
            <p>请从左侧选择一个组件节点</p>
          </div>
        </div>
      </div>
      
      <shadcn-dialog-footer class="mt-4">
        <div class="flex justify-end gap-2">
          <shadcn-button
            type="button"
            variant="outline"
            @click="$emit('update:modelValue', false)"
          >
            取消
          </shadcn-button>
          <shadcn-button
            type="button"
            :disabled="isSubmitting || !canSubmit"
            @click="handleSubmit"
          >
            {{ isSubmitting ? '提交中...' : '确认' }}
          </shadcn-button>
        </div>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdParameter } from '~/models/entity/parameter'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { useEntityApis } from '~/composables/use-entity-apis'
import { useToast } from '~/components/ui/toast'
import { z } from 'zod'
import { LucideFile, LucideFolder, LucideBox, LucideSettings, LucideCode, LucideCpu, LucideTag, LucideSettings2, LucideLayoutTemplate, LucidePackage, LucideComponent, LucideFileSpreadsheet, LucideBoxes } from 'lucide-vue-next'
import AbstractTree from '~/components/abstract/tree/Tree.vue'
import TreeNode from '~/components/abstract/tree/TreeNode.vue'
import { NODE_TYPES } from '~/models/entity/node-types'
import type { ZodObjectOrWrapped } from '~/components/ui/auto-form/utils'
import { useRoute } from 'vue-router'
import { useEntityTree } from '~/composables/useEntityTree'

// 获取当前路由，用于自动获取项目ID
const route = useRoute()

// 声明参数对象的类型
const props = defineProps<{
  modelValue: boolean
  editingItem?: ZdConfiguration
  projectId?: number // 从页面传入的项目ID，优先使用
  templateId?: number // 从页面传入的模板ID，优先使用
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', value: ZdConfiguration): void
}>()

const { toast } = useToast()
const entityApis = useEntityApis()
const isSubmitting = ref(false)
const projects = ref<ZdProject[]>([])
const templates = ref<ZdTemplate[]>([])
const treeData = ref<TreeNodeData[]>([])
const expandedKeys = ref<(string | number)[]>([])
const currentNode = ref<TreeNodeData | null>(null)
const currentNodeId = ref<string | number | null>(null)
const parameters = ref<ZdParameter[]>([])
const formData = ref<Record<string, any>>({})
// 创建一个空的Zod对象schema，使用any类型避免类型检查错误
const formSchema = ref<any>(z.object({}))
const fieldConfig = ref<Record<string, any>>({})

// 组件配置
const componentConfig = ref({
  useComponent: true,
  count: 1
})

// 获取当前页面项目ID
const getCurrentProjectId = (): number | undefined => {
  // 尝试从props获取
  if (props.projectId) return props.projectId
  
  // 尝试从路由参数获取
  const projectId = route.params.id
  if (projectId && !isNaN(Number(projectId))) {
    return Number(projectId)
  }
  
  return undefined
}

// 表单数据
const form = ref<Partial<ZdConfiguration>>({
  project_id: getCurrentProjectId() || 0,
  template_id: props.templateId || 0,
  isShow: true,
  valueConfig: '',
  componentConfig: ''
})

// 选中的项目和模板
const selectedProject = computed(() => 
  projects.value.find(p => p.id === form.value.project_id)
)

const selectedTemplate = computed(() => 
  templates.value.find(t => t.id === form.value.template_id)
)

// 是否可以提交
const canSubmit = computed(() => {
  // 对于新建配置，需要满足所有条件
  if (!props.editingItem?.id) {
    return form.value.project_id && form.value.template_id && currentNode.value
  }
  
  // 对于编辑现有配置，只要有项目ID和模板ID就可以提交
  const canSubmitResult = form.value.project_id && form.value.template_id;
  console.log('编辑模式下canSubmit状态:', canSubmitResult, {
    project_id: form.value.project_id,
    template_id: form.value.template_id,
    currentNode: currentNode.value
  });
  return canSubmitResult;
})

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

// 获取节点图标
const getNodeIcon = (type: string = 'default') => {
  return iconMap[type] || iconMap.default
}

// 获取图标颜色类
const getIconColorClass = (type: string = 'default') => {
  return iconColorMap[type] || iconColorMap.default
}

// 定义确保有children的TreeNodeData类型
interface TreeNodeWithChildren extends TreeNodeData {
  children: TreeNodeWithChildren[];
}

// 初始化
const init = async () => {
  try {
    console.log('初始化对话框，编辑项:', props.editingItem)
    
    // 获取项目列表
    const projectsRes = await entityApis.project.getByPage(1, 100)
    projects.value = projectsRes.content || []
    
    // 获取模板列表
    const templatesRes = await entityApis.template.getByPage(1, 100)
    templates.value = templatesRes.content || []
    
    // 如果是编辑模式，设置表单值
    if (props.editingItem) {
      form.value = {
        project_id: props.editingItem.project_id,
        template_id: props.editingItem.template_id,
        isShow: props.editingItem.isShow,
        valueConfig: props.editingItem.valueConfig || '',
        componentConfig: props.editingItem.componentConfig || ''
      }
      
      console.log('编辑模式设置表单:', form.value)
    } else {
      // 新建模式，设置默认值
      // 使用当前页面的项目ID
      const currentProjectId = getCurrentProjectId()
      
      // 如果存在当前项目ID，从该项目中查找默认模板
      let defaultTemplateId = props.templateId || 0
      if (currentProjectId && !defaultTemplateId) {
        try {
          // 获取项目默认模板
          const project = await entityApis.project.get(currentProjectId)
          // 使用项目的templateId属性
          if (project && project.templateId) {
            defaultTemplateId = project.templateId
          } else if (templates.value.length > 0) {
            // 如果没有默认模板，使用第一个模板
            defaultTemplateId = templates.value[0].id
          }
        } catch (e) {
          console.error('获取项目默认模板失败:', e)
          if (templates.value.length > 0) {
            defaultTemplateId = templates.value[0].id
          }
        }
      }
      
      form.value = {
        project_id: currentProjectId || (projects.value.length > 0 ? projects.value[0].id : 0),
        template_id: defaultTemplateId,
        isShow: true,
        valueConfig: '',
        componentConfig: ''
      }
      
      console.log('新建模式设置表单:', form.value)
    }
    
    // 默认设置组件配置
    componentConfig.value = {
      useComponent: true,
      count: 1
    }
    
    // 初始化后立即加载项目树
    if (form.value.project_id && form.value.template_id) {
      await loadProjectTree()
      
      // 检查加载和状态情况
      console.log('项目树加载后状态:', {
        treeData: treeData.value.length,
        currentNode: currentNode.value,
        canSubmit: canSubmit.value
      });
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    toast({
      title: '加载数据失败',
      description: '无法获取项目或模板数据',
      variant: 'destructive'
    })
  }
}

// 从项目模板树中加载组件树结构
const loadProjectTree = async () => {
  if (!form.value.project_id || !form.value.template_id) return
  
  try {
    // 使用useEntityTree组合API，获取专业的树加载实现
    const entityTree = useEntityTree()

    // 1. 首先加载模板基本数据
    const { treeData: templateData } = await entityTree.loadTemplateById(form.value.template_id)
    
    if (templateData.length === 0) {
      throw new Error('未找到模板信息')
    }
    
    // 2. 使用loadEntityChildren加载完整的模板组件树
    // 这将自动加载PSystem和Component，并保持正确的层级关系
    const { treeData: completeData } = await entityTree.loadEntityChildren(templateData, {
      loadSystems: true,
      loadComponents: true,
      loadFullComponents: true,
      loadBoms: true,
      loadSpecifications: true
    })
    
    // 设置树数据
    treeData.value = completeData
    
    // 默认展开所有节点
    const getAllNodeIds = (nodes: TreeNodeWithChildren[]): (string | number)[] => {
      let ids: (string | number)[] = []
      for (const node of nodes) {
        ids.push(node.id)
        if (node.children && node.children.length > 0) {
          ids = [...ids, ...getAllNodeIds(node.children)]
        }
      }
      return ids
    }
    
    expandedKeys.value = getAllNodeIds(treeData.value as TreeNodeWithChildren[])
    
    // 默认选择第一个组件节点
    const findFirstComponentNode = (nodes: TreeNodeWithChildren[]): TreeNodeWithChildren | null => {
      for (const node of nodes) {
        if (node.type === NODE_TYPES.COMPONENT) {
          return node
        }
        
        if (node.children && node.children.length > 0) {
          const found = findFirstComponentNode(node.children)
          if (found) return found
        }
      }
      
      return null
    }
    
    // 确保选择一个节点，优先选择组件节点
    let nodeSelected = false
    const firstComponentNode = findFirstComponentNode(treeData.value as TreeNodeWithChildren[])
    if (firstComponentNode) {
      handleNodeClick(firstComponentNode)
      nodeSelected = true
    } else if (treeData.value.length > 0) {
      // 如果没有组件节点，就选择第一个节点
      handleNodeClick(treeData.value[0])
      nodeSelected = true
    }
    
    // 如果还是没有节点被选中，强制设置一个空节点以避免无法提交
    if (!nodeSelected && treeData.value.length === 0) {
      currentNode.value = null
    }
    
    console.log('成功加载模板组件树', treeData.value)
    console.log('树加载后的当前节点:', currentNode.value)
    console.log('当前canSubmit状态:', canSubmit.value, '条件:', {
      project_id: form.value.project_id,
      template_id: form.value.template_id,
      currentNode: currentNode.value !== null
    })
  } catch (error) {
    console.error('加载项目树失败:', error)
    toast({
      title: '加载失败',
      description: '无法加载模板组件树结构',
      variant: 'destructive'
    })
  }
}

// 加载组件参数 - 即使没有参数也可以配置组件
const loadComponentParameters = async () => {
  if (!currentNode.value) return
  
  try {
    // 获取节点类型和ID
    const { type, originalData } = currentNode.value
    if (!originalData || !originalData.id) return
    
    // 确保节点类型不为undefined
    const nodeType = type || 'COMPONENT'
    
    // 实际节点ID（可能包含在字符串ID中，如 "COMPONENT:123"）
    let entityId = originalData.id
    if (typeof currentNode.value.id === 'string' && currentNode.value.id.includes(':')) {
      const idParts = currentNode.value.id.split(':')
      if (idParts.length > 1) {
        entityId = parseInt(idParts[1], 10) || entityId
      }
    }
    
    // 配置键
    const configKey = `${nodeType}:${entityId}`
    console.log(`加载节点参数, 节点:`, {type: nodeType, id: entityId, configKey})
    
    // 根据节点类型获取参数，确保传入的类型是字符串
    const result = await entityApis.parameter.get(entityId, nodeType)
    parameters.value = Array.isArray(result) ? result : []
    
    // 生成表单schema
    generateFormSchema()
    
    // 默认清空表单数据
    formData.value = {}
    
    // 如果有编辑项，尝试加载组件配置和参数值
    if (props.editingItem) {
      // 加载组件配置
      if (props.editingItem.componentConfig) {
        try {
          const config = JSON.parse(props.editingItem.componentConfig)
          if (config[configKey]) {
            componentConfig.value = config[configKey]
            console.log(`加载组件配置:`, configKey, componentConfig.value)
          } else {
            // 如果没有当前组件的配置，使用默认值
            componentConfig.value = {
              useComponent: true,
              count: 1
            }
            console.log(`未找到组件配置, 使用默认值:`, configKey, componentConfig.value)
          }
        } catch (e) {
          console.error('解析组件配置失败:', e)
        }
      }
      
      // 加载参数值
      if (props.editingItem.valueConfig) {
        try {
          const valueConfig = JSON.parse(props.editingItem.valueConfig)
          
          if (valueConfig[configKey]) {
            // 获取参数值
            const paramValues = valueConfig[configKey]
            console.log(`加载参数值:`, configKey, paramValues)
            
            // 处理数据类型转换
            const convertedValues: Record<string, any> = {}
            
            // 遍历参数定义，根据类型转换值
            parameters.value.forEach(param => {
              const paramName = param.name
              if (paramName in paramValues) {
                // 根据参数类型转换值
                switch (param.dtype?.toLowerCase()) {
                  case 'number':
                    // 确保是数字类型
                    convertedValues[paramName] = Number(paramValues[paramName])
                    break
                  case 'boolean':
                    // 确保是布尔类型
                    convertedValues[paramName] = Boolean(paramValues[paramName])
                    break
                  default:
                    // 其他类型不处理
                    convertedValues[paramName] = paramValues[paramName]
                }
              }
            })
            
            // 设置转换后的值
            formData.value = convertedValues
            console.log(`参数值转换后:`, formData.value)
          } else {
            formData.value = {} // 清空表单数据
            console.log(`未找到参数值, 使用空对象:`, configKey)
          }
        } catch (e) {
          console.error('解析值配置失败:', e)
          formData.value = {}
        }
      }
    }
  } catch (error) {
    console.error('加载参数失败:', error)
    toast({
      title: '加载失败',
      description: '无法加载参数',
      variant: 'destructive'
    })
  }
}

// 生成表单schema
const generateFormSchema = () => {
  if (parameters.value.length === 0) {
    // 创建空schema
    formSchema.value = z.object({}) as any
    fieldConfig.value = {}
    return
  }
  
  const schemaShape: Record<string, any> = {}
  const configShape: Record<string, any> = {}
  
  parameters.value.forEach(param => {
    const fieldName = param.name
    
    // 根据参数类型生成schema
    switch (param.dtype?.toLowerCase()) {
      case 'string':
        schemaShape[fieldName] = z.string().optional()
        break
      case 'number':
        schemaShape[fieldName] = z.number().optional()
        break
      case 'boolean':
        schemaShape[fieldName] = z.boolean().optional()
        break
      case 'date':
        schemaShape[fieldName] = z.string().optional() // 日期用字符串表示
        break
      default:
        schemaShape[fieldName] = z.string().optional()
    }
    
    // 配置表单字段
    configShape[fieldName] = {
      label: param.name,
      description: param.description || '',
      component: getComponentType(param.dtype)
    }
  })
  
  // 使用类型断言绕过TypeScript类型检查
  formSchema.value = z.object(schemaShape) as any
  fieldConfig.value = configShape
}

// 根据参数类型获取组件类型
const getComponentType = (dtype?: string) => {
  if (!dtype) return 'string'
  
  switch (dtype.toLowerCase()) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'switch'
    case 'date':
      return 'date'
    default:
      return 'string'
  }
}

// 处理节点点击 - 允许任何类型的节点
const handleNodeClick = (node: TreeNodeData) => {
  currentNode.value = node
  currentNodeId.value = node.id
  
  console.log('点击节点:', node, '当前canSubmit状态:', form.value.project_id && form.value.template_id && node)
  
  // 加载节点参数，但不要求节点类型必须是COMPONENT
  loadComponentParameters()
}

// 处理节点展开/折叠
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
  if (expanded) {
    expandedKeys.value.push(node.id)
  } else {
    expandedKeys.value = expandedKeys.value.filter(id => id !== node.id)
  }
}

// 处理表单提交
const handleFormSubmit = (data: Record<string, any>) => {
  formData.value = data
}

// 初始化时加载数据，不再监听项目和模板变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    init()
  }
})

// 表单提交
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    if (!form.value.project_id || !form.value.template_id) {
      throw new Error('请选择项目和模板')
    }
    
    // 构建值配置 - 保存所有节点的参数值
    const valueConfig: Record<string, any> = {}
    
    // 构建组件配置 - 保存所有组件节点的配置
    const componentConfigObj: Record<string, any> = {}
    
    // 递归遍历所有节点并收集其参数值
    const traverseNodesAndCollectValues = async (nodes: TreeNodeData[]) => {
      for (const node of nodes) {
        // 获取节点类型和ID
        const { type, originalData } = node
        if (!originalData || !originalData.id) continue
        
        // 确保节点类型不为undefined
        const nodeType = type || 'COMPONENT'
        
        // 实际节点ID（可能包含在字符串ID中，如 "COMPONENT:123"）
        let entityId = originalData.id
        if (typeof node.id === 'string' && node.id.includes(':')) {
          const idParts = node.id.split(':')
          if (idParts.length > 1) {
            entityId = parseInt(idParts[1], 10) || entityId
          }
        }
        
        // 使用类型:ID作为键，确保不同类型节点配置不冲突
        const configKey = `${nodeType}:${entityId}`
        
        // 获取节点参数
        try {
          const nodeParams = await entityApis.parameter.get(entityId, nodeType)
          const paramsArray = Array.isArray(nodeParams) ? nodeParams : []
          
          // 构建节点参数值对象
          let nodeValues: Record<string, any> = {}
          
          // 如果是编辑模式，并且已有值配置，尝试获取已有的值
          if (props.editingItem?.valueConfig) {
            try {
              const existingConfig = JSON.parse(props.editingItem.valueConfig)
              if (existingConfig[configKey]) {
                nodeValues = existingConfig[configKey]
                console.log(`从现有配置中获取节点 ${configKey} 的值:`, nodeValues)
              }
            } catch (e) {
              console.warn('解析原有值配置失败，将使用默认值', e)
            }
          }
          
          // 如果当前节点是被用户选中的节点，使用表单中的值
          if (currentNode.value && currentNode.value.id === node.id) {
            const formValues = { ...formData.value } // 创建副本防止引用问题
            console.log(`使用当前选中节点 ${configKey} 的表单值:`, formValues)
            
            // 确保根据参数类型正确转换值
            for (const param of paramsArray) {
              if (param.name in formValues) {
                // 特别处理数字类型，确保是数字而不是字符串
                if (param.dtype?.toLowerCase() === 'number' && formValues[param.name] !== undefined) {
                  const numValue = Number(formValues[param.name])
                  if (!isNaN(numValue)) {
                    formValues[param.name] = numValue
                  }
                }
              }
            }
            
            nodeValues = formValues
          } else {
            // 否则，确保每个参数都有一个值，保留原有值，只为缺失值添加默认值
            for (const param of paramsArray) {
              // 仅当值对象中没有该参数的值时，添加默认值
              if (!(param.name in nodeValues)) {
                // 根据参数类型设置默认值
                switch (param.dtype?.toLowerCase()) {
                  case 'string':
                    nodeValues[param.name] = ''
                    break
                  case 'number':
                    nodeValues[param.name] = 0
                    break
                  case 'boolean':
                    nodeValues[param.name] = false
                    break
                  case 'date':
                    nodeValues[param.name] = ''
                    break
                  default:
                    nodeValues[param.name] = ''
                }
              } else if (param.dtype?.toLowerCase() === 'number') {
                // 确保数字类型的值是数字而不是字符串
                const numValue = Number(nodeValues[param.name])
                if (!isNaN(numValue)) {
                  nodeValues[param.name] = numValue
                }
              }
            }
          }
          
          // 打印最终使用的参数值
          console.log(`最终使用的节点 ${configKey} 参数值:`, nodeValues)
          
          // 保存节点参数值
          valueConfig[configKey] = nodeValues
          
          // 如果是组件节点，还需要保存组件配置
          if (nodeType === NODE_TYPES.COMPONENT) {
            let useComponent = true
            let count = 1
            
            // 如果是编辑模式，并且已有组件配置，尝试获取已有的配置
            if (props.editingItem?.componentConfig) {
              try {
                const existingConfig = JSON.parse(props.editingItem.componentConfig)
                if (existingConfig[configKey]) {
                  useComponent = existingConfig[configKey].useComponent !== undefined 
                    ? existingConfig[configKey].useComponent 
                    : true
                  count = existingConfig[configKey].count !== undefined 
                    ? existingConfig[configKey].count 
                    : 1
                  console.log(`从现有配置中获取组件 ${configKey} 的配置:`, { useComponent, count })
                }
              } catch (e) {
                console.warn('解析原有组件配置失败，将使用默认值', e)
              }
            }
            
            // 如果当前节点是被用户选中的节点，使用用户设置的值
            if (currentNode.value && currentNode.value.id === node.id && 
                currentNode.value.type === NODE_TYPES.COMPONENT) {
              useComponent = componentConfig.value.useComponent
              count = componentConfig.value.count
              console.log(`使用当前选中组件 ${configKey} 的配置:`, { useComponent, count })
            }
            
            // 保存组件配置
            componentConfigObj[configKey] = {
              useComponent,
              count
            }
          }
        } catch (error) {
          console.error(`加载节点 ${configKey} 参数失败:`, error)
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          await traverseNodesAndCollectValues(node.children)
        }
      }
    }
    
    // 开始遍历所有节点
    await traverseNodesAndCollectValues(treeData.value)
    
    const configData: Partial<ZdConfiguration> = {
      ...form.value,
      name: `${selectedProject.value?.name || ''}-${selectedTemplate.value?.name || ''}-配置`,
      valueConfig: JSON.stringify(valueConfig),
      componentConfig: JSON.stringify(componentConfigObj),
      lastVersionId: 0
    }
    
    // 打印最终提交的配置数据
    console.log('准备提交的配置数据:', configData)
    
    let result: ZdConfiguration
    
    if (props.editingItem?.id) {
      // 编辑现有配置
      result = {
        ...configData,
        id: props.editingItem.id
      } as ZdConfiguration
      
      // 确保字段名称与后端接口一致
      console.log('最终提交编辑配置:', result)
    } else {
      // 创建新配置
      result = configData as ZdConfiguration
      
      // 确保字段名称与后端接口一致
      console.log('最终提交新建配置:', result)
    }
    
    toast({
      title: '成功',
      description: props.editingItem?.id ? '配置已更新' : '配置已创建'
    })
    
    emit('submit', result)
    emit('update:modelValue', false)
  } catch (error: any) {
    console.error('提交失败:', error)
    toast({
      title: '提交失败',
      description: error.message || '发生未知错误',
      variant: 'destructive'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script> 