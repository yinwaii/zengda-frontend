export interface MaterialRecord {
	material: Material
	quantity: number
}

export const paramsMaterialRecord: ParamSchema<MaterialRecord> = {
	name: { name: '物料名称', type: 'string', getItem: (data: MaterialRecord) => data.material },
	price: { name: '价格', type: 'float', getItem: (data: MaterialRecord) => data.material },
	quantity: { name: '数量', type: 'int', getItem: (data: MaterialRecord) => data },
	description: { name: '备注', type: 'string', getItem: (data: MaterialRecord) => data.material },
}

export default (): MaterialRecord => {
	return {
		material: {
			id: -1,
			name: '',
			price: 0,
			description: '',
		},
		quantity: 0,
	}
}