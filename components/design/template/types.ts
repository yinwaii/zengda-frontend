import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { TreeNodeData } from '~/components/abstract/tree/types'

// 定义一个带有组件的系统类型，保留id字段但使其可选
export type ZdPSystemWithComponents = Omit<ZdPSystem, 'children'> & {
  // 原始系统ID
  id?: number
  // 用于树节点的ID
  systemId: number
  // 组件列表
  components?: ZdTComponent[]
  // 原始原始components列表的引用（用于调试）
  _rawComponents?: ZdTComponent[]
  // 重新定义children属性，确保类型兼容
  children?: ZdPSystemWithComponents[] | null
}

// 使用交叉类型而不是接口继承，避免冲突
export type ZdPSystemTreeNode = TreeNodeData & {
  // 添加原系统对象引用
  original: ZdPSystemWithComponents
  // 组件属性
  components?: ZdTComponent[]
  // 递归定义子节点
  children?: ZdPSystemTreeNode[] | undefined
} 