export interface ZdPriceItem {
	name: string
	totalPrice: number
	children: Array<ZdPriceItem>
	remark: string
}

export interface ZdPrice {
	configId: number
	totalPrice: number
	priceItems: Array<ZdPriceItem>
}