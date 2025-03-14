import type { SearchParameters } from 'ofetch';

export interface ResOptions<T> {
	data: T;
	code: number;
	message?: string;
	err?: string[];
}

class MyFetch {
	_fetch: typeof $fetch;
	constructor(baseUrl?: string) {
		this._fetch = $fetch.create({
			baseURL: baseUrl ?? "http://127.0.0.1:8080/api/"
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

	postRaw<T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) {
		return this._fetch<T>(url, { method: 'post', body, ...option });
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