export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		insert(data: any) {
			return request.post<ModuleParams>(`/parameters`, data);
		},
		patch(id: number, data: any) {
			return request.patch<PatchedData>(`/parameters/${id}`, patchData(data));
		},
		delete(id: number) {
			return request.delete(`/parameters/${id}`);
		}
	}
};