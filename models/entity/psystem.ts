export interface ZdPSystem extends BasicProperty, TimeStamp {
	isDeleted: boolean;
	docsUrl: null | string;
	parentId: number;
	specId: number | null;
	children: Array<ZdPSystem> | null;
	parameters: Array<ZdParameter> | null;
}

export const ZdPSystemColumns = getColumns<ZdPSystem>([
	{ accessorKey: 'isDeleted', header: packHeader<ZdPSystem>('是否被删除') },
	{ accessorKey: 'docsUrl', header: packHeader<ZdPSystem>('文档链接') },
	{ accessorKey: 'parentId', header: packHeader<ZdPSystem>('父ID') },
	{ accessorKey: 'children', header: packHeader<ZdPSystem>('子系统') },
	{ accessorKey: 'parameters', header: packHeader<ZdPSystem>('参数') },
], true, true)

export class ZdPSystem implements ZdPSystem {
	constructor() {
		this.id = -1;
		this.name = '';
		this.isDeleted = true;
		this.docsUrl = null;
		this.parentId = -1;
		this.description = '';
		this.children = null;
		this.parameters = null;
	}

	static getAll(require_tree: boolean = false) {
		return useApis().get<Array<ZdPSystem>>('/pSystem/tree', { require_tree });
	}

	static get(id: number) {
		return useApis().get<ZdPSystem>(`/pSystem/${id}`);
	}

	static getByPage(page: number, size: number) {
		return useApis().get<VOPaged<ZdPSystem>>('/pSystem/', { page, size });
	}

	static post(data: ZdPSystem) {
		return useApis().post<ZdPSystem>('/pSystem/', data);
	}

	static put(data: ZdPSystem) {
		return useApis().put<ZdPSystem>('/pSystem', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdPSystem>(`/pSystem/${id}`);
	}
}