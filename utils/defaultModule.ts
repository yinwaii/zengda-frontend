export interface Module {
	id: number
	name: string
	required: boolean
	visible: boolean
	parent_id?: number
	price: string
	description: string
	children: Array<Module>
	parameters: Array<ModuleParams>
	value?: any
}

export const paramsModule: ParamSchema<Module> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	price: { name: '默认值', type: 'string' },
	description: { name: '备注', type: 'string' },
	required: { name: '是否必须', type: 'boolean' },
	visible: { name: '是否可见', type: 'boolean' },
}

export default (): Module => {
	return {
		id: 0,
		name: '',
		price: '',
		description: '',
		required: false,
		visible: false,
		children: [],
		parameters: []
	}
}