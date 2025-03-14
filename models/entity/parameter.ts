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

export const ZdParameterColumns = getColumns<ZdParameter>([
	{ accessorKey: 'isShow', header: packHeader<ZdParameter>('是否显示') },
	{ accessorKey: 'orderId', header: packHeader<ZdParameter>('排序ID') },
	{ accessorKey: 'objectId', header: packHeader<ZdParameter>('对象ID') },
	{ accessorKey: 'objectType', header: packHeader<ZdParameter>('对象类型') },
	{ accessorKey: 'dtype', header: packHeader<ZdParameter>('数据类型') },
	{ accessorKey: 'value', header: packHeader<ZdParameter>('值') },
	{ accessorKey: 'isReadonly', header: packHeader<ZdParameter>('是否只读') },
	{ accessorKey: 'isDeleted', header: packHeader<ZdParameter>('是否删除') },
], true, true)

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