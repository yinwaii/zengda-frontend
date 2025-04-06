import type { TreeNodeData } from '~/components/abstract/tree/types'

// 定义节点类型常量
export const NODE_TYPES = {
  BOM: 'bom',
  COMPONENT: 'component',
  PROJECT: 'project',
  TEMPLATE: 'project-template',
  PSYSTEM: 'psystem',
  SPECIFICATION: 'specification',
} as const

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES]

// 基础树节点工厂函数类型
export type TreeNodeFactory<T> = (data: T) => TreeNodeData

/**
 * 生成复合ID，格式为 `${type}:${id}`
 * @param type 节点类型
 * @param id 节点原始ID
 * @returns 复合ID字符串
 */
export const generateCompositeId = (type: string, id: number | string): string => {
  // 检查ID是否已经是复合ID格式
  if (typeof id === 'string' && id.includes(':')) {
    const parts = id.split(':')

    // 如果已有正确前缀，直接返回
    if (parts[0] === type) {
      console.log(`ID已有正确前缀: ${id}，不需要再添加类型`)
      return id
    }

    // 提取原始ID
    const originalId = parts[parts.length - 1]
    console.log(`从复合ID提取原始部分生成新ID: ${id} -> ${type}:${originalId}`)
    return `${type}:${originalId}`
  }

  // 如果不是复合ID，正常拼接
  const compositeId = `${type}:${id}`
  console.log(`生成新的复合ID: ${type}:${id}`)
  return compositeId
}

/**
 * 从复合ID中解析出原始ID
 * @param compositeId 复合ID字符串
 * @returns 原始ID (数字或字符串)
 */
export const parseOriginalId = (compositeId: string): number | string => {
  if (!compositeId || typeof compositeId !== 'string') {
    console.warn(`无法从非字符串ID提取原始ID: ${compositeId}`)
    return compositeId
  }

  const parts = compositeId.split(':')
  if (parts.length < 2) {
    console.warn(`这不是复合ID格式 (无冒号): ${compositeId}`)
    return compositeId
  }

  // 取最后一部分作为ID
  const originalId = parts[parts.length - 1]
  console.log(`从复合ID提取原始部分: ${compositeId} -> ${originalId}`)

  // 尝试转换为数字
  const numId = Number(originalId)
  return !isNaN(numId) && isFinite(numId) ? numId : originalId
}

/**
 * 从复合ID中解析出节点类型
 * @param compositeId 复合ID字符串
 * @returns 节点类型
 */
export const parseNodeType = (compositeId: string): string => {
  const parts = compositeId.split(':')
  return parts.length < 2 ? '' : parts[0]
}

/**
 * 将BOM数据转换为树节点结构
 */
export const getBomTreeNodeStruct: TreeNodeFactory<any> = (bom) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.BOM, bom.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: bom.id, // 保留原始ID
    label: bom.number || `BOM ${bom.id}`, // 使用编号作为显示标签，如果没有编号则使用ID
    type: NODE_TYPES.BOM,
    children: bom.children?.map(getBomTreeNodeStruct) || [],
    originalData: bom,
  }
}

/**
 * 将组件数据转换为树节点结构
 */
export const getComponentTreeNodeStruct: TreeNodeFactory<any> = (component) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.COMPONENT, component.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: component.id, // 保留原始ID
    label: component.name,
    type: NODE_TYPES.COMPONENT,
    children: component.children?.map(getComponentTreeNodeStruct) || [],
    components: component.components || [],
    originalData: component,
  }
}

/**
 * 将项目数据转换为树节点结构
 */
export const getProjectTreeNodeStruct: TreeNodeFactory<any> = (project) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.PROJECT, project.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: project.id, // 保留原始ID
    label: project.name,
    type: NODE_TYPES.PROJECT,
    children: project.children?.map(getProjectTreeNodeStruct) || [],
    originalData: project,
  }
}

/**
 * 将项目模板数据转换为树节点结构
 */
export const getProjectTemplateTreeNodeStruct: TreeNodeFactory<any> = (template) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.TEMPLATE, template.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: template.id, // 保留原始ID
    label: template.name,
    type: NODE_TYPES.TEMPLATE,
    children: template.children?.map(getProjectTemplateTreeNodeStruct) || [],
    originalData: template,
  }
}

/**
 * 将产品系统数据转换为树节点结构
 */
export const getPsystemTreeNodeStruct: TreeNodeFactory<any> = (system) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.PSYSTEM, system.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: system.id, // 保留原始ID
    label: system.name,
    type: NODE_TYPES.PSYSTEM,
    children: system.children?.map(getPsystemTreeNodeStruct) || [],
    originalData: system,
  }
}

/**
 * 将规格数据转换为树节点结构
 */
export const getSpecificationTreeNodeStruct: TreeNodeFactory<any> = (spec) => {
  // 生成复合ID
  const compositeId = generateCompositeId(NODE_TYPES.SPECIFICATION, spec.id)

  return {
    id: compositeId, // 使用复合ID
    originalId: spec.id, // 保留原始ID
    label: spec.name,
    type: NODE_TYPES.SPECIFICATION,
    children: spec.children?.map(getSpecificationTreeNodeStruct) || [],
    originalData: spec,
  }
}

/**
 * 组合多个树节点结构获取函数
 * @param factories 树节点结构获取函数列表
 * @returns 组合后的树节点结构获取函数
 */
export const combineTreeNodeFactories = (factories: Record<string, TreeNodeFactory<any>>) => {
  return (node: any) => {
    // 如果节点已经有type属性，直接使用对应的工厂函数
    if (node.type && factories[node.type]) {
      // 如果已有type但没有复合ID，预先设置一个
      if (!node.id.toString().includes(':') && node.id !== undefined) {
        console.log(`为节点${node.id}设置复合ID`)
        // 做一个深拷贝，避免修改原始数据
        const nodeWithCompositeId = { ...node }
        nodeWithCompositeId.id = generateCompositeId(node.type, node.id)
        return factories[node.type](nodeWithCompositeId)
      }
      return factories[node.type](node)
    }

    // 检查是否已经有复合ID
    if (typeof node.id === 'string' && node.id.includes(':')) {
      const nodeType = parseNodeType(node.id)
      if (nodeType && factories[nodeType]) {
        node.type = nodeType
        return factories[nodeType](node)
      }
    }

    // 否则根据节点特征判断类型
    // 项目数据特征检测
    if (node.productTypeName ||
      (typeof node.isTemplate !== 'undefined' && node.isTemplate === false)) {
      node.type = NODE_TYPES.PROJECT;
      node.id = generateCompositeId(NODE_TYPES.PROJECT, node.id);
      return factories[NODE_TYPES.PROJECT]?.(node) || node;
    }

    // 模板数据特征检测
    if (node.productTypeId ||
      (typeof node.isTemplate !== 'undefined' && node.isTemplate === true)) {
      node.type = NODE_TYPES.TEMPLATE;
      node.id = generateCompositeId(NODE_TYPES.TEMPLATE, node.id);
      return factories[NODE_TYPES.TEMPLATE]?.(node) || node;
    }

    // 产品系统数据特征检测
    if (node.parentId !== undefined || node.system) {
      node.type = NODE_TYPES.PSYSTEM;
      node.id = generateCompositeId(NODE_TYPES.PSYSTEM, node.id);
      return factories[NODE_TYPES.PSYSTEM]?.(node) || node;
    }

    // 组件数据特征检测
    if (node.componentId !== undefined || node.originalTComponent ||
      (node.psystemId !== undefined && node.templateId !== undefined)) {
      node.type = NODE_TYPES.COMPONENT;
      node.id = generateCompositeId(NODE_TYPES.COMPONENT, node.id);
      return factories[NODE_TYPES.COMPONENT]?.(node) || node;
    }

    // BOM数据特征检测
    if (node.bomId !== undefined) {
      node.type = NODE_TYPES.BOM;
      node.id = generateCompositeId(NODE_TYPES.BOM, node.id);
      return factories[NODE_TYPES.BOM]?.(node) || node;
    }

    // 规格数据特征检测
    if (node.specId !== undefined || node.fileTag) {
      node.type = NODE_TYPES.SPECIFICATION;
      node.id = generateCompositeId(NODE_TYPES.SPECIFICATION, node.id);
      return factories[NODE_TYPES.SPECIFICATION]?.(node) || node;
    }

    // 根据ID属性类型和对象结构进行推断
    if (typeof node.id !== 'undefined') {
      // 尝试从各个工厂中找到一个能处理当前数据的
      for (const type of Object.keys(factories)) {
        // 先将类型设置到数据上
        const nodeClone = { ...node };
        nodeClone.type = type;
        nodeClone.id = generateCompositeId(type, node.id);

        try {
          const result = factories[type](nodeClone);
          if (result && result !== nodeClone) {
            return result;
          }
        } catch (e) {
          // 恢复原始状态，尝试下一个类型
          // 这里不需要恢复，因为我们使用了克隆对象
          console.warn(`类型${type}处理失败`, e);
        }
      }

      // 如果所有工厂都不适用，默认使用项目类型（如果有）
      if (factories[NODE_TYPES.PROJECT]) {
        const nodeClone = { ...node };
        nodeClone.type = NODE_TYPES.PROJECT;
        nodeClone.id = generateCompositeId(NODE_TYPES.PROJECT, node.id);
        return factories[NODE_TYPES.PROJECT](nodeClone);
      }

      // 如果没有项目类型工厂，使用第一个可用的工厂
      const firstType = Object.keys(factories)[0];
      if (firstType) {
        const nodeClone = { ...node };
        nodeClone.type = firstType;
        nodeClone.id = generateCompositeId(firstType, node.id);
        return factories[firstType](nodeClone);
      }
    }

    // 如果无法判断类型，添加警告日志
    console.warn('无法确定节点类型，返回原始数据', node);
    return node;
  }
}

/**
 * 创建特定页面的树节点结构获取函数
 * @param types 需要包含的节点类型
 * @returns 树节点结构获取函数
 */
export const createTreeNodeFactory = (types: NodeType[]) => {
  const factories: Record<string, TreeNodeFactory<any>> = {}

  types.forEach(type => {
    switch (type) {
      case NODE_TYPES.BOM:
        factories[type] = getBomTreeNodeStruct
        break
      case NODE_TYPES.COMPONENT:
        factories[type] = getComponentTreeNodeStruct
        break
      case NODE_TYPES.PROJECT:
        factories[type] = getProjectTreeNodeStruct
        break
      case NODE_TYPES.TEMPLATE:
        factories[type] = getProjectTemplateTreeNodeStruct
        break
      case NODE_TYPES.PSYSTEM:
        factories[type] = getPsystemTreeNodeStruct
        break
      case NODE_TYPES.SPECIFICATION:
        factories[type] = getSpecificationTreeNodeStruct
        break
    }
  })

  return combineTreeNodeFactories(factories)
}

// 导出所有函数
// export {
//   generateCompositeId,
//   parseOriginalId,
//   parseNodeType,
//   getBomTreeNodeStruct,
//   getComponentTreeNodeStruct,
//   getProjectTreeNodeStruct,
//   getProjectTemplateTreeNodeStruct,
//   getPsystemTreeNodeStruct,
//   getSpecificationTreeNodeStruct,
//   combineTreeNodeFactories,
//   createTreeNodeFactory
// } 