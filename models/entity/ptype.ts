export interface ZdPType extends BasicProperty, TimeStamp {
	isShow: boolean;
	code: string;
	model: string;
}

export class ZdPType implements ZdPType {
	constructor() {
		this.id = -1;
		this.name = '';
		this.code = '';
		this.model = '';
		this.isShow = true;
	}

	static getAll() {
		return useApis().get<VOList<ZdPType>>('/ptype/');
	}

	static get(id: number) {
		return useApis().get<ZdPType>(`/ptype/${id}`);
	}

	static post(data: ZdPType) {
		return useApis().post<ZdPType>('/ptype/', data);
	}

	static put(data: ZdPType) {
		return useApis().put<ZdPType>('/ptype', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdPType>(`/ptype/${id}`);
	}
}