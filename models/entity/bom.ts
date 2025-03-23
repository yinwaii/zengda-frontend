export interface ZdBomChild {
	bomId: number
	itemId: number
	itemName: string
	note?: any
}

export interface ZdBom extends TimeStamp {
	params: any
	searchValue: string
	id: number
	componentId: number
	interId: number
	note: string
	number: string
	parentId: number
	version: string
	items: Array<ZdBomChild>
}