export interface ZdComponent extends BasicProperty, TimeStamp {
	isShow: boolean
	isRequired: boolean
	price?: string
	value?: string
}

export const ZdComponentColumns = getColumns<ZdComponent>([
	{ accessorKey: 'isShow', header: packHeader<ZdComponent>('是否显示') },
	{ accessorKey: 'isRequired', header: packHeader<ZdComponent>('是否必须') },
	{ accessorKey: 'price', header: packHeader<ZdComponent>('价格') },
	{ accessorKey: 'value', header: packHeader<ZdComponent>('数量') },
], true, true)

export class ZdComponent implements ZdComponent {
	constructor() {
		this.id = 0;
		this.name = '';
		this.description = '';
		this.isRequired = false;
		this.isShow = false;
	}

	static getAll() {
		return useApis().get<VOList<ZdComponent>>('/component/all');
	}

	static get(id: number) {
		return useApis().get<ZdComponent>(`/component/${id}`);
	}

	static getByPage(page: number, size: number) {
		return useApis().get<VOPaged<ZdComponent>>('/component/', { page, size });
	}

	static post(data: ZdComponent) {
		return useApis().post<ZdComponent>('/component/', data);
	}

	static put(data: ZdComponent) {
		return useApis().put<ZdComponent>('/component', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdComponent>(`/component/${id}`);
	}
}

