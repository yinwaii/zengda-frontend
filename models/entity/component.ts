import { z } from 'zod'

export interface ZdComponent extends BasicProperty, TimeStamp {
	isShow: boolean	// 是否可见
	isRequired: boolean // 是否必须
	isDeleted: boolean // 是否已删除
	price?: string	// 价格计算公式/默认价格
	compValue?: string	// 价格
	bomId?: number	// 默认的BOM表
}

export const ZdComponentColumns = getColumns<ZdComponent>([
	{ accessorKey: 'isShow', header: packHeader<ZdComponent>('是否显示') },
	{ accessorKey: 'isRequired', header: packHeader<ZdComponent>('是否必须') },
	{ accessorKey: 'price', header: packHeader<ZdComponent>('价格') },
	{ accessorKey: 'value', header: packHeader<ZdComponent>('数量') },
], true, true)

export const ZdComponentFormZod = z.object({
	isShow: z.boolean(),
	isRequired: z.boolean(),
	price: z.string(),
	value: z.string(),
})

export const ZdComponentFormConfig = {
	isShow: { label: '是否显示' },
	isRequired: { label: '是否必须' },
	price: { label: '价格' },
	value: { label: '数量' },
}

// export class ZdComponent implements ZdComponent {
// 	constructor() {
// 		this.id = 0;
// 		this.name = '';
// 		this.description = '';
// 		this.isRequired = false;
// 		this.isShow = false;
// 	}
// }

