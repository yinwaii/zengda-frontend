export interface ProjectTemplate {
	id: number
	name: string
	product_type: string
	module_id: number
	default_config?: number
	create_time?: string
	update_time?: string
}

export interface ProjectTemplatePacket {
	template_list: Array<ProjectTemplate>
};

export const paramsProjectTemplate: ParamSchema<ProjectTemplate> = {
	// id: { name: 'id', type: 'int', isId: true },
	name: { name: '字段名称', type: 'string' },
	product_type: { name: '产品类型', type: 'string' },
	module_id: { name: '根模块', type: 'string', can_modify: false },
	default_config: { name: '默认配置', type: 'string' },
	create_time: { name: '创建时间', type: 'boolean', can_modify: false },
	update_time: { name: '更新时间', type: 'boolean', can_modify: false },
}

export const defaultProjectTemplate = (): ProjectTemplate => {
	return {
		id: -1,
		name: '',
		product_type: '',
		module_id: -1,
		default_config: -1,
		create_time: '',
		update_time: '',
	}
}