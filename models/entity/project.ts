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

	static get(id: number) {
		return useApis().get<ZdProject>(`/project/${id}`)
	}

	static getByPage(page: number, size: number) {
		return useApis().get<VOPaged<ZdProject>>('/project/', { page, size })
	}

	static post(data: ZdProject) {
		return useApis().post<ZdProject>('/project/', data)
	}

	static put(data: ZdProject) {
		return useApis().put<ZdProject>('/project', data)
	}

	static delete(id: number) {
		return useApis().delete<ZdProject>(`/project/${id}`)
	}
}