import { z } from "zod"

export interface ZdConfiguration extends BasicProperty, TimeStamp {
	isShow: boolean
	templateId: number
	projectId: number
	lastVersionId: number
	valueConfig: string
	componentConfig: string
	docs: string
	isDeleted: boolean
	// bomConfig: 
}


export const ZdConfigurationColumns = getColumns<ZdConfiguration>([
	{ accessorKey: 'isShow', header: packHeader<ZdConfiguration>('是否显示') },
	{ accessorKey: 'templateId', header: packHeader<ZdConfiguration>('模板ID') },
	{ accessorKey: 'projectId', header: packHeader<ZdConfiguration>('项目ID') },
	{ accessorKey: 'lastVersionId', header: packHeader<ZdConfiguration>('最后版本ID') },
	{ accessorKey: 'valueConfig', header: packHeader<ZdConfiguration>('值配置') },
	{ accessorKey: 'componentConfig', header: packHeader<ZdConfiguration>('组件配置') },
], true, true)

export const ZdConfigurationFormZod = z.object({
	isShow: z.boolean(),
	templateId: z.number(),
	projectId: z.number(),
	lastVersionId: z.number(),
	valueConfig: z.string(),
	componentConfig: z.string(),
})

export const ZdConfigurationFormConfig = {
	isShow: { label: '是否显示' },
	templateId: { label: '模板ID' },
	projectId: { label: '项目ID' },
	lastVersionId: { label: '最后版本ID' },
	valueConfig: { label: '值配置' },
	componentConfig: { label: '组件配置' },
}

// export class ZdConfiguration implements ZdConfiguration {
// 	constructor() {
// 		this.id = -1;
// 		this.name = '';
// 		this.templateId = -1;
// 		// th
// 		this.projectId = -1;
// 		this.lastVersionId = -1;
// 		this.valueConfig = '';
// 		this.componentConfig = '';
// 		this.isShow = false;
// 	}
// }