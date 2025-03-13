export interface ZdParameter extends BasicProperty, TimeStamp {
	isShow: boolean
	orderId?: number
	objectId: number
	objectType: string
	dtype?: string
	value: any
	isReadonly?: boolean
	isDeleted: boolean
}

export class ZdParameter implements ZdParameter {
	constructor() {
		this.id = -1;
		this.name = '';
		this.description = '';
		this.objectId = -1;
		this.objectType = '';
		this.value = '';
		this.isDeleted = false;
	}

	static get(id: number, type: string) {
		return useApis().get<ZdParameter>('/parameter/', { type, id });
	}

	static post(data: ZdParameter) {
		return useApis().post<ZdParameter>('/parameter/', data);
	}

	static postByBatch(data: Array<ZdParameter>) {
		return useApis().post<boolean>('/parameter/batch', data);
	}

	static putByBatch(data: Array<ZdParameter>) {
		return useApis().put<boolean>('/parameter/batch', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdParameter>(`/parameter/${id}`);
	}
}