
//home.js 传入的axios参数调用
export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		query(id: number) {
			return request.get<Module>(`/modules/${id}`);
		},
		queryAll() {
			return request.get<Array<Module>>(`/modules`);
		},
		queryDeepParameters(mid: number) {
			return request.get<ModuleParams>(`/modules/${mid}/deepParameters`);
		},
		// queryParameters(curModule: Module): ModuleParams {
		// 	const parameters = curModule.parameters;
		// 	const children = curModule.children;
		// 	parameters.push(...children.map((childModule) => this.queryParameters(childModule)));
		// 	const result = moduleToParam(curModule);
		// 	result.children = parameters;
		// 	return result;
		// },
		queryChildren(mid: number) {
			return request.get<Array<Module>>(`/modules/${mid}/children`);
		},
		insert(data: any) {
			return request.post<ModuleInsertRequest>(`/modules`, data);
		},
		patch(id: number, data: any) {
			return request.patch<PatchedData>(`/modules/${id}`, data);
		},
		delete(id: number) {
			return request.delete(`/modules/${id}`);
		}
	};
}
