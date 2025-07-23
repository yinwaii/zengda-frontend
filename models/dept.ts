export interface ZdDept {
	deptId?: number
	deptName: string
    parentId?: number
    orderNum?: number
    leader?: string
    phone?: string
    address?: string
    email?: string
    status?: string // 0: 正常, 1: 停用
    open?: boolean
    children?: Array<ZdDept>
}

