export interface ZdPSystem extends BasicProperty, TimeStamp {
	isShow: boolean;
	docsUrl: null | string;
	parentId: number;
	children: Array<ZdPSystem> | null;
	parameters: Array<ModuleParams> | null;
}

export class ZdPSystem implements ZdPSystem {
	constructor() {
		this.id = -1;
		this.name = '';
		this.isShow = true;
		this.docsUrl = null;
		this.parentId = -1;
		this.description = '';
		this.children = null;
		this.parameters = null;
	}

	static getAll(require_tree: boolean = false) {
		return useApis().get<VOList<ZdPSystem>>('/psystem/tree', { require_tree });
	}

	static get(id: number) {
		return useApis().get<ZdPSystem>(`/psystem/${id}`);
	}

	static getByPage(page: number, size: number) {
		return useApis().get<VOPaged<ZdPSystem>>('/psystem/', { page, size });
	}

	static post(data: ZdPSystem) {
		return useApis().post<ZdPSystem>('/psystem/', data);
	}

	static put(data: ZdPSystem) {
		return useApis().put<ZdPSystem>('/psystem', data);
	}

	static delete(id: number) {
		return useApis().delete<ZdPSystem>(`/psystem/${id}`);
	}
}