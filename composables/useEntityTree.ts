import { ref } from 'vue'
import { createTreeNodeFactory, NODE_TYPES, generateCompositeId } from '~/utils/treeNodeFactory'
import { convertApiResponseIds, toApiId } from '~/utils/idConverter'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { ZdBom } from '~/models/entity/bom'
import type { ZdSpecification } from '~/models/entity/specification'
import type { VOPaged, VOList } from '~/models/entity'
import type { ExtendedZdTComponent } from '~/types/extended'

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
      // 第一步：遍历并收集所有模板节点
      const templateNodes = traverseNodesByTypes(projectNodes, [NODE_TYPES.TEMPLATE])
      console.log(`共找到 ${templateNodes.length} 个模板节点需要处理`)

      // 第二步：处理每个模板节点，加载产品系统数据
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

          // 获取模板关联的产品系统
          const response = await entityApis.template_psystem.getByTemplateId(templateId)

          if (response && response.list && response.list.length) {
            // 转换API响应中的ID为前端使用的复合ID
            const psystemsWithCompositeIds = convertApiResponseIds(response.list, NODE_TYPES.PSYSTEM)

            // 将产品系统转换为树节点并添加到模板节点下
            const psystemNodes = psystemsWithCompositeIds.map((psystem: Record<string, any>) =>
              psystemTreeNodeFactory(psystem)
            )

            // 挂载产品系统节点到模板节点下
            templateNode.children = (templateNode.children || []).concat(psystemNodes)
          }
        } catch (err) {
          console.error(`加载模板 ${templateNode.id} 的产品系统失败:`, err)
        }
      }

      console.log('产品系统数据加载完成')
      return projectNodes
    } catch (err) {
      console.error('加载产品系统数据失败:', err)
      error('加载产品系统数据失败')
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
      // 第一步：遍历并收集所有模板节点
      const templateNodes = traverseNodesByTypes(projectNodes, [NODE_TYPES.TEMPLATE])
      console.log(`共找到 ${templateNodes.length} 个模板节点需要处理`)

      // 第二步：处理每个模板节点，加载组件数据
      for (const templateNode of templateNodes) {
        try {
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
              } as ExtendedZdTComponent
            }).filter(Boolean) as ExtendedZdTComponent[] // 过滤无效组件

            // 创建组件节点
            const componentNodes = tComponentsWithIds.map((tComponent: ExtendedZdTComponent) => {
              // 构建ID时避免重复使用复合ID
              const compId = tComponent.originalComponentId

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
          console.error(`加载模板 ${templateNode.id} 的组件失败:`, err)
        }
      }
      
      console.log('组件数据加载完成')
      return projectNodes
    } catch (err) {
      console.error('加载组件数据失败:', err)
      error('加载组件数据失败')
      return projectNodes
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
          const component = node.originalData;
          if (component && component.bomId) {
            // 提取原始ID用于API调用
            const bomId = toApiId(component.bomId);
            if (bomId === null) {
              console.warn(`无效的BOM ID: ${component.bomId}`);
            } else {
              // 获取BOM信息
              console.log(`加载组件(ID: ${component.id})的BOM数据(ID: ${bomId})`);
              const response = await entityApis.bom.get(bomId);
              
              if (response) {
                // 转换API响应中的ID为前端使用的复合ID
                const bomWithCompositeId = convertApiResponseIds([response], NODE_TYPES.BOM)[0];
                
                // 创建BOM节点
                const bomNode = bomTreeNodeFactory(bomWithCompositeId);
                
                // 将BOM数据存储到组件节点，方便后续使用
                node.bomData = response;
                
                // 将BOM节点添加到组件节点的子节点列表，避免重复添加
                if (!node.children) {
                  node.children = [];
                }
                
                // 检查是否已存在同ID的BOM节点，避免重复
                const existingBomNode = node.children.find(child => 
                  child.type === NODE_TYPES.BOM && child.originalData?.id === bomWithCompositeId.id
                );
                
                if (!existingBomNode) {
                  node.children.push(bomNode);
                  console.log(`已将BOM节点(ID: ${bomNode.id})添加到组件节点(ID: ${node.id})下`);
                } else {
                  console.log(`组件节点(ID: ${node.id})下已存在BOM节点(ID: ${bomNode.id})，跳过添加`);
                }
              }
            }
          }
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
      console.warn('loadSpecificationByTemplate: 项目节点数组为空')
      return projectNodes || []
    }

    try {
      console.log(`loadSpecificationByTemplate: 开始处理 ${projectNodes.length} 个项目节点的规格书数据`)
      console.log('DEBUG: 模板节点结构:', JSON.stringify(projectNodes.map(node => ({
        id: node.id,
        type: node.type,
        children: node.children?.map(child => ({
          id: child.id,
          type: child.type,
          specId: child.originalData?.specId
        }))
      })), null, 2))
      
      // 遍历所有项目节点
      for (const projectNode of projectNodes) {
        if (!projectNode.children || projectNode.children.length === 0) {
          console.log(`loadSpecificationByTemplate: 项目节点 ${projectNode.id} 没有子节点，跳过`)
          continue
        }

        console.log(`loadSpecificationByTemplate: 处理项目节点 ${projectNode.id} 的子节点`)
        // 遍历项目下的模板节点
        for (const templateNode of projectNode.children) {
          if (!templateNode || templateNode.type !== NODE_TYPES.TEMPLATE) {
            console.log(`loadSpecificationByTemplate: 跳过非模板节点 ${templateNode?.id}`)
            continue
          }

          console.log(`loadSpecificationByTemplate: 处理模板节点 ${templateNode.id}`)
          // 从模板原始数据中获取规格ID
          const template = templateNode.originalData as ZdTemplate
          if (!template) {
            console.warn(`loadSpecificationByTemplate: 模板节点 ${templateNode.id} 没有原始数据`)
            continue
          }
          
          console.log(`DEBUG: 模板数据:`, template)
          if (!template.specId) {
            console.warn(`loadSpecificationByTemplate: 模板 ${template.id} 没有关联规格ID`)
            continue
          }

          // 提取原始ID用于API调用
          const specId = toApiId(template.specId)
          if (specId === null) {
            console.warn(`loadSpecificationByTemplate: 无效的规格ID: ${template.specId}`)
            continue
          }

          console.log(`loadSpecificationByTemplate: 开始获取规格ID=${specId}的数据`)
          try {
            // 获取规格子树
            const response = await entityApis.specification.getAll(specId)
            if (!response) {
              console.warn(`loadSpecificationByTemplate: 获取规格ID=${specId}的数据为空`)
              continue
            }

            console.log(`loadSpecificationByTemplate: 成功获取规格数据:`, response)
            // 转换API响应中的ID为前端使用的复合ID
            const specWithCompositeId = convertApiResponseIds([response], NODE_TYPES.SPECIFICATION)[0]
            console.log(`loadSpecificationByTemplate: 转换后的规格数据:`, specWithCompositeId)

            // 创建规格节点
            const specNode = specificationTreeNodeFactory(specWithCompositeId)
            console.log(`loadSpecificationByTemplate: 创建的规格节点:`, specNode)

            // 检查是否已存在同ID的规格节点，避免重复
            const existingSpecNode = templateNode.children?.find(child => 
              child.type === NODE_TYPES.SPECIFICATION && child.originalData?.id === specWithCompositeId.id
            )
            
            if (existingSpecNode) {
              console.log(`loadSpecificationByTemplate: 模板节点 ${templateNode.id} 下已存在规格节点 ${existingSpecNode.id}，跳过添加`)
            } else {
              // 将规格节点添加为模板节点的第一个子节点
              templateNode.children = [specNode].concat(templateNode.children || [])
              console.log(`loadSpecificationByTemplate: 已将规格节点(ID: ${specNode.id})添加到模板节点(ID: ${templateNode.id})下`)
              console.log(`DEBUG: 添加规格节点后的模板节点:`, {
                id: templateNode.id,
                type: templateNode.type,
                children: templateNode.children.map(child => ({
                  id: child.id,
                  type: child.type
                }))
              })
            }

            // 获取规格子树中的所有规格节点ID
            const specIds = extractSpecIds(specWithCompositeId)
            console.log(`loadSpecificationByTemplate: 规格树包含以下ID: [${specIds.join(', ')}]`)

            // 遍历模板下的所有系统节点，检查是否需要添加规格节点
            for (const psystemNode of (templateNode.children || [])) {
              if (!psystemNode || psystemNode.type !== NODE_TYPES.PSYSTEM) continue

              // 从系统原始数据中获取规格ID
              const psystem = psystemNode.originalData as ZdPSystem
              if (!psystem || !psystem.specId) {
                console.log(`loadSpecificationByTemplate: 系统节点 ${psystemNode.id} 没有关联规格ID`)
                continue
              }

              // 提取原始ID用于匹配
              const psystemSpecId = toApiId(psystem.specId)
              if (psystemSpecId === null) {
                console.warn(`loadSpecificationByTemplate: 系统 ${psystem.id} 的规格ID无效: ${psystem.specId}`)
                continue
              }

              console.log(`loadSpecificationByTemplate: 系统 ${psystem.id} 关联规格ID ${psystemSpecId}，检查是否匹配`)
              // 检查系统的规格ID是否在规格子树中
              if (specIds.includes(psystemSpecId)) {
                // 查找匹配的规格节点
                const matchedSpec = findSpecById(specWithCompositeId, psystemSpecId)
                if (matchedSpec) {
                  console.log(`loadSpecificationByTemplate: 找到匹配的规格节点:`, matchedSpec)
                  // 创建规格节点的副本
                  const specNodeCopy = specificationTreeNodeFactory(matchedSpec)
                  
                  // 检查是否已存在同ID的规格节点，避免重复
                  const existingPsysSpecNode = psystemNode.children?.find(child => 
                    child.type === NODE_TYPES.SPECIFICATION && child.originalData?.id === matchedSpec.id
                  )
                  
                  if (existingPsysSpecNode) {
                    console.log(`loadSpecificationByTemplate: 系统节点 ${psystemNode.id} 下已存在规格节点 ${existingPsysSpecNode.id}，跳过添加`)
                  } else {
                    // 将规格节点副本添加为系统节点的第一个子节点
                    psystemNode.children = [specNodeCopy].concat(psystemNode.children || [])
                    console.log(`loadSpecificationByTemplate: 已将规格节点(ID: ${specNodeCopy.id})添加到系统节点(ID: ${psystemNode.id})下`)
                  }
                } else {
                  console.warn(`loadSpecificationByTemplate: 未找到系统 ${psystem.id} 关联的规格 ${psystemSpecId}`)
                }
              } else {
                console.log(`loadSpecificationByTemplate: 系统 ${psystem.id} 的规格ID ${psystemSpecId} 不在规格树中`)
              }
            }
          } catch (err) {
            console.error(`loadSpecificationByTemplate: 加载模板 ${template.id} 的规格失败:`, err)
          }
        }
      }

      console.log('loadSpecificationByTemplate: 规格数据加载完成')
      return projectNodes
    } catch (err) {
      console.error('loadSpecificationByTemplate: 加载规格数据失败:', err)
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
              // 步骤3: 为模板加载产品系统数据
              nodes = await loadPSystemByTemplate(nodes)
              console.log('步骤3完成: 已加载产品系统数据')
            } catch (err) {
              console.error('加载产品系统数据失败:', err)
            }
          }

          if (loadComponents) {
            try {
              // 步骤4: 为模板加载组件数据并根据psystemId挂载到相应的系统节点下
              nodes = await loadComponentByTemplate(nodes)
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
      console.log('loadEntityChildren: 开始加载实体子元素，输入节点:', treeData)
      
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

      // 优先加载规格书数据，避免后续步骤过滤掉规格书节点
      if (loadSpecifications) {
        try {
          // 先加载规格数据，这是最关键的步骤
          console.log('loadEntityChildren: 开始加载规格数据 - 优先处理')
          nodes = await loadSpecificationByTemplate(nodes)
          console.log('loadEntityChildren: 规格数据加载完成 - 优先处理')
          
          // 检查规格书节点
          const specNodes = traverseNodesByTypes([nodes[0]], [NODE_TYPES.SPECIFICATION])
          console.log(`loadEntityChildren: 规格书加载后，共有 ${specNodes.length} 个规格书节点`)
          if (specNodes.length > 0) {
            console.log('loadEntityChildren: 找到的规格书节点:', specNodes.map(node => ({
              id: node.id,
              type: node.type,
              parentType: node.parent?.type || 'unknown'
            })))
          }
        } catch (err) {
          console.error('loadEntityChildren: 加载规格数据失败:', err)
        }
      }
      
      // 收集所有现有节点ID
      const existingPSystemIds = collectExistingIds(nodes[0], NODE_TYPES.PSYSTEM)
      const existingComponentIds = collectExistingIds(nodes[0], NODE_TYPES.COMPONENT)
      
      console.log(`loadEntityChildren: 初始状态: 已有 ${existingPSystemIds.size} 个产品系统节点, ${existingComponentIds.size} 个组件节点`)

      // 检查是否有模板节点
      const templateNodes = traverseNodesByTypes([nodes[0]], [NODE_TYPES.TEMPLATE])
      console.log(`loadEntityChildren: 初始模板节点数量: ${templateNodes.length}`)
      
      if (templateNodes.length === 0) {
        console.warn('loadEntityChildren: 没有找到模板节点，可能需要先加载模板')
      }

      if (loadSystems && existingPSystemIds.size === 0) {
        try {
          // 步骤1: 加载产品系统数据
          console.log('loadEntityChildren: 开始加载产品系统数据')
          nodes = await loadPSystemByTemplate(nodes)
          console.log('loadEntityChildren: 步骤1完成: 已加载产品系统数据')
          
          // 再次检查系统节点
          const pSystemNodes = traverseNodesByTypes([nodes[0]], [NODE_TYPES.PSYSTEM])
          console.log(`loadEntityChildren: 产品系统加载后，共有 ${pSystemNodes.length} 个系统节点`)
        } catch (err) {
          console.error('loadEntityChildren: 加载产品系统数据失败:', err)
        }
      } else if (existingPSystemIds.size > 0) {
        console.log('loadEntityChildren: 跳过加载产品系统数据: 已存在产品系统节点')
      }

      if (loadComponents) {
        // 重新检查现有组件节点
        const currentComponentIds = collectExistingIds(nodes[0], NODE_TYPES.COMPONENT)
        
        if (currentComponentIds.size === 0) {
          try {
            // 步骤2: 加载组件数据
            console.log('loadEntityChildren: 开始加载组件数据')
            nodes = await loadComponentByTemplate(nodes)
            console.log('loadEntityChildren: 步骤2完成: 已加载组件数据')
            
            // 再次检查组件节点
            const componentNodes = traverseNodesByTypes([nodes[0]], [NODE_TYPES.COMPONENT])
            console.log(`loadEntityChildren: 组件加载后，共有 ${componentNodes.length} 个组件节点`)
          } catch (err) {
            console.error('loadEntityChildren: 加载组件数据失败:', err)
          }
        } else {
          console.log('loadEntityChildren: 跳过加载组件数据: 已存在组件节点')
        }
          
        if (loadFullComponents) {
          try {
            // 步骤3: 获取完整的组件信息
            console.log('loadEntityChildren: 开始加载完整组件信息')
            nodes = await loadComponentByComponent(nodes)
            console.log('loadEntityChildren: 步骤3完成: 已加载完整组件信息')
          } catch (err) {
            console.error('loadEntityChildren: 加载完整组件信息失败:', err)
          }
        }
          
        if (loadBoms) {
          try {
            // 步骤4: 加载BOM数据
            console.log('loadEntityChildren: 开始加载BOM数据')
            nodes = await loadBomByComponent(nodes)
            console.log('loadEntityChildren: 步骤4完成: 已加载BOM数据')
          } catch (err) {
            console.error('loadEntityChildren: 加载BOM数据失败:', err)
          }
        }
      }

      // 解包临时root节点的子元素
      const resultData = nodes[0].children || []
      
      // 最终检查规格书节点
      if (loadSpecifications) {
        const allSpecNodes: TreeNodeData[] = [];
        const findSpecNodes = (node: TreeNodeData) => {
          if (node.type === NODE_TYPES.SPECIFICATION) {
            allSpecNodes.push(node);
          }
          if (node.children?.length) {
            for (const child of node.children) {
              findSpecNodes(child);
            }
          }
        };
        
        for (const node of resultData) {
          findSpecNodes(node);
        }
        
        console.log(`loadEntityChildren: 最终加载完成，共有 ${allSpecNodes.length} 个规格书节点`);
        if (allSpecNodes.length > 0) {
          console.log('loadEntityChildren: 规格书节点位置:', allSpecNodes.map(node => {
            // 查找节点的父级路径
            const path: {id: string | number, type: string}[] = [];
            let current: TreeNodeData | undefined = node;
            while (current && current.parent) {
              path.unshift({id: current.parent.id, type: current.parent.type});
              current = current.parent;
            }
            return {
              id: node.id,
              name: node.label,
              path: path
            };
          }));
        } else {
          console.warn('loadEntityChildren: 最终树结构中没有找到规格书节点');
        }
      }
      
      console.log('loadEntityChildren: 加载实体子元素完成，最终节点:', resultData)
      success('加载实体子元素成功')
      return { treeData: resultData, loading: false }
    } catch (err) {
      console.error('loadEntityChildren: 加载实体子元素失败:', err)
      error('加载数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据ID加载特定的产品系统
   * @param psystemId 产品系统ID
   * @returns 产品系统节点树
   */
  const loadPSystemById = async (psystemId: number): Promise<{ treeData: TreeNodeData[], loading: boolean }> => {
    try {
      isLoading.value = true
      console.log(`开始加载产品系统(ID: ${psystemId})`)

      // 获取产品系统数据
      const psystem = await entityApis.psystem.get(psystemId)
      if (!psystem) {
        error(`未找到ID为${psystemId}的产品系统`)
        return { treeData: [], loading: false }
      }

      // 转换为树节点结构
      const psystemWithCompositeId = {
        ...psystem,
        id: generateCompositeId(NODE_TYPES.PSYSTEM, psystem.id)
      }
      const psystemNode = psystemTreeNodeFactory(psystemWithCompositeId)
      
      // 返回仅包含产品系统节点的树
      return { treeData: [psystemNode], loading: false }
    } catch (err) {
      console.error(`加载产品系统(ID: ${psystemId})失败:`, err)
      error('加载产品系统数据失败')
      return { treeData: [], loading: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据产品系统加载规格信息
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
      console.log('开始加载产品系统相关的规格数据')
      
      // 递归遍历树，为每个PSystem节点加载规格
      const processNode = async (node: TreeNodeData): Promise<void> => {
        // 检查是否为PSystem节点
        if (node.type === NODE_TYPES.PSYSTEM && node.originalData) {
          const psystem = node.originalData as Record<string, any>
          
          // 检查是否有规格ID
          if (psystem.specId && psystem.specId > 0) {
            try {
              console.log(`为产品系统 ${psystem.id} 加载规格数据，规格ID：${psystem.specId}`)
              
              // 获取规格数据
              const specification = await entityApis.specification.getAll(psystem.specId)
              
              if (specification) {
                // 转换为树节点结构
                const specWithCompositeId = convertApiResponseIds([specification], NODE_TYPES.SPECIFICATION)[0]
                const specNode = specificationTreeNodeFactory(specWithCompositeId)
                
                // 添加到PSystem节点的子节点列表
                node.children = node.children || []
                node.children.unshift(specNode)
                console.log(`已为产品系统 ${psystem.id} 添加规格节点（在子节点列表最前面）`)
              }
            } catch (err) {
              console.error(`加载产品系统 ${psystem.id} 的规格失败:`, err)
            }
          }
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            await processNode(child)
          }
        }
      }
      
      // 为每个顶级节点处理
      for (const node of treeData) {
        await processNode(node)
      }
      
      console.log('产品系统规格数据加载完成')
      return treeData
    } catch (err) {
      console.error('加载产品系统规格数据失败:', err)
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
    loadComponentByTemplate,
    loadComponentByComponent,
    loadBomByComponent,
    loadSpecificationByTemplate,
    loadSpecificationByPSystem,
    
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
    specificationTreeNodeFactory
  }
} 