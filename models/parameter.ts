export interface ZdParameter extends BasicProperty, TimeStamp {
	isShow: boolean
	orderId?: number
	objectId: number
	objectType: string
	dtype?: string
	unit?: string
	showType?: string
	argList?: string
	value: any
	isReadonly?: boolean
	isDeleted: boolean
}