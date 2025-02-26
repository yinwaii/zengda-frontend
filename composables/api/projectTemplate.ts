export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		query(id: number) {
			return request.get<ProjectTemplate>(`/templates/${id}`);
		},
		queryAll() {
			return request.get<ProjectTemplatePacket>(`/templates`);
		},
		insert(data: ProjectTemplate) {
			return request.post(`/templates`, data);
		},
		patch(id: number, data: ProjectTemplate) {
			return request.patch(`/templates/${id}`, data);
		},
		delete(id: number) {
			return request.delete(`/templates/${id}`);
		},
		// search(searchForm: Object) {
		// 	return request.post<Array<Material>>(`/materials/search/`, searchForm);
		// }
	};
}
