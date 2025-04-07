/**
 * 树节点接口
 */
export interface TreeNode {
  id: string
  name: string
  type: string
  expanded: boolean
  children: TreeNode[]
  data: {
    id: number
    type: string
    [key: string]: any
  }
  [key: string]: any
} 