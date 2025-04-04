import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPSystemWithComponents, ZdPSystemTreeNode } from './types'

/**
 * 将普通ZdPSystem转换为扩展版本
 */
export function extendSystem(system: ZdPSystem): ZdPSystemWithComponents {
  return {
    ...system,
    systemId: system.id, // 保留原始id到systemId
    components: [], // 默认添加空组件数组
    children: system.children?.map(extendSystem) || null
  }
}

/**
 * 更新系统的组件数据
 */
export function addComponentsToSystem(system: ZdPSystemWithComponents, components: ZdTComponent[]): ZdPSystemWithComponents {
  // 系统的有效ID
  const validIds = [
    system.id, 
    system.systemId, 
    String(system.id), 
    String(system.systemId)
  ].filter(Boolean);
  
  // 过滤出属于当前系统的组件
  const systemComponents = components.filter(comp => {
    // 检查各种可能的ID匹配情况
    const psystemIdMatches = validIds.includes(comp.psystemId);
    const templateIdMatches = validIds.includes(comp.templateId);
    
    return psystemIdMatches || templateIdMatches;
  });
  
  if (systemComponents.length > 0) {
    console.log(`系统${system.name || system.id}(ID:${system.id || system.systemId})匹配到${systemComponents.length}个组件`);
  }
  
  // 创建新的系统对象，添加组件
  const updatedSystem: ZdPSystemWithComponents = {
    ...system,
    components: systemComponents,
    _rawComponents: components // 存储原始组件列表用于调试
  }
  
  // 递归处理子系统
  if (updatedSystem.children && updatedSystem.children.length) {
    updatedSystem.children = updatedSystem.children.map(child => 
      addComponentsToSystem(child, components)
    )
  }
  
  return updatedSystem
}

/**
 * 将标准ZdPSystem对象适配为TreeNodeData，用于抽象树组件
 */
export function adaptSystemToTreeNode(system: ZdPSystemWithComponents): ZdPSystemTreeNode {
  // 先移除系统对象中的属性，避免后面展开时造成重复
  const { systemId, components, children, id, ...restSystemProps } = system
  
  // 创建树节点对象
  const treeNode: ZdPSystemTreeNode = {
    // TreeNodeData需要的属性
    id: systemId, // 使用systemId作为树节点id
    label: system.name || String(systemId),
    // 扩展属性
    components: components || [],
    // 保留原始对象引用
    original: system,
    // 其他系统属性
    ...restSystemProps,
  }
  
  // 递归转换子节点
  if (children) {
    treeNode.children = children.map(adaptSystemToTreeNode)
  }
  
  return treeNode
}

/**
 * 将适配后的TreeNodeData转换回ZdSystem
 */
export function getOriginalSystem(node: ZdPSystemTreeNode | TreeNodeData): ZdPSystemWithComponents {
  return (node as ZdPSystemTreeNode).original || {
    ...(node as any),
    id: (node as any).systemId || node.id,
    components: []
  }
} 