import { z } from "zod"
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { BasicProperty, TimeStamp } from '../entity'
import { getColumns, packHeader, TimeStampColumnVisibility } from '../column'

export interface ZdTemplate extends BasicProperty, TimeStamp {
	isShow: boolean // 是否展示
	productTypeId: number
	productTypeName?: string
	isCustomized: boolean // 是否是自定义的
	isDeleted?: boolean
	specId?: number
	// lastVersionId?: string // 上个版本id
}

export const ZdTemplateColumns = getColumns<ZdTemplate>([
	{ 
		accessorKey: 'isShow', 
		header: packHeader<ZdTemplate>('是否显示'),
		meta: { width: '80px' }
	},
	{ 
		accessorKey: 'productTypeId', 
		header: packHeader<ZdTemplate>('产品类型ID'),
		meta: { width: '120px' }
	},
	{ 
		accessorKey: 'productTypeName', 
		header: packHeader<ZdTemplate>('产品类型名称'),
		meta: { width: '150px' }
	},
	{ 
		accessorKey: 'isCustomized', 
		header: packHeader<ZdTemplate>('是否定制'),
		meta: { width: '80px' }
	},
	{ 
		accessorKey: 'isDeleted', 
		header: packHeader<ZdTemplate>('是否删除'),
		meta: { width: '80px' }
	},
	{ 
		accessorKey: 'specId', 
		header: packHeader<ZdTemplate>('规格书ID'),
		meta: { width: '100px' }
	}
], true, true)

export const ZdTemplateFormZod = z.object({
	isShow: z.boolean(),
	productTypeId: z.number(),
	isCustomized: z.boolean(),
	isDeleted: z.boolean().optional(),
	specId: z.number().optional(),
})

export const ZdTemplateFormConfig = {
	isShow: { label: '是否显示' },
	productTypeId: { label: '产品类型ID' },
	isCustomized: { label: '是否定制' },
	isDeleted: { label: '是否删除' },
	specId: { label: '规格书ID' },
}

// export class ZdTemplate implements ZdTemplate {
// 	constructor() {
// 		this.id = -1;
// 		this.name = '';
// 		this.productTypeId = -1;
// 		this.productTypeName = '';
// 		this.isCustomized = false;
// 		this.isShow = false;
// 		this.specId = undefined;
// 	}
// } 