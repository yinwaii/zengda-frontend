import { z } from 'zod'
// import { BasicProperty, TimeStamp } from './basic'

export interface ZdProductType extends BasicProperty, TimeStamp {
	id: number
	name: string
	description?: string
}

export const ZdProductTypeFormZod = z.object({
	name: z.string().min(1, '名称不能为空'),
	description: z.string().optional()
})

export const ZdProductTypeColumns = [
	{ accessorKey: 'id', header: 'ID' },
	{ accessorKey: 'name', header: '名称' },
	{ accessorKey: 'description', header: '描述' }
]

export const ZdProductTypeColumnsVisibility = {
	id: true,
	name: true,
	description: true
} 