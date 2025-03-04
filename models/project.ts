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

export class ZdProject implements ZdProject {
	constructor() {
		this.id = 0
		this.name = ''
		this.description = ''
		this.productTypeId = 0
		this.templateId = 0
	}

	static formSchema: GenericParamMap<ZdProject> = {
		id: new GenericParam('ID', 'span'),
		name: new GenericParam('名称', 'string'),
		description: new GenericParam('描述', 'string'),
		productTypeId: new GenericParam('产品类型ID', 'number'),
		templateId: new GenericParam('模板ID', 'number'),
		quantity: new GenericParam('数量', 'number'),
		model: new GenericParam('模型', 'string'),
		attention: new GenericParam('注意力', 'string'),
		company: new GenericParam('公司', 'string'),
		tel: new GenericParam('电话', 'string'),
		mob: new GenericParam('手机', 'string'),
		fax: new GenericParam('传真', 'string'),
		email: new GenericParam('邮箱', 'string'),
		number: new GenericParam('号码', 'string'),
		date: new GenericParam('日期', 'string'),
		valid: new GenericParam('合法值', 'string'),
		price: new GenericParam('价格', 'string'),
	}

	static tableSchema: GenericParamMap<ZdProject> = {
		id: new GenericParam('ID', 'span'),
		name: new GenericParam('名称', 'string'),
		description: new GenericParam('描述', 'string'),
		productTypeId: new GenericParam('产品类型ID', 'number'),
		templateId: new GenericParam('模板ID', 'number'),
		quantity: new GenericParam('数量', 'number'),
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