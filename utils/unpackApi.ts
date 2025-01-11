export interface ParamOptions {
	name: string
	isId?: boolean
	type?: string
	description?: string
	can_modify?: boolean
}

export type ParamSchema<T> = Partial<Record<keyof T, ParamOptions>>

export default async function <T>(asyncRes: Promise<ResOptions<T>>) {
	const { data } = await asyncRes;
	return data;
}