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
				title: '模板 / Template',
				url: '/design/projectTemplate',
			},
			{
				title: '项目 / Project',
				url: '/design/project',
			},
		],
	},
	// {
	// 	title: '管理 / Management',
	// 	url: '/manage',
	// 	items: [
	// 		{
	// 			title: '产品类型 / PType',
	// 			url: '/manage/ptype',
	// 		},
	// 	],
	// },
]