import type { ZdPSystem } from "./psystem"
import { z } from "zod"

export interface ZdTemplate extends BasicProperty, TimeStamp {
	isShow: boolean
	productTypeId: number
	productTypeName?: string
	isCustomized: boolean
	isDeleted?: boolean
}

export const ZdTemplateColumns = getColumns<ZdTemplate>([
	{ accessorKey: 'isShow', header: packHeader<ZdTemplate>('是否显示') },
	{ accessorKey: 'productTypeId', header: packHeader<ZdTemplate>('产品类型ID') },
	{ accessorKey: 'productTypeName', header: packHeader<ZdTemplate>('产品类型名称') },
	{ accessorKey: 'isCustomized', header: packHeader<ZdTemplate>('是否定制') },
	{ accessorKey: 'isDeleted', header: packHeader<ZdTemplate>('是否删除') },
], true, true)

export const ZdTemplateFormZod = z.object({
	isShow: z.boolean(),
	productTypeId: z.number(),
	isCustomized: z.boolean(),
	isDeleted: z.boolean().optional(),
})

export const ZdTemplateFormConfig = {
	isShow: { label: '是否显示' },
	productTypeId: { label: '产品类型ID' },
	isCustomized: { label: '是否定制' },
	isDeleted: { label: '是否删除' },
}

export class ZdTemplate implements ZdTemplate {
	constructor() {
		this.id = -1;
		this.name = '';
		this.productTypeId = -1;
		this.productTypeName = '';
		this.isCustomized = false;
		this.isShow = false;
	}
}