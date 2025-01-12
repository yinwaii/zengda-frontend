export default function (baseUrl?: string) {
	const request = useHttp(baseUrl);
	return {
		async exist(mid: number) {
			return await request.get<boolean>(`/doc/hasdoc/${mid}`);
		},
		async delete(mid: number) {
			return await request.delete(`/doc/${mid}`);
		}
	}
}
