
export interface ZdTemplate extends BasicProperty, TimeStamp {
	isShow: boolean // 是否展示
	productTypeId: number
	productTypeName?: string
	isCustomized: boolean // 是否是自定义的
	isDeleted?: boolean
	specId?: number
	// lastVersionId?: string // 上个版本id
}