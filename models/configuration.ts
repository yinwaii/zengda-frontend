export interface ZdConfiguration extends BasicProperty, TimeStamp {
	isShow: boolean
	template_id: number
	project_id: number
	lastVersionId: number
	valueConfig: string
	componentConfig: string
}

export class ZdConfiguration implements ZdConfiguration {
	constructor() {
		this.id = -1;
		this.name = '';
		this.template_id = -1;
		this.project_id = -1;
		this.lastVersionId = -1;
		this.valueConfig = '';
		this.componentConfig = '';
		this.isShow = false;
	}

	static getById(tid: string, pid: string) {
		return useApis().get<VOList<ZdConfiguration>>('/configuration/', { tid, pid });
	}

	static get(id: number) {
		return useApis().get<ZdConfiguration>(`/configuration/${id}`);
	}

	static post(data: ZdConfiguration) {
		return useApis().post<ZdConfiguration>('/configuration/', data);
	}

	static put(data: ZdConfiguration) {
		return useApis().put<ZdConfiguration>('/configuration', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdConfiguration>(`/configuration/${id}`);
	}
}