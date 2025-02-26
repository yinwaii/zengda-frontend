export interface Project {
	id: number
	name: string
	productType: string
	templateId: number
	description?: string
	jsonContent?: string
}

export interface ProjectPacket {
	project_list: Array<Project>
};

export const paramsProject: ParamSchema<Project> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	productType: { name: '产品类型', type: 'string' },
	templateId: { name: '模板来源', type: 'string' },
	description: { name: '项目备注', type: 'string' },
	jsonContent: { name: '项目raw内容', type: 'boolean' },
}

export default (): Project => {
	return {
		id: -1,
		name: '',
		productType: '',
		templateId: -1,
		description: '',
		jsonContent: '',
	}
}