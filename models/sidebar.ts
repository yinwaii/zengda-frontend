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
				title: '部件 / Component',
				url: '/design/component/table',
			},
			{
				title: '子系统 / PSystem',
				url: '/design/psystem/table',
			},
			{
				title: '模板 / Template',
				url: '/design/template/table',
			},
			{
				title: '产品类型 / PType',
				url: '/design/ptype/table',
			},
			{
				title: '项目 / Project',
				url: '/design/project/table',
			},
		],
	},
]