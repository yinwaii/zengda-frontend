import type { SearchParameters } from 'ofetch';

// export interface ResOptions<T> {
// 	data: T;
// 	code: number;
// 	message?: boolean;
// 	err?: string[];
// }

export default function (baseUrl?: string) {
	const fetch = $fetch.create({
		baseURL: baseUrl ?? useRuntimeConfig().public.baseUrl
	});
	return {
		get: <T>(url: string, params?: SearchParameters, option?: any) => {
			return fetch<ResOptions<T>>(url, { method: 'get', params, ...option });
		},

		post: <T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) => {
			return fetch<ResOptions<T>>(url, { method: 'post', body, ...option });
		},

		postBlob: (url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) => {
			return fetch<Blob>(url, { method: 'post', body, ...option });
		},

		put: <T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) => {
			return fetch<ResOptions<T>>(url, { method: 'put', body, ...option });
		},

		patch: <T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) => {
			return fetch<ResOptions<T>>(url, { method: 'patch', body, ...option });
		},

		delete: <T>(url: string, body?: RequestInit['body'] | Record<string, any>, option?: any) => {
			return fetch<ResOptions<T>>(url, { method: 'delete', body, ...option });
		},
	}
};