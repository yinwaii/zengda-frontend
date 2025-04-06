export interface Role extends BaseEntity {
    roleId: number
    roleName: string         // 角色名称
    roleKey: string          // 角色权限字符串
    status: string           // 状态: 0: 正常, 1: 停用
    roleSort: number        // 角色排序
    dataScope?: string       // 数据范围: 1: 全部数据权限, 2: 自定义数据权限, 3: 本部门数据权限, 4: 本部门及以下数据权限
    remark?: string          // 备注
    deptCheckStrictly?: number // 部门树选择是否关联显示
    menuCheckStrictly?: number // 菜单树选择是否关联显示
}

export class Role implements Role {
    constructor() {
        this.roleName = ''
        this.roleKey = ''
        this.status = '0'
        this.roleSort = 0
        this.dataScope = undefined
        this.deptCheckStrictly = 0
        this.menuCheckStrictly = 0
    }
}

// 菜单管理

export interface Menu extends BaseEntity {
    menuId: number
    label?: string
    parentId: number
    parentName?: string
    code?: string
    path?: string
    name?: string
    url?: string
    type?: number
    icon?: string
    orderNum?: number
    remark?: string
    isDelete?: number
    open?: boolean
    children?: Menu[]
}

export class Menu implements Menu {
    constructor() {
        this.menuId = 0
        this.label = ''
        this.parentId = 0
        this.parentName = ''
        this.code = ''
        this.path = ''
        this.name = ''
    }
}

export interface Payment {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'success' | 'failed'
    email: string
}

export const payments: Payment[] = [
    {
        id: '728ed52f',
        amount: 100,
        status: 'pending',
        email: 'm@example.com',
    },
    {
        id: '489e1d42',
        amount: 125,
        status: 'processing',
        email: 'example@gmail.com',
    },
    // ...
]
