import { z } from 'zod';

export interface ZdTComponent extends TimeStamp {
	id: number
	psystemId: number
	templateId: number
	componentId: number
	description?: string
}

export const ZdTComponentColumns = getColumns<ZdTComponent>([
	{ accessorKey: 'id', header: packHeader<ZdTComponent>('ID') },
	{ accessorKey: 'psystemId', header: packHeader<ZdTComponent>('系统ID') },
	{ accessorKey: 'templateId', header: packHeader<ZdTComponent>('模板ID') },
	{ accessorKey: 'componentId', header: packHeader<ZdTComponent>('组件ID') },
	{ accessorKey: 'description', header: packHeader<ZdTComponent>('描述') },
], false, true)

export const ZdTComponentFormZod = z.object({
	id: z.number(),
	psystemId: z.number(),
	templateId: z.number(),
	componentId: z.number(),
	description: z.string().optional(),
})

export const ZdTComponentFormConfig = {
	id: { label: 'ID' },
	psystemId: { label: '系统ID' },
	templateId: { label: '模板ID' },
	componentId: { label: '组件ID' },
	description: { label: '描述' },
}

export class ZdTComponent implements ZdTComponent {
	constructor() {
		this.id = -1;
		this.psystemId = -1;
		this.templateId = -1;
		this.componentId = -1;
	}
}