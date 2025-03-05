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
		url: '#',
		items: [
			{
				title: '部件 / Component',
				url: '/design/component',
			},
			{
				title: '子系统 / PSystem',
				url: '#',
			},
			{
				title: '模板 / Template',
				url: '#',
			},
			{
				title: '产品类型 / PType',
				url: '#',
			},
			{
				title: '参数 / Argument',
				url: '#',
			},
			{
				title: '配置 / Configuration',
				url: '#',
			},
			{
				title: '项目 / Project',
				url: '#',
			},
			{
				title: '物料 / Item',
				url: '#',
			},
		],
	},
]