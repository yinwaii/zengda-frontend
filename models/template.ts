import type { ZdPSystem } from "./psystem"

export interface ZdTemplate extends BasicProperty, TimeStamp {
	isShow: boolean
	productTypeId: number
	productTypeName?: string
	isCustomized: boolean
	isDeleted?: boolean
}

export class ZdTemplate implements ZdTemplate {
	constructor() {
		this.id = -1;
		this.name = '';
		this.productTypeId = -1;
		this.productTypeName = '';
		this.isCustomized = false;
		this.isShow = false;
	}

	static get(id: number) {
		return useApis().get<ZdTemplate>(`/template/${id}`);
	}

	static getByPage(page: number, size: number) {
		return useApis().get<VOPaged<ZdTemplate>>('/template/', { page, size });
	}

	static post(data: ZdTemplate) {
		return useApis().post<ZdTemplate>('/template/', data);
	}

	static put(data: ZdTemplate) {
		return useApis().put<ZdTemplate>('/template', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdTemplate>(`/template/${id}`);
	}

	getAll() {
		return useApis().get<VOList<ZdPSystem>>(`/template/${this.id}/pSystem`);
	}

	post(sid: number) {
		return useApis().post<ZdPSystem>(`/template/${this.id}/pSystem/${sid}`);
	}

	postByBatch(sids: number[]) {
		return useApis().post<null>(`/template/${this.id}/pSystem`, sids);
	}

	putByBatch(sids: number[]) {
		return useApis().put<null>(`/template/${this.id}/pSystem`, sids);
	}

	delete(sid: number) {
		return useApis().delete<ZdPSystem>(`/template/${this.id}/pSystem/${sid}`);
	}
}