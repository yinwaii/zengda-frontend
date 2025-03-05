export interface Material {
	id: number
	name: string
	quantity?: number
	price: number
	description?: string
}

export const paramsMaterial: ParamSchema<Material> = {
	name: { name: '物料名称', type: 'string' },
	price: { name: '价格', type: 'float' },
	// quantity: { name: '数量', type: 'int' },
	description: { name: '备注', type: 'string' },
}

export const defaultMaterial = (): Material => {
	return {
		id: -1,
		name: '',
		price: 0,
		description: '',
	}
}