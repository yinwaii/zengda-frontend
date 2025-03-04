export interface ParamOptions {
	name: string
	isId?: boolean
	type?: string
	description?: string
	can_modify?: boolean
}

export interface ParamOptionsCustom<T> extends ParamOptions {
	getItem: (data: T) => any
}

export type ParamSchema<T> = Partial<Record<keyof T, ParamOptions>> | Record<string, ParamOptionsCustom<T>>

export default <T extends Record<string, any>>(data: T, schema?: ParamOptions | ParamOptionsCustom<T>) => {
	return schema ? 'getItem' in schema ? schema.getItem(data) : data : data;
}