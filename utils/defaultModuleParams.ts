export interface ModuleParams {
	id: number
	name: string
	type: string
	default_exp: string
	value?: any
	visible: boolean
	can_modify: boolean
	module_id?: number
	description?: string
	hasChildren?: boolean
	children?: Array<ModuleParams>
}

export const paramsModuleParams: ParamSchema<ModuleParams> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	type: { name: '字段类型', type: 'string' },
	default_exp: { name: '默认值', type: 'string' },
	description: { name: '备注', type: 'string' },
	visible: { name: '是否可见', type: 'boolean' }
}

export const arrayToParams: (arr: Array<ModuleParams>) => ParamSchema<any> = (arr) => { 
	let result: ParamSchema<any> = {}
	arr.forEach((item, index) => {
		result[index] = { name: item.name, type: item.type }
	})
	return result
}

export default (): ModuleParams => {
	return  {
		id: -1,
		name: '',
		type: '',
		default_exp: '',
		description: '',
		visible: true,
		can_modify: true,
		module_id: -1
	}
}