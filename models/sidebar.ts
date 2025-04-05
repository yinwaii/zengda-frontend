// This is sample data.
interface SidebarNode {
	title: string
	url: string
	isActive?: boolean
	items: SidebarNode[]
}
export type SidebarData = Array<SidebarNode>
export const sidebarData = [
	{
		title: '设计 / Design',
		url: '/design',
		items: [
			{
				title: '首页 / Home',
				url: '/design',
			},
			{
				title: '模板 / Template',
				url: '/design/projectTemplate',
			},
			{
				title: '项目 / Project',
				url: '/design/project',
			},
		],
	},
	{
		title: '管理 / Management',
		url: '/manage',
		items: [
			{
				title: '产品类型 / PType',
				url: '/manage/ptype',
			},
		],
	},
	{
		title: '系统管理 / System',
		url: '/system',
		items: [
			{
				title: '用户管理 / User',
				url: '/system/user',
			},
			{
				title: '角色管理 / Role',
				url: '/system/role',
			},
			{
				title: '菜单管理 / Menu',
				url: '/system/menu',
			},
			{
				title: '部门管理 / Department',
				url: '/system/dept',
			},
		],
	},
	{
		title: '个性化系统 / PSystem',
		url: '/psystem',
		items: [
			{
				title: '首页 / Home',
				url: '/psystem',
			},
		],
	},
]