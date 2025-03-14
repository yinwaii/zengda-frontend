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

export class ZdPType implements ZdPType {
	constructor() {
		this.id = -1;
		this.name = '';
		this.code = '';
		this.model = '';
		this.isShow = true;
	}

	static getAll() {
		return useApis().get<Array<ZdPType>>('/pType/');
	}

	static get(id: number) {
		return useApis().get<ZdPType>(`/pType/${id}`);
	}

	static post(data: ZdPType) {
		return useApis().post<ZdPType>('/pType/', data);
	}

	static put(data: ZdPType) {
		return useApis().put<ZdPType>('/pType', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdPType>(`/pType/${id}`);
	}
}