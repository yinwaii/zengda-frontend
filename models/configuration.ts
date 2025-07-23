export interface ZdConfiguration extends BasicProperty, TimeStamp {
	isShow: boolean
	templateId: number
	projectId: number
	lastVersionId: number
	valueConfig: string
	componentConfig: string
	docs: string
	isDeleted: boolean
	// bomConfig: 
}
