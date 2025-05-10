import { ref } from 'vue'
import { createTreeNodeFactory, generateCompositeId, getConfigurationTreeNodeStruct } from '~/utils/treeNodeFactory'
import { NODE_TYPES } from '~/models/entity/node-types'
import { convertApiResponseIds, toApiId } from '~/utils/idConverter'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'

/**
 * 实体树加载逻辑的Composable
 * 提供可复用的加载函数来构建项目管理树
 */
export const useEntityTree = () => {
  const entityApis = useEntityApis()
  const { success, error } = useMessage()

  // 加载状态
  const isLoading = ref(false)

  // 各种实体数据转换为树节点函数
  const projectTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.PROJECT])
  const templateTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.TEMPLATE])
  const psystemTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.PSYSTEM])
  const componentTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.COMPONENT])
  const bomTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.BOM])
  const specificationTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.SPECIFICATION])
  const configurationTreeNodeFactory = createTreeNodeFactory([NODE_TYPES.CONFIGURATION])

  /**
   * 加载项目数据并创建项目节点
   * @param page 页码
   * @param size 每页大小
   * @returns 项目节点数组
   */
  const loadProjectByPage = async (page: number = 1, size: number = 10): Promise<TreeNodeData[]> => {
    try {
      // 获取项目列表
      const response = await entityApis.project.getByPage(page, size)

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

      // 转换API响应中的ID为前端使用的复合ID
      const projectsWithCompositeIds = convertApiResponseIds(response.content, NODE_TYPES.PROJECT)

      // 将项目转换为树节点
      const projectNodes = projectsWithCompositeIds.map((project: Record<string, any>) => {
        // 检查项目数据的有效性
        if (!project || typeof project.id === 'undefined' || project.id === null) {
          console.warn('发现无效项目数据', project)
          return null
        }

        return projectTreeNodeFactory(project)
      }).filter(Boolean) // 过滤掉无效项目节点

      return projectNodes
    } catch (err) {
      console.error('加载项目数据失败:', err)
      error('加载项目数据失败')
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

        const project = projectNode.originalData as ZdProject
        // 增强ID检查
        if (!project || typeof project.id === 'undefined' || project.id === null) {
          console.warn('发现无效项目数据', project)
          continue
        }

        // 确保项目有关联的模板ID
        if (!project.templateId) {
          console.warn(`项目 ${project.id} 没有关联模板`)
          continue
        }

        try {
          // 直接使用templateId获取特定模板，而不是分页查询所有模板
          const template = await entityApis.template.get(project.templateId)

          if (template) {
            // 转换API响应中的ID为前端使用的复合ID
            const templateWithCompositeId = convertApiResponseIds([template], NODE_TYPES.TEMPLATE)[0]

            // 将模板转换为树节点
            const templateNode = templateTreeNodeFactory(templateWithCompositeId)

            // 挂载模板节点到项目节点下
            projectNode.children = (projectNode.children || []).concat([templateNode])
            console.log(`为项目 ${project.id} 添加了模板节点 ${template.id}`)
          } else {
            console.warn(`未找到项目 ${project.id} 关联的模板 ${project.templateId}`)
          }
        } catch (err) {
          console.error(`加载项目 ${project.id} 的模板失败:`, err)
        }
      }

      return projectNodes
    } catch (err) {
      console.error('加载模板数据失败:', err)
      error('加载模板数据失败')
      return projectNodes
    }
  }

  /**
   * 根据模板ID加载模块数据并挂载到模板节点下
   * @param projectNodes 项目节点数组
   * @returns 更新后的项目节点数组
   */
  const loadPSystemByTemplate = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!projectNodes || projectNodes.length === 0) {
      return projectNodes || []
    }

    try {
      // 第一步：遍历并收集所有模板节点
      const templateNodes = traverseNodesByTypes(projectNodes, [NODE_TYPES.TEMPLATE])
      console.log(`共找到 ${templateNodes.length} 个模板节点需要处理`)

      // 第二步：处理每个模板节点，加载模块数据
      for (const templateNode of templateNodes) {
        try {
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

          // 提取原始ID用于API调用
          const templateId = toApiId(template.id)
          if (templateId === null) {
            console.warn(`无效的模板ID: ${template.id}`)
            continue
          }

          // 获取模板关联的模块
          const response = await entityApis.template_psystem.getByTemplateId(templateId)

          if (response && response.list && response.list.length) {
            // 转换API响应中的ID为前端使用的复合ID
            const psystemsWithCompositeIds = convertApiResponseIds(response.list, NODE_TYPES.PSYSTEM)

            // 将模块转换为树节点并添加到模板节点下
            const psystemNodes = psystemsWithCompositeIds.map((psystem: Record<string, any>) =>
              psystemTreeNodeFactory(psystem)
            )

            // 挂载模块节点到模板节点下
            templateNode.children = (templateNode.children || []).concat(psystemNodes)
          }
        } catch (err) {
          console.error(`加载模板 ${templateNode.id} 的模块失败:`, err)
        }
      }

      console.log('模块数据加载完成')
      return projectNodes
    } catch (err) {
      console.error('加载模块数据失败:', err)
      error('加载模块数据失败')
      return projectNodes
    }
  }

  /**
   * 根据模块ID加载组件数据并挂载到相应的系统节点下
   * @param treeNodes 树节点数组
   * @returns 更新后的树节点数组
   */
  const loadComponentByPSystem = async (treeNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!treeNodes || treeNodes.length === 0) {
      return treeNodes || []
    }

    try {

      const psystemNodes = traverseNodesByTypes(treeNodes, [NODE_TYPES.PSYSTEM])
      console.log(`共找到 ${psystemNodes.length} 个PSystem节点需要处理`, psystemNodes)

      // 第二步：为每个PSystem节点加载组件数据
      for (const psystemNode of psystemNodes) {
        try {
          const psystemId = toApiId(psystemNode.id)
          if (!psystemId) continue

          // 获取该PSystem下的所有组件
          const response = await entityApis.psystem_component.getAll(toApiId(psystemId))
          console.log('response:', response)
          if (!response) continue

          const componentNodes: TreeNodeData[] = []
          // 转换组件数据为树节点
          for (const componentId of response) {
            const component = await entityApis.component.get(componentId)
            // 使用工厂函数创建组件节点
            const componentNode = componentTreeNodeFactory({
              ...component,
              id: component.id,
              type: NODE_TYPES.COMPONENT
            })
            componentNodes.push(componentNode)
          }
          console.log('componentNodes:', componentNodes)

          // 将组件节点添加到PSystem节点下
          psystemNode.children = (psystemNode.children || []).concat(componentNodes)
          console.log(`为PSystem ${psystemId} 添加了 ${componentNodes.length} 个组件节点`)
        } catch (err) {
          console.error(`加载PSystem ${psystemNode.id} 的组件数据失败:`, err)
        }
      }

      return treeNodes
    } catch (err) {
      console.error('加载组件数据失败:', err)
      error('加载组件数据失败')
      return treeNodes
    }
  }

  /**
   * 根据TComponent信息获取完整的Component详情并更新节点
   * @param projectNodes 项目节点数组
   * @returns 更新后的项目节点数组
   */
  const loadComponentByComponent = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!projectNodes || projectNodes.length === 0) {
      return projectNodes || []
    }

    try {
      // 第一步：遍历并收集所有组件节点
      const componentNodes = traverseNodesByTypes(projectNodes, [NODE_TYPES.COMPONENT])
      console.log(`共找到 ${componentNodes.length} 个组件节点需要处理`)

      // 第二步：处理每个组件节点，加载完整的组件信息
      for (const componentNode of componentNodes) {
        try {
          // 从节点原始数据中获取组件ID
          const component = componentNode.originalData
          if (!component || !component.id) {
            console.warn('发现无效组件数据', component)
            continue
          }

          // 提取原始ID用于API调用
          const componentId = toApiId(component.id)
          if (componentId === null) {
            console.warn(`无效的组件ID: ${component.id}`)
            continue
          }

          // 获取完整的组件信息
          const response = await entityApis.component.get(componentId)
          if (!response) {
            console.warn(`未找到组件详情，ID: ${componentId}`)
            continue
          }

          // 转换API响应中的ID为前端使用的复合ID
          const componentWithCompositeId = convertApiResponseIds([response], NODE_TYPES.COMPONENT)[0]

          // 使用新的组件信息创建更新后的节点
          const updatedNode = componentTreeNodeFactory(componentWithCompositeId)

          // 保留原节点的子节点
          updatedNode.children = componentNode.children || []

          // 更新原节点的数据
          Object.assign(componentNode, updatedNode)
          console.log(`已更新组件节点(ID: ${componentNode.id})的详细信息`)
        } catch (err) {
          console.error(`加载组件详情失败:`, err)
        }
      }

      console.log('组件详情数据加载完成')
      return projectNodes
    } catch (err) {
      console.error('加载组件详情数据失败:', err)
      error('加载组件详情数据失败')
      return projectNodes
    }
  }

  /**
   * 通用的节点遍历函数，可以查询指定类型的节点
   * @param treeNodes 要遍历的树节点数组
   * @param nodeTypes 要查询的节点类型数组
   * @returns 符合条件的节点数组
   */
  const traverseNodesByTypes = (treeNodes: TreeNodeData[], nodeTypes: string[]): TreeNodeData[] => {
    const resultList: TreeNodeData[] = [];

    // 创建DFS遍历函数
    const traverse = (node: TreeNodeData): void => {
      // 检查节点类型是否符合条件
      if (node.type && nodeTypes.includes(node.type)) {
        resultList.push(node);
      }

      // 递归遍历子节点
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    // 对输入的每个根节点进行DFS遍历
    for (const node of treeNodes) {
      traverse(node);
    }

    return resultList;
  };

  /**
   * 使用两步法加载组件的BOM数据
   * @param treeNodes 要遍历的树节点数组
   * @returns 更新后的树节点数组
   */
  const loadBomByComponent = async (treeNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!treeNodes || treeNodes.length === 0) {
      return treeNodes || [];
    }

    try {
      // 第一步：遍历并收集所有组件节点
      const componentNodes = traverseNodesByTypes(treeNodes, [NODE_TYPES.COMPONENT]);
      console.log(`共找到 ${componentNodes.length} 个组件节点需要处理`);

      // 第二步：处理每个组件节点，加载BOM数据
      for (const node of componentNodes) {
        try {
          // 从组件原始数据中获取BOM ID
          const componentId = toApiId(node.id);
          const bomIds = await entityApis.bom.getByComponentId(componentId);
          await Promise.all(bomIds.map(async (bomId: number) => {
            const bom = await entityApis.bom.get(bomId);
            if (bom) {
              const bomWithCompositeId = convertApiResponseIds([bom], NODE_TYPES.BOM)[0];
              const bomNode = bomTreeNodeFactory(bomWithCompositeId);
              node.children = (node.children || []).concat([bomNode]);
              console.log(`组件节点(ID: ${node.id})下BOM节点列表:`, node.children);
            }
          }))

        } catch (err) {
          console.error(`加载组件(ID: ${node.id})的BOM数据失败:`, err);
        }
      }

      console.log('BOM数据加载完成');
      return treeNodes;
    } catch (err) {
      console.error('加载BOM数据失败:', err);
      error('加载BOM数据失败');
      return treeNodes;
    }
  };

  /**
   * 根据模板ID加载规格数据并添加到模板和匹配的系统节点下
   * @param projectNodes 项目节点数组
   * @returns 更新后的项目节点数组
   */

  const loadSpecificationByTemplate = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!projectNodes || projectNodes.length === 0) {
      return projectNodes || []
    }

    try {
      const templateNodes = traverseNodesByTypes(projectNodes, [NODE_TYPES.TEMPLATE])
      console.log(`共找到 ${templateNodes.length} 个模板节点需要处理`)

      // 遍历所有项目节点
      for (const templateNode of templateNodes) {
        // if (!templateNode.children || templateNode.children.length === 0) continue
        const template = templateNode.originalData as ZdTemplate
        if (!template || !template.specId) continue

        const specification = await entityApis.specification.get(toApiId(template.specId) || 0)
        if (!specification) continue
        const specificationWithCompositeId = convertApiResponseIds([specification], NODE_TYPES.SPECIFICATION)[0]
        const specificationNode = specificationTreeNodeFactory(specificationWithCompositeId)
        templateNode.children = [specificationNode].concat(templateNode.children || [])
        console.log(`为模板 ${template.id} 添加了规格节点 ${specification.id}`)
      }
      return projectNodes
    } catch (err) {
      console.error('加载规格数据失败:', err)
      error('加载规格数据失败')
      return projectNodes
    }
  }

  /**
   * 递归提取规格子树中的所有规格ID
   * @param spec 规格数据
   * @returns 规格ID数组
   */
  const extractSpecIds = (spec: any): number[] => {
    if (!spec) return []

    // 提取当前规格ID
    const result: number[] = []
    const currentId = toApiId(spec.id)
    if (currentId !== null) {
      result.push(currentId)
    }

    // 递归处理子规格
    if (spec.children && spec.children.length) {
      for (const child of spec.children) {
        result.push(...extractSpecIds(child))
      }
    }

    return result
  }

  /**
   * 递归查找指定ID的规格节点
   * @param spec 规格数据
   * @param id 要查找的规格ID
   * @returns 找到的规格数据或null
   */
  const findSpecById = (spec: any, id: number): any => {
    if (!spec) return null

    // 检查当前规格ID
    const currentId = toApiId(spec.id)
    if (currentId === id) {
      return spec
    }

    // 递归处理子规格
    if (spec.children && spec.children.length) {
      for (const child of spec.children) {
        const found = findSpecById(child, id)
        if (found) return found
      }
    }

    return null
  }

  /**
   * 递归查找指定ID的模块节点
   * @param node 起始节点
   * @param psystemId 要查找的模块ID (原始数字ID)
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
      } else if (node.originalData.id !== undefined) {
        // 从原始数据中提取ID
        nodeOriginalId = toApiId(node.originalData.id)
      }

      // 确保ID是有效的数字
      if (nodeOriginalId === psystemId) {
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
   * 根据项目ID加载配置数据并挂载到项目节点下
   * @param projectNodes 项目节点数组
   * @returns 更新后的项目节点数组
   */
  // const loadConfigurationByProject = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
  //   if (!projectNodes || projectNodes.length === 0) {
  //     return projectNodes || []
  //   }

  //   try {

      
  // }
  const loadConfigurationByProject = async (projectNodes: TreeNodeData[]): Promise<TreeNodeData[]> => {
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

        const project = projectNode.originalData as ZdProject
        // 增强ID检查
        if (!project || typeof project.id === 'undefined' || project.id === null) {
          console.warn('发现无效项目数据', project)
          continue
        }

        // 确保项目有关联的模板ID
        if (!project.templateId) {
          console.warn(`项目 ${project.id} 没有关联模板`)
          continue
        }

        try {
          // 获取项目关联的配置
          const configId = toApiId(project.id)
          const configResponse = await entityApis.configuration.getByTemplateId(project.templateId, configId ?? 0)

          if (configResponse && configResponse.list && configResponse.list.length > 0) {
            // 遍历配置列表，为每个配置创建树节点
            for (const config of configResponse.list) {
              // 转换API响应中的ID为前端使用的复合ID
              const configWithCompositeId = {
                ...config,
                id: generateCompositeId(NODE_TYPES.CONFIGURATION, config.id)
              }

              // 将配置转换为树节点
              const configNode = configurationTreeNodeFactory(configWithCompositeId)

              // 将配置节点插入到项目子节点的最前面
              projectNode.children = [configNode].concat(projectNode.children || [])
              console.log(`为项目 ${project.id} 添加了配置节点 ${config.id}`)
            }
          } else {
            console.warn(`未找到项目 ${project.id} 关联的配置`)
          }
        } catch (err) {
          console.error(`加载项目 ${project.id} 的配置失败:`, err)
        }
      }

      return projectNodes
    } catch (err) {
      console.error('加载配置数据失败:', err)
      error('加载配置数据失败')
      return projectNodes
    }
  }

  /**
   * 完整加载实体树数据，包括项目、模板、系统、组件、BOM和规格等
   * @param options 可选的加载选项
   * @returns 树节点数据
   */
  const loadEntityTree = async (options: {
    page?: number,
    size?: number,
    loadTemplates?: boolean,
    loadSystems?: boolean,
    loadComponents?: boolean,
    loadFullComponents?: boolean,
    loadBoms?: boolean,
    loadSpecifications?: boolean
  } = {}): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    const {
      page = 1,
      size = 10,
      loadTemplates = true,
      loadSystems = true,
      loadComponents = true,
      loadFullComponents = true,
      loadBoms = true,
      loadSpecifications = true
    } = options

    try {
      isLoading.value = true
      console.log('开始加载实体树数据')

      // 步骤1: 加载项目数据
      let nodes = await loadProjectByPage(page, size)
      console.log('步骤1完成: 已加载项目数据', nodes.length)

      // 如果没有获取到项目数据，显示提示并返回
      if (!nodes || nodes.length === 0) {
        error('未找到项目数据')
        return { treeData: [], loading: false }
      }

      if (loadTemplates) {
        try {
          // 步骤2: 为项目加载模板数据
          nodes = await loadTemplateByProject(nodes)
          console.log('步骤2完成: 已加载模板数据')

          if (loadSystems) {
            try {
              // 步骤3: 为模板加载模块数据
              nodes = await loadPSystemByTemplate(nodes)
              console.log('步骤3完成: 已加载模块数据')
            } catch (err) {
              console.error('加载模块数据失败:', err)
            }
          }

          if (loadComponents) {
            try {
              // 步骤4: 为模板加载组件数据并根据psystemId挂载到相应的系统节点下
              nodes = await loadComponentByPSystem(nodes)
              console.log('步骤4完成: 已加载组件数据')

              if (loadFullComponents) {
                try {
                  // 步骤5: 获取完整的组件信息并更新组件节点
                  nodes = await loadComponentByComponent(nodes)
                  console.log('步骤5完成: 已加载完整组件信息')
                } catch (err) {
                  console.error('加载完整组件信息失败:', err)
                }
              }

              if (loadBoms) {
                try {
                  // 步骤6: 为组件加载BOM数据
                  nodes = await loadBomByComponent(nodes)
                  console.log('步骤6完成: 已加载BOM数据')
                } catch (err) {
                  console.error('加载BOM数据失败:', err)
                }
              }
            } catch (err) {
              console.error('加载组件数据失败:', err)
            }
          }

          if (loadSpecifications) {
            try {
              // 步骤7: 为模板和系统加载规格数据
              nodes = await loadSpecificationByTemplate(nodes)
              console.log('步骤7完成: 已加载规格数据')
            } catch (err) {
              console.error('加载规格数据失败:', err)
            }
          }
        } catch (err) {
          console.error('加载模板数据失败:', err)
        }
      }

      success('加载数据成功')
      return { treeData: nodes, loading: false }
    } catch (err) {
      console.error('加载实体树数据失败:', err)
      error('加载数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据ID加载特定模板
   * @param templateId 模板ID
   * @returns 模板节点树
   */
  const loadTemplateById = async (templateId: number): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    try {
      isLoading.value = true
      console.log(`开始加载模板(ID: ${templateId})`)

      // 获取模板数据
      const template = await entityApis.template.get(templateId)
      if (!template) {
        error(`未找到ID为${templateId}的模板`)
        return { treeData: [], loading: false }
      }

      // 转换为树节点结构
      const templateWithCompositeId = {
        ...template,
        id: generateCompositeId(NODE_TYPES.TEMPLATE, template.id)
      }
      const templateNode = templateTreeNodeFactory(templateWithCompositeId)

      // 返回仅包含模板节点的树
      return { treeData: [templateNode], loading: false }
    } catch (err) {
      console.error(`加载模板(ID: ${templateId})失败:`, err)
      error('加载模板数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据ID加载特定项目
   * @param projectId 项目ID
   * @returns 项目节点树
   */
  const loadProjectById = async (projectId: number): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    try {
      isLoading.value = true
      console.log(`开始加载项目(ID: ${projectId})`)

      // 获取项目数据
      const project = await entityApis.project.get(projectId)
      if (!project) {
        error(`未找到ID为${projectId}的项目`)
        return { treeData: [], loading: false }
      }

      // 转换为树节点结构
      const projectWithCompositeId = {
        ...project,
        id: generateCompositeId(NODE_TYPES.PROJECT, project.id)
      }
      const projectNode = projectTreeNodeFactory(projectWithCompositeId)

      // 返回仅包含项目节点的树
      return { treeData: [projectNode], loading: false }
    } catch (err) {
      console.error(`加载项目(ID: ${projectId})失败:`, err)
      error('加载项目数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载指定节点的子元素
   * @param treeData 初始树数据
   * @param options 可选的加载选项
   * @returns 更新后的树节点数据
   */
  const loadEntityChildren = async (
    treeData: TreeNodeData[],
    options: {
      loadSystems?: boolean,
      loadComponents?: boolean,
      loadFullComponents?: boolean,
      loadBoms?: boolean,
      loadSpecifications?: boolean
    } = {}
  ): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    const {
      loadSystems = true,
      loadComponents = true,
      loadFullComponents = true,
      loadBoms = true,
      loadSpecifications = true
    } = options

    try {
      isLoading.value = true
      console.log('开始加载实体子元素')

      // 临时包装到root节点
      let nodes: TreeNodeData[] = [{
        id: 'temp-root' as string | number,
        label: 'Root',
        children: [...treeData],
        type: 'root'
      } as TreeNodeData]

      // 在加载前收集现有ID，用于防止重复添加
      const collectExistingIds = (node: TreeNodeData, type: string): Set<string | number> => {
        const ids = new Set<string | number>()

        // 检查当前节点是否匹配类型
        if (node.type === type && node.id) {
          ids.add(node.id)
        }

        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            const childIds = collectExistingIds(child, type)
            childIds.forEach(id => ids.add(id))
          }
        }

        return ids
      }

      // 收集所有现有节点ID
      const existingPSystemIds = collectExistingIds(nodes[0], NODE_TYPES.PSYSTEM)
      const existingComponentIds = collectExistingIds(nodes[0], NODE_TYPES.COMPONENT)

      console.log(`初始状态: 已有 ${existingPSystemIds.size} 个模块节点, ${existingComponentIds.size} 个组件节点`)

      if (loadSystems && existingPSystemIds.size === 0) {
        try {
          // 步骤1: 加载模块数据
          nodes = await loadPSystemByTemplate(nodes)
          console.log('步骤1完成: 已加载模块数据')
        } catch (err) {
          console.error('加载模块数据失败:', err)
        }
      } else if (existingPSystemIds.size > 0) {
        console.log('跳过加载模块数据: 已存在模块节点')
      }

      if (loadComponents) {
        // 重新检查现有组件节点
        const currentComponentIds = collectExistingIds(nodes[0], NODE_TYPES.COMPONENT)

        if (currentComponentIds.size === 0) {
          try {
            // 步骤2: 加载组件数据
            nodes = await loadComponentByPSystem(nodes)
            console.log('步骤2完成: 已加载组件数据')
          } catch (err) {
            console.error('加载组件数据失败:', err)
          }
        } else {
          console.log('跳过加载组件数据: 已存在组件节点')
        }

        if (loadFullComponents) {
          try {
            // 步骤3: 获取完整的组件信息
            nodes = await loadComponentByComponent(nodes)
            console.log('步骤3完成: 已加载完整组件信息')
          } catch (err) {
            console.error('加载完整组件信息失败:', err)
          }
        }

        if (loadBoms) {
          try {
            // 步骤4: 加载BOM数据
            nodes = await loadBomByComponent(nodes)
            console.log('步骤4完成: 已加载BOM数据')
          } catch (err) {
            console.error('加载BOM数据失败:', err)
          }
        }
      }

      if (loadSpecifications) {
        try {
          // 步骤5: 加载规格数据
          nodes = await loadSpecificationByTemplate(nodes)
          console.log('步骤5完成: 已加载规格数据')
        } catch (err) {
          console.error('加载规格数据失败:', err)
        }
      }

      // 解包临时root节点的子元素
      const resultData = nodes[0].children || []

      success('加载实体子元素成功')
      return { treeData: resultData, loading: false }
    } catch (err) {
      console.error('加载实体子元素失败:', err)
      error('加载数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据ID加载特定的模块
   * @param psystemId 模块ID
   * @returns 模块节点树
   */
  const loadPSystemById = async (psystemId: number): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    try {
      isLoading.value = true
      console.log(`开始加载模块(ID: ${psystemId})`)

      // 获取模块数据
      const psystem = await entityApis.psystem.get(psystemId)
      if (!psystem) {
        error(`未找到ID为${psystemId}的模块`)
        return { treeData: [], loading: false }
      }

      // 转换为树节点结构
      const psystemWithCompositeId = {
        ...psystem,
        id: generateCompositeId(NODE_TYPES.PSYSTEM, psystem.id)
      }
      const psystemNode = psystemTreeNodeFactory(psystemWithCompositeId)

      // 返回仅包含模块节点的树
      return { treeData: [psystemNode], loading: false }
    } catch (err) {
      console.error(`加载模块(ID: ${psystemId})失败:`, err)
      error('加载模块数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据模块加载规格信息
   * @param treeData 初始的树数据（包含PSystem节点）
   * @returns 更新后的树数据，PSystem节点下挂载了规格信息
   */
  const loadSpecificationByPSystem = async (treeData: TreeNodeData[]): Promise<TreeNodeData[]> => {
    // 处理空数组入参
    if (!treeData || treeData.length === 0) {
      return treeData || []
    }

    try {
      isLoading.value = true
      console.log('开始加载模块相关的规格数据')
      const psystemNodes = traverseNodesByTypes(treeData, [NODE_TYPES.PSYSTEM])
      console.log(`共找到 ${psystemNodes.length} 个模块节点需要处理`)

      for (const psystemNode of psystemNodes) {
        // if (!psystemNode.children || psystemNode.children.length === 0) continue
        const psystem = psystemNode.originalData as Record<string, any>
        if (!psystem || !psystem.specId) continue
        console.log('psystem', psystem)
        const specification = await entityApis.specification.get(toApiId(psystem.specId) || 0)
        if (!specification) continue
        const specificationWithCompositeId = convertApiResponseIds([specification], NODE_TYPES.SPECIFICATION)[0]
        const specificationNode = specificationTreeNodeFactory(specificationWithCompositeId)
        psystemNode.children = [specificationNode].concat(psystemNode.children || [])
        console.log(`为模块 ${psystem.id} 添加了规格节点 ${specification.id}`)
      }

      return treeData 
    } catch (err) {
      console.error('加载模块规格数据失败:', err)
      error('加载规格数据失败')
      return treeData
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据ID加载特定的组件
   * @param componentId 组件ID
   * @returns 组件节点树
   */
  const loadComponentById = async (componentId: number): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    try {
      isLoading.value = true
      console.log(`开始加载组件(ID: ${componentId})`)

      // 获取组件数据
      const component = await entityApis.component.get(componentId)
      if (!component) {
        error(`未找到ID为${componentId}的组件`)
        return { treeData: [], loading: false }
      }

      // 转换为树节点结构
      const componentWithCompositeId = {
        ...component,
        id: generateCompositeId(NODE_TYPES.COMPONENT, component.id)
      }
      const componentNode = componentTreeNodeFactory(componentWithCompositeId)

      // 返回仅包含组件节点的树
      return { treeData: [componentNode], loading: false }
    } catch (err) {
      console.error(`加载组件(ID: ${componentId})失败:`, err)
      error('加载组件数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    isLoading,

    // 核心功能
    loadEntityTree,
    loadTemplateById,
    loadEntityChildren,
    loadProjectById,
    loadPSystemById,
    loadComponentById,

    // 单步加载函数
    loadProjectByPage,
    loadTemplateByProject,
    loadPSystemByTemplate,
    loadComponentByPSystem,
    loadComponentByComponent,
    loadBomByComponent,
    loadSpecificationByTemplate,
    loadSpecificationByPSystem,
    loadConfigurationByProject,

    // 工具函数
    findPSystemNode,
    extractSpecIds,
    findSpecById,

    // 工厂函数
    projectTreeNodeFactory,
    templateTreeNodeFactory,
    psystemTreeNodeFactory,
    componentTreeNodeFactory,
    bomTreeNodeFactory,
    specificationTreeNodeFactory,
    configurationTreeNodeFactory
  }
} 