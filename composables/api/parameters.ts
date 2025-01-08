
export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		insert(data: ModuleParams) {
			return request.post<ModuleParams>(`/parameters`, {
				module_id: data.module_id,
				name: data.name,
				type: data.type,
				default_exp: data.default_exp,
				can_modify: data.can_modify,
			});
		},
		patch(id: number, data: any) {
			return request.patch<PatchedData>(`/parameters/${id}`, patchData({
				name: data.name,
				type: data.type,
				default_exp: data.default_exp,
				can_modify: data.can_modify,
			}));
		},
		delete(id: number) {
			return request.delete(`/parameters/${id}`);
		}
	}
};