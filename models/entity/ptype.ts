import { z } from 'zod';

export interface ZdPType extends BasicProperty, TimeStamp {
	isShow: boolean;
	code: string;
	model: string;
}

export const ZdPTypeColumns = getColumns<ZdPType>([
	{ accessorKey: 'isShow', header: packHeader<ZdPType>('是否显示') },
	{ accessorKey: 'code', header: packHeader<ZdPType>('代码') },
	{ accessorKey: 'model', header: packHeader<ZdPType>('型号') },
], true, true)

export const ZdPTypeFormZod = z.object({
	isShow: z.boolean(),
	code: z.string(),
	model: z.string(),
})

export const ZdPTypeFormConfig = {
	isShow: { label: '是否显示' },
	code: { label: '代码' },
	model: { label: '型号' },
}

export class ZdPType implements ZdPType {
	constructor() {
		this.id = -1;
		this.name = '';
		this.code = '';
		this.model = '';
		this.isShow = true;
	}
}