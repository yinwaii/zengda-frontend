//home.js 传入的axios参数调用
export interface ModuleInsertRequest {
	name: string
	required: boolean
	price: string
	parent_id: number
	description: string
}
export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		query(id: number) {
			return request.get<Module>(`/modules/${id}`);
		},
		queryAll() {
			return request.get<Array<Module>>(`/modules`);
		},
		queryParameters(mid: number) {
			return request.get<Array<ModuleParams>>(`/modules/${mid}/parameters`);
		},
		queryDeepParameters(mid: number) {
			return request.get<ModuleParams>(`/modules/${mid}/deepParameters`);
		},
		queryMaterials(mid: number) {
			return request.get<Array<Material>>(`/modules/${mid}/materials`);
		},
		queryDeepMaterials(mid: number) {
			return request.get<Array<Material>>(`/modules/${mid}/deeoMaterials`);
		},
		queryChildren(mid: number) {
			return request.get<Array<Module>>(`/modules/${mid}/children`);
		},
		insert(data: Module) {
			return request.post<ModuleInsertRequest>(`/modules`, {
				name: data.name,
				required: data.required,
				parent_id: data.parent_id,
				price: data.price,
				description: data.description,
			});
		},
		patch(id: number, data: Module) {
			return request.patch<PatchedData>(`/modules/${id}`, patchData({
				name: data.name,
				required: data.required,
				price: data.price,
				description: data.description,
			}));
		},
		delete(id: number) {
			return request.delete(`/modules/${id}`);
		}
	};
}
