import { z } from "zod"

export interface ZdParameter extends BasicProperty, TimeStamp {
	isShow: boolean
	orderId?: number
	objectId: number
	objectType: string
	dtype?: string
	value: any
	isReadonly?: boolean
	isDeleted: boolean
}

export const ZdParameterColumns = getColumns<ZdParameter>([
	{ accessorKey: 'isShow', header: packHeader<ZdParameter>('是否显示') },
	{ accessorKey: 'orderId', header: packHeader<ZdParameter>('排序ID') },
	{ accessorKey: 'objectId', header: packHeader<ZdParameter>('对象ID') },
	{ accessorKey: 'objectType', header: packHeader<ZdParameter>('对象类型') },
	{ accessorKey: 'dtype', header: packHeader<ZdParameter>('数据类型') },
	{ accessorKey: 'value', header: packHeader<ZdParameter>('值') },
	{ accessorKey: 'isReadonly', header: packHeader<ZdParameter>('是否只读') },
	{ accessorKey: 'isDeleted', header: packHeader<ZdParameter>('是否删除') },
], true, true)

export const ZdParameterFormZod = z.object({
	isShow: z.boolean(),
	orderId: z.number().optional(),
	objectId: z.number(),
	objectType: z.string(),
	dtype: z.string().optional(),
	value: z.any(),
	isReadonly: z.boolean().optional(),
	isDeleted: z.boolean(),
})

export const ZdParameterFormConfig = {
	isShow: { label: '是否显示' },
	orderId: { label: '排序ID' },
	objectId: { label: '对象ID' },
	objectType: { label: '对象类型' },
	dtype: { label: '数据类型' },
	value: { label: '值' },
	isReadonly: { label: '是否只读' },
	isDeleted: { label: '是否删除' },
}

// export class ZdParameter implements ZdParameter {
// 	constructor() {
// 		this.id = -1;
// 		this.name = '';
// 		this.description = '';
// 		this.objectId = -1;
// 		this.objectType = '';
// 		this.value = '';
// 		this.isDeleted = false;
// 	}
// }