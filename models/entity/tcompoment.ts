export interface ZdTComponent extends TimeStamp {
	id: number
	psystemId: number
	templateId: number
	componentId: number
	description?: string
}

export class ZdTComponent implements ZdTComponent {
	constructor() {
		this.id = -1;
		this.psystemId = -1;
		this.templateId = -1;
		this.componentId = -1;
	}

	static getAll() {
		return useApis().get<VOList<ZdTComponent>>('/tcomponent/');
	}
	
	static post(data: ZdTComponent) {
		return useApis().post<ZdTComponent>('/tcomponent/', data);
	}

	static postByBatch(data: Array<ZdTComponent>) {
		return useApis().post<boolean>('/tcomponent/batch', data);
	}
	
	static put(data: ZdTComponent) {
		return useApis().put<ZdTComponent>('/tcomponent', data);
	}

	static putByBatch(data: Array<ZdTComponent>) {
		return useApis().put<boolean>('/tcomponent/batch', data);
	}
	
	static delete(id: number) {
		return useApis().delete<ZdTComponent>(`/tcomponent/${id}`);
	}
}