export interface ZdBomChild {
	bomId: number
	itemId: number
	itemName: string
	note?: string
}

export interface ZdBom extends TimeStamp {
	params: any
	searchValue: string
	id: number
	componentId: number // 组件id
	tcomponentId: number // 模板组件id
	interId: number // bom内码
	note: string // 备注
	number: string // bom单号
	parentId: number // 上级bomId
	lastVersionId: string // 历史版本id
	version: string // 版本
	price: number // 价格
	isDeleted: boolean // 是否已删除
	items: Array<ZdBomChild>
}