export interface ZdSpecification extends BasicProperty {
	url: string
	fileTag: string
	attributes: string
	children: Array<ZdSpecification>
	texts: object
	bools: object
	imgs: object
	tagGroups: any
}