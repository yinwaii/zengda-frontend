import type { SearchParameters } from 'ofetch';

export interface ResOptions<T> {
	data: T;
	code: number;
	message?: string;
	err?: string[];
}

export interface GenericParam<T> {
	name: string
	type: string
	isreadonly?: boolean
	getItem: (data: any) => any
}

export class GenericParam<T> implements GenericParam<T> {
	constructor(name: string, type: string) {
		this.name = name;
		this.type = type;
		this.isreadonly = false;
		this.getItem = (data: any) => data ?? {};
	}
}

export type GenericParamMap<T> = Partial<Record<keyof T, GenericParam<T>>>

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

class MyFetch {
	_fetch: typeof $fetch;
	constructor(baseUrl?: string) {
		this._fetch = $fetch.create({
			baseURL: baseUrl ?? useRuntimeConfig().public.baseUrl
		});
	}

	async fetch<T>(url: string, args: any) {
		const data = await this._fetch<ResOptions<T>>(url, args);
		if (data.code !== 200) {
			throw new Error(data.err?.join(', ') ?? data.message);
		}
		return data.data;
	}

	get<T>(url: string, params?: SearchParameters, option?: any) {
		return this.fetch<T>(url, { method: 'get', params, ...option });
	}

	post<T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this.fetch<T>(url, { method: 'post', body, ...option });
	}

	postBlob(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this._fetch<Blob>(url, { method: 'post', body, ...option });
	}

	put<T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this.fetch<T>(url, { method: 'put', body, ...option });
	}

	patch<T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this.fetch<T>(url, { method: 'patch', body, ...option });
	}

	delete<T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this.fetch<T>(url, { method: 'delete', body, ...option });
	}

}

export const useApis = (baseUrl?: string) => { 
	let fetch = ref(new MyFetch(baseUrl));
	return fetch.value;
}