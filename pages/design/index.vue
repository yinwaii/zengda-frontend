<template>
  <div class="h-full p-6">
    <h1 class="text-2xl font-bold mb-6">设计管理系统</h1>

    <div class="flex flex-col h-[calc(100%-4rem)]">
      <!-- 项目管理树 -->
      <design-dynamic-entity-tree :tree-data="projectTreeData" tree-title="项目管理" :default-expanded-keys="[1]"
        @save="handleProjectSave" @create="handleProjectCreate" class="h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/components/ui/toast'
import { createTreeNodeFactory, NODE_TYPES, generateCompositeId } from '~/utils/treeNodeFactory'
import { convertApiResponseIds, toApiId } from '~/utils/idConverter'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { VOPaged, VOList } from '~/models/entity'
import type { ExtendedZdTComponent } from '~/types/extended'

interface TComponent {
  id: number
  componentId: number
  templateId: number
  psystemId: number
  name?: string
  description?: string
}

// 扩展的TComponent接口，包含原始ID字段
interface ExtendedTComponent extends ZdTComponent {
  originalComponentId: number
  originalPsystemId: number
  originalTemplateId: number
}

const toast = useToast()
const entityApis = useEntityApis()

// 项目树数据
const projectTreeData = ref<TreeNodeData[]>([])
// 加载状态
const isLoading = ref(false)

// 各种实体数据转换为树节点函数
const projectTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.PROJECT])
const templateTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.TEMPLATE])
const psystemTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.PSYSTEM])
const componentTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.COMPONENT])

// 显示消息通知包装函数
const showMessage = {
  success: (message: string) => {
    toast.toast({
      title: "成功",
      description: message,
      variant: "default",
    })
  },
  error: (message: string) => {
    toast.toast({
      title: "错误",
      description: message,
      variant: "destructive",
    })
  }
}

/**
 * 加载项目数据并创建项目节点
 * @returns 项目节点数组
 */
const loadProjectByPage = async (): Promise<TreeNodeData[]> => {
  try {
    // 获取项目列表
    const response = await entityApis.project.getByPage(1, 10)

    // 确保响应和内容存在
    if (!response || !response.content) {
      console.warn('项目数据返回为空或格式不正确')
      return []
    }

    // 确保内容是数组且不为空
    if (!Array.isArray(response.content) || response.content.length === 0) {
      console.warn('项目列表为空')
      return []
    }

    // 打印原始项目数据
    console.log('原始项目数据:', JSON.stringify(response.content.slice(0, 1)))

    // 转换API响应中的ID为前端使用的复合ID
    const projectsWithCompositeIds = convertApiResponseIds(response.content, NODE_TYPES.PROJECT)

    // 打印转换后的项目数据
    console.log('转换后的项目数据:', JSON.stringify(projectsWithCompositeIds.slice(0, 1)))

    // 将项目转换为树节点
    const projectNodes = projectsWithCompositeIds.map((project: Record<string, any>) => {
      // 检查项目数据的有效性
      if (!project || typeof project.id === 'undefined' || project.id === null) {
        console.warn('发现无效项目数据', project)
        return null
      }

      const node = projectTreeNodeFactory(project)
      console.log('项目节点创建:', JSON.stringify({
        id: project.id,
        originalId: project.originalId,
        nodeId: node.id,
        nodeOriginalId: node.originalId
      }))
      return node
    }).filter(Boolean) // 过滤掉无效项目节点

    console.log('生成的项目节点:', projectNodes.length)
    return projectNodes
  } catch (err) {
    console.error('加载项目数据失败:', err)
    showMessage.error('加载项目数据失败')
    return []
  }
}

/**
 * 根据项目ID加载模板数据并挂载到项目节点下
 * @param projectNodes 项目节点数组
 * @returns 更新后的项目节点数组
 */
const loadTemplateByProject = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
  // 处理空数组入参
  if (!projectNodes || projectNodes.length === 0) {
    return projectNodes || []
  }

  try {
    // 对每个项目节点处理
    for (const projectNode of projectNodes) {
      // 增强检查，确保originalData存在且有效
      if (!projectNode || !projectNode.originalData) {
        console.warn('发现无效项目节点', projectNode)
        continue
      }

      const project = projectNode.originalData as Record<string, any>
      // 增强ID检查
      if (!project || typeof project.id === 'undefined' || project.id === null) {
        console.warn('发现无效项目数据', project)
        continue
      }

      // 获取项目关联的模板
      try {
        // 通过分页API查询所有模板，过滤得到关联的模板
        const response = await entityApis.template.getByPage(1, 100)

        if (response && response.content) {
          const templates = response.content

          if (templates.length) {
            // 转换API响应中的ID为前端使用的复合ID
            const templatesWithCompositeIds = convertApiResponseIds(templates, NODE_TYPES.TEMPLATE)

            // 将模板转换为树节点并添加到项目节点下
            const templateNodes = templatesWithCompositeIds.map((template: Record<string, any>) =>
              templateTreeNodeFactory(template)
            )

            console.log('生成的模板节点:', templateNodes)

            // 挂载模板节点到项目节点下
            projectNode.children = (projectNode.children || []).concat(templateNodes)
          }
        }
      } catch (err) {
        console.error(`加载项目 ${project.id} 的模板失败:`, err)
      }
    }

    return projectNodes
  } catch (err) {
    console.error('加载模板数据失败:', err)
    showMessage.error('加载模板数据失败')
    return projectNodes
  }
}

/**
 * 根据模板ID加载产品系统数据并挂载到模板节点下
 * @param projectNodes 项目节点数组
 * @returns 更新后的项目节点数组
 */
const loadPSystemByTemplate = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
  // 处理空数组入参
  if (!projectNodes || projectNodes.length === 0) {
    return projectNodes || []
  }

  try {
    // 遍历所有项目节点找出模板节点
    for (const projectNode of projectNodes) {
      if (!projectNode.children || projectNode.children.length === 0) continue

      // 遍历项目下的模板节点
      for (const templateNode of projectNode.children) {
        if (!templateNode || templateNode.type !== NODE_TYPES.TEMPLATE) continue

        // 增强检查，确保originalData存在且有效
        if (!templateNode.originalData) {
          console.warn('发现无效模板节点', templateNode)
          continue
        }

        const template = templateNode.originalData as Record<string, any>
        // 增强ID检查
        if (!template || typeof template.id === 'undefined' || template.id === null) {
          console.warn('发现无效模板数据', template)
          continue
        }

        try {
          // 提取原始ID用于API调用
          const templateId = toApiId(template.id)
          if (templateId === null) {
            console.warn(`无效的模板ID: ${template.id}`)
            continue
          }

          // 获取模板关联的产品系统
          const response = await entityApis.template_psystem.getByTemplateId(templateId)

          if (response && response.list && response.list.length) {
            // 转换API响应中的ID为前端使用的复合ID
            const psystemsWithCompositeIds = convertApiResponseIds(response.list, NODE_TYPES.PSYSTEM)

            // 将产品系统转换为树节点并添加到模板节点下
            const psystemNodes = psystemsWithCompositeIds.map((psystem: Record<string, any>) =>
              psystemTreeNodeFactory(psystem)
            )

            console.log('生成的产品系统节点:', psystemNodes)

            // 挂载产品系统节点到模板节点下
            templateNode.children = (templateNode.children || []).concat(psystemNodes)
          }
        } catch (err) {
          console.error(`加载模板 ${template.id} 的产品系统失败:`, err)
        }
      }
    }

    return projectNodes
  } catch (err) {
    console.error('加载产品系统数据失败:', err)
    showMessage.error('加载产品系统数据失败')
    return projectNodes
  }
}

/**
 * 根据模板ID加载组件数据并根据psystemId挂载到相应的系统节点下
 * @param projectNodes 项目节点数组
 * @returns 更新后的项目节点数组
 */
const loadComponentByTemplate = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
  // 处理空数组入参
  if (!projectNodes || projectNodes.length === 0) {
    return projectNodes || []
  }

  try {
    // 遍历所有项目节点找出模板节点
    for (const projectNode of projectNodes) {
      if (!projectNode.children || projectNode.children.length === 0) continue

      // 遍历项目下的模板节点
      for (const templateNode of projectNode.children) {
        if (!templateNode || templateNode.type !== NODE_TYPES.TEMPLATE) continue

        // 增强检查，确保originalData存在且有效
        if (!templateNode.originalData) {
          console.warn('发现无效模板节点', templateNode)
          continue
        }

        const template = templateNode.originalData as ZdTemplate
        // 增强ID检查
        if (!template || typeof template.id === 'undefined' || template.id === null) {
          console.warn('发现无效模板数据', template)
          continue
        }

        try {
          // 提取原始ID用于API调用
          const templateId = toApiId(template.id)
          if (templateId === null) {
            console.warn(`无效的模板ID: ${template.id}`)
            continue
          }

          // 获取模板关联的组件
          const response = await entityApis.template_component.getByTemplateId(templateId)

          if (response && response.list && response.list.length) {
            // 组件数据需要特殊处理，因为它们需要挂载到对应的系统节点下
            const tComponentsWithIds = response.list.map((tComponent: ZdTComponent) => {
              // 使用toApiId提取纯数字ID
              const componentId = toApiId(tComponent.componentId)
              const psystemId = toApiId(tComponent.psystemId)
              const templateId = toApiId(tComponent.templateId)

              console.log(`组件ID转换: ${JSON.stringify(tComponent)} -> ${componentId}, ${psystemId}, ${templateId}`);

              // 检查数字有效性
              if (componentId === null || psystemId === null || templateId === null) {
                console.warn('发现无效组件ID:', tComponent)
                return null
              }

              // 使用扩展类型
              return {
                ...tComponent,
                originalComponentId: componentId,
                originalPsystemId: psystemId,
                originalTemplateId: templateId
              } as ExtendedTComponent
            }).filter(Boolean) as ExtendedTComponent[] // 过滤无效组件

            // 创建组件节点
            const componentNodes = tComponentsWithIds.map((tComponent: ExtendedTComponent) => {
              // 构建ID时避免重复使用复合ID
              const compId = tComponent.originalComponentId
              console.log(`组件创建，使用纯数字ID: ${compId}`)

              // 为组件获取完整信息，并确保设置type属性
              return componentTreeNodeFactory({
                id: compId, // 使用纯数字ID，让工厂函数添加前缀
                originalId: compId,
                name: `组件${compId}`,
                description: tComponent.description,
                psystemId: tComponent.originalPsystemId,
                templateId: tComponent.originalTemplateId,
                originalTComponent: tComponent,
                type: NODE_TYPES.COMPONENT
              })
            })

            console.log('生成的组件节点:', componentNodes)

            // 根据psystemId将组件挂载到对应的系统节点下
            for (const componentNode of componentNodes) {
              // 确保componentNode和其originalData存在
              if (!componentNode || !componentNode.originalData) continue

              // 从原始数据中获取psystemId
              const component = componentNode.originalData
              const psystemId = Number(component.psystemId)

              // 确保psystemId存在且有效
              if (isNaN(psystemId)) {
                console.warn('发现无效psystemId:', component)
                continue
              }

              // 查找对应的系统节点
              const psystemNode = findPSystemNode(templateNode, psystemId)

              if (psystemNode) {
                // 挂载组件到系统节点
                psystemNode.children = (psystemNode.children || []).concat([componentNode])
              } else {
                console.warn(`未找到psystemId=${psystemId}的系统节点，组件${component.id}将挂载到模板节点`)
                // 如果找不到对应的系统节点，直接挂载到模板节点
                templateNode.children = (templateNode.children || []).concat([componentNode])
              }
            }
          }
        } catch (err) {
          console.error(`加载模板 ${template.id} 的组件失败:`, err)
        }
      }
    }

    return projectNodes
  } catch (err) {
    console.error('加载组件数据失败:', err)
    showMessage.error('加载组件数据失败')
    return projectNodes
  }
}

/**
 * 递归查找指定ID的产品系统节点
 * @param node 起始节点
 * @param psystemId 要查找的产品系统ID (原始数字ID)
 * @returns 找到的系统节点或null
 */
const findPSystemNode = (node: TreeNodeData, psystemId: number): TreeNodeData | null => {
  // 如果当前节点是系统节点且ID匹配
  if (node.type === NODE_TYPES.PSYSTEM && node.originalData) {
    // 从节点原始数据或originalId属性中获取系统ID
    let nodeOriginalId: number | null = null

    if (typeof node.originalId !== 'undefined') {
      // originalId应该已经是数字，但还是做一下验证
      nodeOriginalId = toApiId(node.originalId)
      console.log(`查找系统节点，从originalId获取: ${node.originalId} -> ${nodeOriginalId}`)
    } else if (node.originalData.id !== undefined) {
      // 从原始数据中提取ID
      nodeOriginalId = toApiId(node.originalData.id)
      console.log(`查找系统节点，从originalData.id获取: ${node.originalData.id} -> ${nodeOriginalId}`)
    }

    // 确保ID是有效的数字
    if (nodeOriginalId === psystemId) {
      console.log(`找到匹配的系统节点: ID=${psystemId}, 名称=${node.label}`)
      return node
    }
  }

  // 如果有子节点，递归查找
  if (node.children && node.children.length) {
    for (const child of node.children) {
      const found = findPSystemNode(child, psystemId)
      if (found) return found
    }
  }

  return null
}

/**
 * 加载完整的项目数据树，包括关联的模板、产品系统和组件
 */
const loadProjectData = async () => {
  try {
    isLoading.value = true
    console.log('开始加载项目数据')

    // 步骤1: 加载项目数据
    let nodes = await loadProjectByPage()
    console.log('步骤1完成: 已加载项目数据', nodes.length)

    // 如果没有获取到项目数据，显示提示并返回
    if (!nodes || nodes.length === 0) {
      showMessage.error('未找到项目数据')
      projectTreeData.value = []
      return
    }

    try {
      // 步骤2: 为项目加载模板数据
      nodes = await loadTemplateByProject(nodes)
      console.log('步骤2完成: 已加载模板数据')

      try {
        // 步骤3: 为模板加载产品系统数据
        nodes = await loadPSystemByTemplate(nodes)
        console.log('步骤3完成: 已加载产品系统数据')

        try {
          // 步骤4: 为模板加载组件数据并根据psystemId挂载到相应的系统节点下
          nodes = await loadComponentByTemplate(nodes)
          console.log('步骤4完成: 已加载组件数据')
        } catch (err) {
          console.error('加载组件数据失败:', err)
          // 继续使用已加载的数据，不中断整个流程
        }
      } catch (err) {
        console.error('加载产品系统数据失败:', err)
        // 继续使用已加载的数据，不中断整个流程
      }
    } catch (err) {
      console.error('加载模板数据失败:', err)
      // 继续使用已加载的项目数据，不中断整个流程
    }

    // 检查最终生成的树节点数据的ID格式
    const sampleNode = nodes[0];
    if (sampleNode) {
      console.log('样本节点ID检查:');
      console.log(`- id: ${sampleNode.id}, 类型: ${typeof sampleNode.id}`);
      console.log(`- originalId: ${sampleNode.originalId}, 类型: ${typeof sampleNode.originalId}`);

      if (sampleNode.children && sampleNode.children.length > 0) {
        const sampleChild = sampleNode.children[0];
        console.log(`- 子节点id: ${sampleChild.id}, 类型: ${typeof sampleChild.id}`);
        console.log(`- 子节点originalId: ${sampleChild.originalId}, 类型: ${typeof sampleChild.originalId}`);
      }
    }

    // 检查最终生成的树节点数据
    console.log('最终生成的树节点数据:', JSON.stringify(nodes, (key, value) => {
      // 过滤掉originalData属性以避免循环引用
      if (key === 'originalData') return '[originalData]'
      return value
    }, 2))

    // 更新树数据
    projectTreeData.value = nodes

    showMessage.success('加载数据成功')
  } catch (err) {
    console.error('加载数据失败:', err)
    showMessage.error('加载数据失败')
    projectTreeData.value = []
  } finally {
    isLoading.value = false
  }
}

// 处理项目保存
const handleProjectSave = async (data: any, type: string) => {
  try {
    // 确保数据中有原始ID
    const originalId = data.originalId || (data.originalData ? data.originalData.id : null);
    if (!originalId) {
      console.error('保存失败：无法获取原始ID');
      showMessage.error('保存失败：无法获取原始ID');
      return;
    }

    // 确保原始ID是数字类型
    const numOriginalId = Number(originalId);
    if (isNaN(numOriginalId)) {
      console.error(`保存失败：原始ID "${originalId}" 不是有效的数字`);
      showMessage.error('保存失败：原始ID不是有效的数字');
      return;
    }

    // 准备向API发送的数据 - 确保使用原始ID
    const apiData = {
      ...data,
      id: numOriginalId
    };

    // 如果有原始数据，合并其中的非ID字段
    if (data.originalData) {
      Object.keys(data.originalData).forEach(key => {
        if (key !== 'id' && !(key in apiData)) {
          apiData[key] = data.originalData[key];
        }
      });
    }

    // 删除可能造成API问题的字段
    delete apiData.originalData;
    delete apiData.originalId;
    delete apiData.children;
    delete apiData.components;
    delete apiData.type; // 删除前端特有的类型字段

    console.log(`准备保存${type}数据:`, apiData);

    // 根据不同类型调用相应的API
    if (type === NODE_TYPES.PROJECT) {
      await entityApis.project.update(apiData);
      showMessage.success('项目更新成功');
    } else if (type === NODE_TYPES.TEMPLATE) {
      await entityApis.template.update(apiData);
      showMessage.success('模板更新成功');
    } else if (type === NODE_TYPES.COMPONENT) {
      await entityApis.component.update(apiData);
      showMessage.success('组件更新成功');
    } else if (type === NODE_TYPES.PSYSTEM) {
      await entityApis.psystem.update(apiData);
      showMessage.success('系统更新成功');
    }

    // 重新加载数据
    await loadProjectData();
  } catch (err) {
    console.error('保存失败:', err);
    showMessage.error('保存失败');
  }
}

// 处理项目创建
const handleProjectCreate = async (data: any, type: string) => {
  try {
    // 准备向API发送的数据 - 确保不包含复合ID
    const apiData = { ...data };

    // 删除ID和其他与API不兼容的字段
    delete apiData.id;
    delete apiData.originalId;
    delete apiData.originalData;
    delete apiData.children;
    delete apiData.components;
    delete apiData.type; // 删除前端特有的类型字段

    console.log(`准备创建${type}数据:`, apiData);

    // 根据不同类型调用相应的API
    if (type === NODE_TYPES.PROJECT) {
      await entityApis.project.create(apiData);
      showMessage.success('项目创建成功');
    } else if (type === NODE_TYPES.TEMPLATE) {
      await entityApis.template.create(apiData);
      showMessage.success('模板创建成功');
    } else if (type === NODE_TYPES.COMPONENT) {
      await entityApis.component.create(apiData);
      showMessage.success('组件创建成功');
    } else if (type === NODE_TYPES.PSYSTEM) {
      await entityApis.psystem.create(apiData);
      showMessage.success('系统创建成功');
    }

    // 重新加载数据
    await loadProjectData();
  } catch (err) {
    console.error('创建失败:', err);
    showMessage.error('创建失败');
  }
}

// 初始化
onMounted(async () => {
  await loadProjectData()
})

// 页面元数据
definePageMeta({
  layout: 'default',
  middleware: ['auth'] as any, // 类型断言避免类型错误
})
</script>
