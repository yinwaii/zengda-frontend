import { z } from "zod"

export interface ZdConfiguration extends BasicProperty, TimeStamp {
	isShow: boolean
	template_id: number
	project_id: number
	lastVersionId: number
	valueConfig: string
	componentConfig: string
}

export const ZdConfigurationColumns = getColumns<ZdConfiguration>([
	{ accessorKey: 'isShow', header: packHeader<ZdConfiguration>('是否显示') },
	{ accessorKey: 'template_id', header: packHeader<ZdConfiguration>('模板ID') },
	{ accessorKey: 'project_id', header: packHeader<ZdConfiguration>('项目ID') },
	{ accessorKey: 'lastVersionId', header: packHeader<ZdConfiguration>('最后版本ID') },
	{ accessorKey: 'valueConfig', header: packHeader<ZdConfiguration>('值配置') },
	{ accessorKey: 'componentConfig', header: packHeader<ZdConfiguration>('组件配置') },
], true, true)

export const ZdConfigurationFormZod = z.object({
	isShow: z.boolean(),
	template_id: z.number(),
	project_id: z.number(),
	lastVersionId: z.number(),
	valueConfig: z.string(),
	componentConfig: z.string(),
})

export const ZdConfigurationFormConfig = {
	isShow: { label: '是否显示' },
	template_id: { label: '模板ID' },
	project_id: { label: '项目ID' },
	lastVersionId: { label: '最后版本ID' },
	valueConfig: { label: '值配置' },
	componentConfig: { label: '组件配置' },
}

export class ZdConfiguration implements ZdConfiguration {
	constructor() {
		this.id = -1;
		this.name = '';
		this.template_id = -1;
		this.project_id = -1;
		this.lastVersionId = -1;
		this.valueConfig = '';
		this.componentConfig = '';
		this.isShow = false;
	}
}