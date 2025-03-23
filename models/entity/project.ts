import { z } from "zod"

export interface ZdProject extends BasicProperty, TimeStamp {
	productTypeId: number
	templateId: number
	quantity?: number
	model?: string
	attention?: string
	company?: string
	tel?: string
	mob?: string
	fax?: string
	email?: string
	number?: string
	date?: string
	valid?: string
	price?: string
}

export const ZdProjectColumns = getColumns<ZdProject>([
	{ accessorKey: 'productTypeId', header: packHeader<ZdProject>('产品类型') },
	{ accessorKey: 'templateId', header: packHeader<ZdProject>('模板ID') },
	{ accessorKey: 'quantity', header: packHeader<ZdProject>('数量') },
	{ accessorKey: 'model', header: packHeader<ZdProject>('模型') },
	{ accessorKey: 'attention', header: packHeader<ZdProject>('注意力') },
	{ accessorKey: 'company', header: packHeader<ZdProject>('公司') },
	{ accessorKey: 'tel', header: packHeader<ZdProject>('电话') },
	{ accessorKey: 'mob', header: packHeader<ZdProject>('手机') },
	{ accessorKey: 'fax', header: packHeader<ZdProject>('传真') },
	{ accessorKey: 'email', header: packHeader<ZdProject>('邮件') },
	{ accessorKey: 'number', header: packHeader<ZdProject>('号码') },
	{ accessorKey: 'date', header: packHeader<ZdProject>('日期') },
	{ accessorKey: 'valid', header: packHeader<ZdProject>('是否合法') },
	{ accessorKey: 'price', header: packHeader<ZdProject>('价格') },
], true, true)

export const ZdProjectFormZod = z.object({
	productTypeId: z.number(),
	templateId: z.number(),
	name: z.string(),
	description: z.string(),
	quantity: z.number().optional(),
	model: z.string().optional(),
	attention: z.string().optional(),
	company: z.string().optional(),
	tel: z.string().optional(),
	mob: z.string().optional(),
	fax: z.string().optional(),
	email: z.string().optional(),
	number: z.string().optional(),
	date: z.string().optional(),
	valid: z.string().optional(),
	price: z.string().optional(),
})

export const ZdProjectFormConfig = {
	name: { label: '名称' },
	description: { label: '描述' },
	productTypeId: { label: '产品类型' },
	templateId: { label: '模板ID' },
	quantity: { label: '数量' },
	model: { label: '模型' },
	attention: { label: '注意力' },
	company: { label: '公司' },
	tel: { label: '电话' },
	mob: { label: '手机' },
	fax: { label: '传真' },
	email: { label: '邮件' },
	number: { label: '号码' },
	date: { label: '日期' },
	valid: { label: '是否合法' },
	price: { label: '价格' },
}

export const ZdProjectColumnsVisibility = {
	productTypeId: true,
	templateId: true,
	quantity: true,
	model: false,
	attention: false,
	company: false,
	tel: true,
	mob: false,
	fax: false,
	email: true,
	number: false,
	date: false,	
	valid: false,
	price: false,
}

export class ZdProject implements ZdProject {
	constructor() {
		this.id = 0
		this.name = ''
		this.description = ''
		this.productTypeId = 0
		this.templateId = 0
	}
}