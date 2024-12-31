export default function <T extends Object>(data: T) {
	return {
		ops: Object.entries(data).map(([key, value]) => ({
			param: key,
			value: value,
		})),
	};
}