export default async function <T>(asyncRes: Promise<ResOptions<T>>) {
	const { data } = await asyncRes;
	return data;
}