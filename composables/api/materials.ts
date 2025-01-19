export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		query(id: number) {
			return request.get<Material>(`/materials/${id}`);
		},
		queryAll() {
			return request.get<Array<Material>>(`/materials`);
		},
		insert(data: Material) {
			return request.post<Material>(`/materials`, {
				name: data.name,
				price: data.price,
				description: data.description,
			});
		},
		patch(id: number, data: Material) {
			return request.patch<PatchedData>(`/materials/${id}`, patchData({
				name: data.name,
				price: data.price,
				description: data.description,
			}));
		},
		delete(id: number) {
			return request.delete(`/materials/${id}`);
		},
		search(searchForm: Object) {
			return request.post<Array<Material>>(`/materials/search/`, searchForm);
		}
	};
}
