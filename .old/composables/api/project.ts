export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		query(id: number) {
			return request.get<Project>(`/projects/${id}`);
		},
		queryAll() {
			return request.get<ProjectPacket>(`/projects`);
		},
		insert(data: Project) {
			return request.post(`/templates`, { name: data.name, product_type: data.productType, description: data.description, product_template: data.templateId });
		},
		// patch(id: number, data: Material) {
		// 	return request.patch(`/templates/${id}`, data);
		// },
		delete(id: number) {
			return request.delete(`/templates/${id}`);
		},
		// search(searchForm: Object) {
		// 	return request.post<Array<Material>>(`/materials/search/`, searchForm);
		// }
	};
}
