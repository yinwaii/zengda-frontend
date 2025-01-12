export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		insert(module_id: number, material_id: number) {
			return request.post(`/modules/${module_id}/materials/${material_id}`);
		},
		patch(module_id: number, material_id: number, quantity: number) {
			return request.patch<PatchedData>(`/modules/${module_id}/materials/${material_id}`, patchData({
				quantity: quantity
			}));
		},
		delete(module_id: number, material_id: number) {
			return request.delete(`/modules/${module_id}/materials/${material_id}`);
		},
	};
}