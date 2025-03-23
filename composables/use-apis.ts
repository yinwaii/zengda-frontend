import type { SearchParameters } from 'ofetch';

export interface ResOptions<T> {
	data: T;
	success: boolean;
	code: number;
	message?: string;
	err?: string[];
}

async function fetchWithResponse<T>(url: string, options: any = {}): Promise<T> {
	try {
		const config = useRuntimeConfig()
		const response = await $fetch<ResOptions<T>>(url, { 
			baseURL: config.public.baseUrl,
			...options 
		});

		if (response.code !== 200) {
			throw new Error(response.err?.join(', ') ?? response.message);
		}

		return response.data;
	} catch (error) {
		throw error;
	}
}

export const useApis = () => {
	return {
		get: <T>(url: string, params?: SearchParameters, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'get', 
				params, 
				...option 
			});
		},

		post: <T>(url: string, body?: any, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'post', 
				body, 
				...option 
			});
		},

		postRaw: <T>(url: string, body?: any, option?: any) => {
			const config = useRuntimeConfig()
			return $fetch<T>(url, { 
				baseURL: config.public.baseUrl,
				method: 'post', 
				body, 
				...option 
			});
		},

		put: <T>(url: string, body?: any, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'put', 
				body, 
				...option 
			});
		},

		patch: <T>(url: string, body?: any, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'patch', 
				body, 
				...option 
			});
		},

		delete: <T>(url: string, body?: any, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'delete', 
				body, 
				...option 
			});
		}
	};
}; 