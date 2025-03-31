export interface TreeNodeData {
  id: string | number
  label?: string
  children?: TreeNodeData[]
  [key: string]: any // 允许存储任意额外数据
}

export interface TreeProps {
  // 数据源
  items?: TreeNodeData[]
  // 默认展开的节点键值
  defaultExpandedKeys?: (string | number)[]
  // 自定义获取节点唯一标识的函数
  getNodeKey?: (node: TreeNodeData) => string | number
  // 自定义获取节点标签的函数
  getNodeLabel?: (node: TreeNodeData) => string
  // 自定义判断节点是否有子节点的函数
  hasChildren?: (node: TreeNodeData) => boolean
}

export interface TreeEmits {
  // 节点点击事件
  'node-click': [node: TreeNodeData]
  // 节点展开/折叠事件
  'node-toggle': [node: TreeNodeData, expanded: boolean]
  // 节点展开事件
  'node-expand': [node: TreeNodeData]
  // 节点折叠事件
  'node-collapse': [node: TreeNodeData]
} 