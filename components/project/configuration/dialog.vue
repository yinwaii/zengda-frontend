<template>
  <shadcn-dialog :open="isOpen" @update:open="setIsOpen">
    <shadcn-dialog-content class="w-[95%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[75%] max-h-[80vh] overflow-y-auto resizable-dialog">
      <shadcn-dialog-header>
        <shadcn-dialog-title>项目配置生成</shadcn-dialog-title>
        <shadcn-dialog-description>
          根据项目结构生成配置
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <div class="grid grid-cols-1 gap-6 py-4 overflow-y-auto max-h-[60vh]">
        <div v-if="isLoading" class="flex items-center justify-center py-6">
          <!-- <shadcn-loader class="w-6 h-6 animate-spin" /> -->
          <span class="ml-2">正在加载项目数据...</span>
        </div>
        <div v-else-if="!project" class="text-center py-4">
          无法加载项目结构，请重试
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- 左侧项目树结构 -->
          <div class="border rounded-md p-4 md:col-span-2">
            <h3 class="text-lg font-medium mb-4">项目结构</h3>
            <div class="overflow-y-auto max-h-[50vh]">
              <div class="tree-root">
                <!-- 项目根节点 -->
                <div class="tree-node">
                  <div class="flex items-center gap-1">
                    <button class="p-1 hover:bg-accent rounded-sm" @click="toggleNode('project')">
                      <LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expandedNodes.project }]" />
                    </button>
                    <div 
                      class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
                      :class="{ 'bg-accent': activeNode === 'project' }"
                      @click="setActiveNode('project')">
                      <LucideFolder class="h-4 w-4" />
                      <span class="flex-1 truncate">{{ project.name }}</span>
                    </div>
                  </div>
                  
                  <!-- 项目子节点 -->
                  <div v-if="expandedNodes.project" class="ml-6 space-y-1 mt-1">
                    <!-- 模板节点 -->
                    <div v-if="template" class="tree-node">
                      <div class="flex items-center gap-1">
                        <button class="p-1 hover:bg-accent rounded-sm" @click="toggleNode('template')">
                          <LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expandedNodes.template }]" />
                        </button>
                        <div 
                          class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
                          :class="{ 'bg-accent': activeNode === 'template' }"
                          @click="setActiveNode('template')">
                          <LucideBookTemplate class="h-4 w-4" />
                          <span class="flex-1 truncate">{{ template.name }}</span>
                        </div>
                      </div>
                      
                      <!-- 模板子节点 -->
                      <div v-if="expandedNodes.template" class="ml-6 space-y-1 mt-1">
                        <!-- 系统节点列表 -->
                        <div v-for="system in systems" :key="system.id" class="tree-node">
                          <div class="flex items-center gap-1">
                            <button class="p-1 hover:bg-accent rounded-sm" @click="toggleNode('system-' + system.id)">
                              <LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expandedNodes['system-' + system.id] }]" />
                            </button>
                            <div 
                              class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
                              :class="{ 'bg-accent': activeNode === 'system-' + system.id }"
                              @click="setActiveNode('system-' + system.id)">
                              <LucideLayoutGrid class="h-4 w-4" />
                              <span class="flex-1 truncate">{{ system.name }}</span>
                            </div>
                          </div>
                          
                          <!-- 系统子节点（直接组件列表）-->
                          <div v-if="expandedNodes['system-' + system.id]" class="ml-6 space-y-1 mt-1">
                            <!-- 直接获取系统的组件 -->
                            <template v-for="component in getSystemComponents(system.id)" :key="component.id">
                              <div class="tree-node">
                                <div class="flex items-center gap-1">
                                  <div class="w-6"></div>
                                  <div 
                                    class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
                                    :class="{ 'bg-accent': activeNode === 'component-' + component.id }"
                                    @click="setActiveNode('component-' + component.id)">
                                    <LucidePuzzle class="h-4 w-4" />
                                    <span class="flex-1 truncate">{{ component.name }}</span>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧配置表单 -->
          <div class="border rounded-md p-4 md:col-span-3">
            <h3 class="text-lg font-medium mb-4">{{ getActiveNodeTitle() }}配置</h3>
            
            <!-- 不同节点类型的配置表单 -->
            
            <!-- 项目参数配置 -->
            <div v-if="activeNode === 'project'">
              <shadcn-tabs defaultValue="params">
                <shadcn-tabs-list>
                  <shadcn-tabs-trigger value="params">参数配置</shadcn-tabs-trigger>
                </shadcn-tabs-list>
                <shadcn-tabs-content value="params" class="pt-4">
                  <auto-form 
                    v-if="projectParamsSchema" 
                    :schema="projectParamsSchema" 
                    @submit="updateParameterConfig('project', $event)" 
                  />
                  <div v-else class="text-center py-4 text-muted-foreground">
                    无可配置参数
                  </div>
                </shadcn-tabs-content>
              </shadcn-tabs>
            </div>
            
            <!-- 模板参数配置 -->
            <div v-else-if="activeNode === 'template'">
              <shadcn-tabs defaultValue="params">
                <shadcn-tabs-list>
                  <shadcn-tabs-trigger value="params">参数配置</shadcn-tabs-trigger>
                </shadcn-tabs-list>
                <shadcn-tabs-content value="params" class="pt-4">
                  <auto-form 
                    v-if="templateParamsSchema" 
                    :schema="templateParamsSchema" 
                    @submit="updateParameterConfig('template', $event)" 
                  />
                  <div v-else class="text-center py-4 text-muted-foreground">
                    无可配置参数
                  </div>
                </shadcn-tabs-content>
              </shadcn-tabs>
            </div>
            
            <!-- 系统参数配置 -->
            <div v-else-if="activeNode.startsWith('system-')">
              <shadcn-tabs defaultValue="params">
                <shadcn-tabs-list>
                  <shadcn-tabs-trigger value="params">参数配置</shadcn-tabs-trigger>
                </shadcn-tabs-list>
                <shadcn-tabs-content value="params" class="pt-4">
                  <auto-form 
                    v-if="getSystemSchema()" 
                    :schema="getSystemSchema()" 
                    @submit="updateParameterConfig('system', $event, getNodeId())" 
                  />
                  <div v-else class="text-center py-4 text-muted-foreground">
                    无可配置参数
                  </div>
                </shadcn-tabs-content>
              </shadcn-tabs>
            </div>
            
            <!-- 组件配置 -->
            <div v-else-if="activeNode.startsWith('component-')">
              <shadcn-tabs defaultValue="config">
                <shadcn-tabs-list>
                  <shadcn-tabs-trigger value="config">组件配置</shadcn-tabs-trigger>
                </shadcn-tabs-list>
                <shadcn-tabs-content value="config" class="pt-4">
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <shadcn-label :for="`enabled-${getNodeId()}`">启用</shadcn-label>
                        <shadcn-checkbox 
                          :id="`enabled-${getNodeId()}`" 
                          v-model="componentSelections[getNodeId()].enabled" 
                          @update:modelValue="updateComponentConfig" 
                        />
                      </div>
                      <div class="space-y-2">
                        <shadcn-label :for="`quantity-${getNodeId()}`">数量</shadcn-label>
                        <shadcn-input 
                          type="number" 
                          :id="`quantity-${getNodeId()}`" 
                          v-model="componentSelections[getNodeId()].quantity" 
                          :disabled="!componentSelections[getNodeId()].enabled"
                          @update:modelValue="updateComponentConfig"
                        />
                      </div>
                    </div>
                  </div>
                </shadcn-tabs-content>
              </shadcn-tabs>
            </div>
            
            <div v-else class="text-center py-4 text-muted-foreground">
              请从左侧选择要配置的项目节点
            </div>
          </div>
        </div>
      </div>
      
      <shadcn-dialog-footer>
        <div class="flex justify-between w-full">
          <shadcn-button variant="outline" @click="resetForm">重置</shadcn-button>
          <div class="space-x-2">
            <shadcn-button variant="secondary" @click="loadExistingConfig" v-if="hasExistingConfig">加载已有配置</shadcn-button>
            <shadcn-button type="submit" @click="handleSubmit" :disabled="isSaving">
              <!-- <shadcn-loader v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" /> -->
              {{ isSaving ? '保存中...' : '保存配置' }}
            </shadcn-button>
          </div>
        </div>
      </shadcn-dialog-footer>

      <!-- 保存成功提示 -->
      <div v-if="saveSuccessful" class="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-md shadow-lg">
        <div class="flex items-center">
          <LucideCheck class="h-5 w-5 mr-2" />
          <span>配置保存成功!</span>
        </div>
      </div>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { z } from 'zod'
import { AutoForm } from '~/components/ui/auto-form'
import { Loader2, ChevronRight, Folder, BookTemplate, LayoutGrid, Puzzle, FileText, Check } from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdConfiguration } from '~/models/entity/configuration'

// 扩展ZdProject类型，添加systems属性
interface ExtendedProject extends ZdProject {
  systems?: ZdPSystem[];
}

const props = defineProps<{
  isOpen: boolean
  projectId: number
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', configuration: ZdConfiguration): void
}>()

const entityApis = useEntityApis()
const isLoading = ref(true)
const isSaving = ref(false)
const saveSuccessful = ref(false)
const project = ref<ExtendedProject | null>(null)
const template = ref<ZdTemplate | null>(null)
const systems = ref<ZdPSystem[]>([])
const components = ref<ZdComponent[]>([])
const hasExistingConfig = ref(false)
const existingConfig = ref<ZdConfiguration | null>(null)

// 树结构状态
const expandedNodes = ref<Record<string, boolean>>({
  'project': true,
  'template': true
})
const activeNode = ref<string>('project')

// 参数表单的数据模型
const projectParams = ref<ZdParameter[]>([])
const templateParams = ref<ZdParameter[]>([])
const systemParams = ref<Record<number, ZdParameter[]>>({})

// 组件选择状态
const componentSelections = ref<Record<number, { enabled: boolean, quantity: number }>>({})

// 配置值
const valueConfig = ref<Record<string, any>>({
  project: {},
  template: {},
  systems: {}
})
const componentConfig = ref<Record<number, { enabled: boolean, quantity: number }>>({})

// 添加componentsData引用
const componentsData = ref<{ list?: { componentId: number, psystemId: number }[] }>({ list: [] });

// 切换节点展开状态
const toggleNode = (nodeId: string) => {
  expandedNodes.value[nodeId] = !expandedNodes.value[nodeId]
}

// 设置当前激活的节点
const setActiveNode = (nodeId: string) => {
  activeNode.value = nodeId
}

// 获取系统下的组件
const getSystemComponents = (systemId: number) => {
  // 过滤与当前系统关联的组件
  // 使用template_component表中的数据进行关联查询
  return components.value.filter(component => {
    // 查找该组件是否关联到这个系统
    const isLinkedToSystem = componentsData.value.list?.some(tc => 
      tc.componentId === component.id && tc.psystemId === systemId
    );
    return isLinkedToSystem;
  });
}

// 获取当前激活节点的ID
const getNodeId = () => {
  if (activeNode.value.startsWith('system-')) {
    return parseInt(activeNode.value.split('-')[1])
  }
  if (activeNode.value.startsWith('component-')) {
    return parseInt(activeNode.value.split('-')[1])
  }
  return -1
}

// 获取当前激活节点的标题
const getActiveNodeTitle = () => {
  if (activeNode.value === 'project') {
    return '项目'
  }
  if (activeNode.value === 'template') {
    return '模板'
  }
  if (activeNode.value.startsWith('system-')) {
    const systemId = getNodeId()
    const system = systems.value.find(s => s.id === systemId)
    return system ? `系统: ${system.name}` : '系统'
  }
  if (activeNode.value.startsWith('component-')) {
    const componentId = getNodeId()
    const component = components.value.find(c => c.id === componentId)
    return component ? `组件: ${component.name}` : '组件'
  }
  return ''
}

// 获取当前系统的schema
const getSystemSchema = () => {
  if (activeNode.value.startsWith('system-')) {
    const systemId = getNodeId()
    return systemParamsSchemas.value[systemId]
  }
  return null
}

// 生成参数的Zod Schema
const projectParamsSchema = computed(() => {
  if (!projectParams.value.length) return null
  const schema: Record<string, any> = {}
  
  projectParams.value.forEach(param => {
    const fieldName = param.name
    // 根据dtype确定字段类型
    switch (param.dtype) {
      case 'number':
        schema[fieldName] = z.number().optional()
        break
      case 'boolean':
        schema[fieldName] = z.boolean().optional()
        break
      default:
        schema[fieldName] = z.string().optional()
    }
  })
  
  return z.object(schema)
})

const templateParamsSchema = computed(() => {
  if (!templateParams.value.length) return null
  const schema: Record<string, any> = {}
  
  templateParams.value.forEach(param => {
    const fieldName = param.name
    // 根据dtype确定字段类型
    switch (param.dtype) {
      case 'number':
        schema[fieldName] = z.number().optional()
        break
      case 'boolean':
        schema[fieldName] = z.boolean().optional()
        break
      default:
        schema[fieldName] = z.string().optional()
    }
  })
  
  return z.object(schema)
})

const systemParamsSchemas = computed(() => {
  const schemas: Record<number, any> = {}
  
  Object.entries(systemParams.value).forEach(([systemId, params]) => {
    if (!params.length) return
    
    const schema: Record<string, any> = {}
    params.forEach(param => {
      const fieldName = param.name
      // 根据dtype确定字段类型
      switch (param.dtype) {
        case 'number':
          schema[fieldName] = z.number().optional()
          break
        case 'boolean':
          schema[fieldName] = z.boolean().optional()
          break
        default:
          schema[fieldName] = z.string().optional()
      }
    })
    
    schemas[Number(systemId)] = z.object(schema)
  })
  
  return schemas
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:isOpen', value)
  if (!value) {
    // 关闭对话框时重置表单状态
    resetForm()
  } else {
    // 打开对话框时加载数据
    loadData()
  }
}

// 加载项目数据和相关参数
const loadData = async () => {
  isLoading.value = true
  try {
    // 加载项目数据
    const projectData = await entityApis.project.get(props.projectId)
    project.value = projectData as ExtendedProject
    
    // 加载项目参数
    const projectParamsData = await entityApis.parameter.get(props.projectId, 'project')
    projectParams.value = projectParamsData || []
    
    // 如果项目有模板，加载模板数据和参数
    if (projectData.templateId) {
      // 加载模板数据
      const templateData = await entityApis.template.get(projectData.templateId)
      template.value = templateData
      
      // 加载模板参数
      const templateParamsData = await entityApis.parameter.get(templateData.id, 'template')
      templateParams.value = templateParamsData || []
      
      // 加载系统数据
      const systemsData = await entityApis.template_psystem.getByTemplateId(templateData.id)
      systems.value = systemsData.list || []
      
      // 重要：将系统数据添加到项目对象中
      project.value.systems = systems.value
      
      // 为每个系统加载参数
      for (const system of systems.value) {
        const systemParamsData = await entityApis.parameter.get(system.id, 'psystem')
        systemParams.value[system.id] = systemParamsData || []

        // 自动展开系统节点
        expandedNodes.value['system-' + system.id] = true
      }
      
      // 加载组件数据
      const templateComponentsData = await entityApis.template_component.getByTemplateId(templateData.id)
      componentsData.value = templateComponentsData
      if (templateComponentsData && templateComponentsData.list) {
        const componentPromises = templateComponentsData.list.map(tc => 
          entityApis.component.get(tc.componentId)
        )
        components.value = await Promise.all(componentPromises)
        
        // 初始化组件选择状态
        components.value.forEach(comp => {
          componentSelections.value[comp.id] = { enabled: comp.isRequired, quantity: 1 }
        })
      }
      
      // 更新组件配置
      updateComponentConfig()
    }
    
    // 检查是否有现有配置
    try {
      const config = await entityApis.configuration.getByTemplateId(
        projectData.templateId, 
        props.projectId
      )
      if (config && config.id > 0) {
        existingConfig.value = config
        hasExistingConfig.value = true
      }
    } catch (error) {
      console.log('无现有配置或加载失败', error)
      hasExistingConfig.value = false
    }
  } catch (error) {
    console.error('加载项目数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 更新参数配置
const updateParameterConfig = (type: 'project' | 'template' | 'system', values: any, systemId?: number) => {
  if (type === 'project') {
    valueConfig.value.project = values
  } else if (type === 'template') {
    valueConfig.value.template = values
  } else if (type === 'system' && systemId) {
    if (!valueConfig.value.systems) {
      valueConfig.value.systems = {}
    }
    valueConfig.value.systems[systemId] = values
  }
}

// 更新组件配置
const updateComponentConfig = () => {
  componentConfig.value = {}
  Object.entries(componentSelections.value).forEach(([id, selection]) => {
    componentConfig.value[Number(id)] = {
      enabled: selection.enabled,
      quantity: selection.quantity
    }
  })
}

// 加载已有配置
const loadExistingConfig = () => {
  if (!existingConfig.value) return
  
  try {
    // 解析valueConfig
    const parsedValueConfig = JSON.parse(existingConfig.value.valueConfig)
    valueConfig.value = parsedValueConfig
    
    // 解析componentConfig
    const parsedComponentConfig = JSON.parse(existingConfig.value.componentConfig) as Record<string, { enabled: boolean, quantity: number }>
    componentConfig.value = parsedComponentConfig
    
    // 更新组件选择状态
    Object.entries(parsedComponentConfig).forEach(([id, config]) => {
      const compId = Number(id)
      if (componentSelections.value[compId]) {
        componentSelections.value[compId] = {
          enabled: config.enabled,
          quantity: config.quantity
        }
      }
    })
  } catch (error) {
    console.error('解析已有配置失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  valueConfig.value = {
    project: {},
    template: {},
    systems: {}
  }
  
  // 重置组件选择状态
  components.value.forEach(comp => {
    componentSelections.value[comp.id] = { enabled: comp.isRequired, quantity: 1 }
  })
  
  // 更新组件配置
  updateComponentConfig()
}

// 处理表单提交
const handleSubmit = async () => {
  if (!project.value || !template.value) return
  
  try {
    isSaving.value = true
    
    // 创建配置对象
    const configuration: ZdConfiguration = {
      id: existingConfig.value?.id || 0,  // 使用0作为新配置的默认id
      name: `${project.value.name}-配置`,
      description: `${project.value.name}的配置`,
      isShow: true,
      template_id: template.value.id,
      project_id: props.projectId,
      lastVersionId: existingConfig.value?.lastVersionId || 1,
      valueConfig: JSON.stringify(valueConfig.value),
      componentConfig: JSON.stringify(componentConfig.value)
    }
    
    // 提交配置
    let savedConfig;
    if (configuration.id > 0) {
      // 更新现有配置
      savedConfig = await entityApis.configuration.update(configuration)
    } else {
      // 创建新配置
      savedConfig = await entityApis.configuration.create(configuration)
    }
    
    // 显示保存成功提示
    saveSuccessful.value = true;
    setTimeout(() => {
      saveSuccessful.value = false;
    }, 3000);
    
    // 发送提交事件
    emit('submit', savedConfig || configuration)
  } catch (error) {
    console.error('保存配置失败:', error)
    alert('保存配置失败，请查看控制台错误信息')
  } finally {
    isSaving.value = false
  }
}

// 监听对话框状态
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadData()
  }
})

// 初始化时加载数据
onMounted(() => {
  if (props.isOpen) {
    loadData()
  }
})
</script>

<style>
.resizable-dialog {
  resize: both;
  overflow: auto;
  min-width: 400px;
  min-height: 300px;
}
</style> 