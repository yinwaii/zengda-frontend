export interface ZdItem {
	itemId?: number
	name: string
	model?: string
	number?: string
	note?: string
	orderPrice: number
	erpcIsId: number
}

export interface ZdItemQuery {
	data: {
		name: string
		model: string
		helpCode: string
	}
	page: {
		current: string
		size: string
	}
}

export interface ZdItemPaged {
	records: Array<ZdItem>
	total: number
	size: number
	current: number
	pages: number
}