import { z } from 'zod';

export interface ZdPSystem extends BasicProperty, TimeStamp {
	isDeleted: boolean;
	docsUrl: null | string;
	parentId: number;
	specId: number | null;
	children: Array<ZdPSystem> | null;
	parameters: Array<ZdParameter> | null;
}

export const ZdPSystemColumns = getColumns<ZdPSystem>([
	{ accessorKey: 'isDeleted', header: packHeader<ZdPSystem>('是否被删除') },
	{ accessorKey: 'docsUrl', header: packHeader<ZdPSystem>('文档链接') },
	{ accessorKey: 'parentId', header: packHeader<ZdPSystem>('父ID') },
	{ accessorKey: 'children', header: packHeader<ZdPSystem>('子系统') },
	{ accessorKey: 'parameters', header: packHeader<ZdPSystem>('参数') },
], true, true)

export const ZdPSystemFormZod = z.object({
	isDeleted: z.boolean(),
	docsUrl: z.string().nullable(),
	parentId: z.number(),
	specId: z.number().nullable(),
	// children: z.array(z.object(ZdPSystemFormZod)).nullable(),
	// parameters: z.array(z.object(ZdParameterFormZod)).nullable(),
})

export const ZdPSystemFormConfig = {
	isDeleted: { label: '是否被删除' },
	docsUrl: { label: '文档链接' },
	parentId: { label: '父ID' },
	specId: { label: '规格ID' },
	// children: { label: '子系统' },
	// parameters: { label: '参数' },
}

export class ZdPSystem implements ZdPSystem {
	constructor() {
		this.id = -1;
		this.name = '';
		this.isDeleted = true;
		this.docsUrl = null;
		this.parentId = -1;
		this.description = '';
		this.children = null;
		this.parameters = null;
	}
}