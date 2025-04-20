export interface ZdParameterArgument {
	id: number
	name: string
	type: string
	value: string
}

export interface ZdObjectArgument {
	objectType: string
	objectId: string
	arguments: Array<ZdParameterArgument>
	children: Array<ZdObjectArgument>
}

export interface ZdBomConfiguration {
	configId: number
	tcomponentId: number
	bomId: number
}

export interface ZdComponentConfiguration {
	configId: number
	tcomponentId: number
	enabled: number
	quantity: number
}
