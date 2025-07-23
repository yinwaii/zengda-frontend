export interface ZdComponent extends BasicProperty, TimeStamp {
	isShow: boolean	// 是否可见
	isRequired: boolean // 是否必须
	isDeleted: boolean // 是否已删除
	price?: string	// 价格计算公式/默认价格
	compValue?: string	// 价格
	bomId?: number	// 默认的BOM表
}