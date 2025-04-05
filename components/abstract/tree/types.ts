/**
 * 树节点数据接口
 */
export interface TreeNodeData {
  id: string | number      // 复合ID，格式为 `${type}:${id}`
  originalId?: string | number  // 原始ID
  label?: string
  children?: TreeNodeData[]
  components?: any[] // 组件列表，用于显示子组件
  type?: string // 节点类型，用于决定使用哪个组件
  originalData?: any // 原始数据对象
  [key: string]: any // 其他可能的属性
}

/**
 * 树组件Props接口
 */
export interface TreeProps {
  // 数据源
  items: TreeNodeData[]
  // 默认展开的节点键值
  defaultExpandedKeys?: (string | number)[]
  // 自定义获取节点唯一标识的函数
  getNodeKey?: (node: TreeNodeData) => string | number
  // 自定义获取节点标签的函数
  getNodeLabel?: (node: TreeNodeData) => string
  // 自定义判断节点是否有子节点的函数
  hasChildren?: (node: TreeNodeData) => boolean
  currentItem?: TreeNodeData | null
  currentItemId?: string | number | null
  nodeComponents?: Record<string, any> // 节点类型对应的组件
  detailComponents?: Record<string, any> // 节点类型对应的详情组件
  dialogComponents?: Record<string, any> // 节点类型对应的对话框组件
}

/**
 * 树组件Emits接口
 */
export interface TreeEmits {
  // 节点点击事件
  (e: 'node-click', node: TreeNodeData): void
  // 节点展开/折叠事件
  (e: 'node-toggle', node: TreeNodeData, expanded: boolean): void
  // 节点展开事件
  (e: 'node-expand', node: TreeNodeData): void
  // 节点折叠事件
  (e: 'node-collapse', node: TreeNodeData): void
  // 更新选中节点
  (e: 'update:selected', nodes: TreeNodeData[]): void
  // 更新展开节点
  (e: 'update:open', node: TreeNodeData): void
  (e: 'update:currentItem', node: TreeNodeData | null): void
  (e: 'update:currentItemId', id: string | number | null): void
} 