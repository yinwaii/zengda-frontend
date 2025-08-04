export interface ZdSpecificationRenderHistory {
	time: number
	record: string
	configId: number
}

export interface ZdSpecification extends BasicProperty, TimeStamp {
	params: object
	searchValue: string
	url: string
	fileTag: string
	latestVersionId: number
	hash?: string
	attributes?: string
	children: Array<ZdSpecification>
	texts: object
	bools: object
	imgs: object
	renderHistory: string
	versionLink: Array<ZdVersionNode>
	content?: string
}

export interface ZdSpecificationQuery extends BasicProperty {
	url: string
	fileTag: string
	children: Array<ZdSpecificationQuery>
	texts: object
	bools: object
	imgs: object
}

export interface ZdSpecificationMeta {
	name: string
	fileTag: string
	lastVersionId: number
}