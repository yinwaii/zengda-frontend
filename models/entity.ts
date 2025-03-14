export interface BasicProperty {
	id: number;
	name: string;
	description?: string;
}

export interface TimeStamp {
	createdBy?: string;
	createdTime?: string;
	updatedBy?: string;
	updatedTime?: string;
}

export interface VOList<T> {
	list: Array<T>
}

export interface VOPaged<T> {
	content: Array<T>
	pageable: {
		sort: {
			sorted: boolean
			unsorted: boolean
			empty: boolean
		}
		offset: number
		pageSize: number
		pageNumber: number
		unpaged: boolean
		paged: boolean
	}
	totalPages: number
	totalElements: number
	last: boolean
	size: number
	number: number
	sort: {
		sorted: boolean
		unsorted: boolean
		empty: boolean
	}
	numberOfElements: number
	first: boolean
	empty: boolean
}
