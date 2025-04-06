import type { SearchParameters } from 'ofetch';
import { useGlobalAlert } from './use-global-alert'

export interface ResOptions<T> {
	data: T;
	success: boolean;
	code: number;
	message?: string;
	err?: string[];
}

// 添加fetchWithRawData函数，支持跨域请求
async function fetchWithRawData<T>(url: string, options: any = {}): Promise<T> {
	// 添加超时控制
	const controller = new AbortController()
	const timeoutId = setTimeout(() => {
		controller.abort()
		console.warn(`请求超时: ${url}`)
	}, 15000) // 15秒超时
	
	try {
		console.log('请求URL:', url)
		
		const response = await fetch(url, {
			...options,
			mode: 'cors', // 尝试使用cors模式
			credentials: 'include',
			headers: {
				...options.headers,
				'Accept': '*/*'
			},
			signal: controller.signal // 添加信号控制
		})

		// 清除超时
		clearTimeout(timeoutId)

		try {
			// 尝试获取blob数据
			const blob = await response.blob()
			if (blob.size === 0) {
				console.error('响应为空Blob')
				throw new Error('获取到的数据为空')
			}
			console.log('获取到Blob数据，大小:', blob.size, '类型:', blob.type)
			return blob as T
		} catch (error: any) {
			console.error('读取响应数据失败:', error)
			throw new Error('读取响应数据失败')
		}
	} catch (error: any) {
		// 清除超时
		clearTimeout(timeoutId)
		
		// 区分超时错误和其他错误
		if (error.name === 'AbortError') {
			console.error('请求超时:', url)
			throw new Error(`请求超时: ${url}`)
		}
		
		console.error('请求失败:', error)
		throw error
	}
}

async function fetchWithResponse<T>(url: string, options: any = {}, baseUrl?: string): Promise<T> {
	// 添加超时控制
	const controller = new AbortController()
	const signal = controller.signal
	const timeoutId = setTimeout(() => {
		controller.abort()
		console.warn(`请求超时: ${url}`)
	}, 15000) // 15秒超时
	
	try {
		const config = useRuntimeConfig()
		const response = await $fetch<ResOptions<T>>(url, { 
			baseURL: baseUrl || config.public.baseUrl,
			...options,
			signal // 添加信号控制
		});

		// 清除超时
		clearTimeout(timeoutId)

		if (response.code !== 200) {
			const errorMessage = response.err?.join(', ') ?? response.message ?? '请求失败'
			useGlobalAlert().show(errorMessage)
			throw new Error(errorMessage);
		}

		if (response.success === false) {
			const errorMessage = response.message ?? '操作失败'
			useGlobalAlert().show(errorMessage)
			throw new Error(errorMessage)
		}

		return response.data;
	} catch (error: any) {
		// 清除超时
		clearTimeout(timeoutId)
		
		// 区分超时错误和其他错误
		if (error.name === 'AbortError') {
			const errorMessage = `请求超时: ${url}`
			useGlobalAlert().show(errorMessage)
			console.error('请求超时:', url)
			throw new Error(`请求超时: ${url}`)
		}
		
		console.error('请求失败:', error, '请求URL:', url)
		throw error;
	}
}

export const useApis = (baseUrl?: string) => {
	const config = useRuntimeConfig()
	const apiBase = baseUrl || (config.public.apiBase as string) || ''

	return {
		get: <T>(url: string, params?: SearchParameters, option?: any) => {
			return fetchWithResponse<T>(url, { 
				method: 'get', 
				params, 
				...option 
			}, apiBase);
		},

		getRaw: <T>(url: string, params?: SearchParameters, option?: any) => {
			const fullUrl = new URL(url, apiBase)
			if (params) {
				Object.entries(params).forEach(([key, value]) => {
					fullUrl.searchParams.append(key, String(value))
				})
			}
			return fetchWithRawData<T>(fullUrl.toString(), option)
		},

		post: <T>(url: string, body?: any, option?: any) => {
			// 确保添加Content-Type头
			const headers = {
				'Content-Type': 'application/json',
				...(option?.headers || {})
			}
			
			return fetchWithResponse<T>(url, { 
				method: 'post', 
				body, 
				...option,
				headers
			}, apiBase);
		},

		postRaw: <T>(url: string, body?: any, option?: any) => {
			const fullUrl = new URL(url, apiBase)
			return fetchWithRawData<T>(fullUrl.toString(), {
				method: 'POST',
				body,
				...option
			})
		},

		put: <T>(url: string, body?: any, option?: any) => {
			// 确保添加Content-Type头
			const headers = {
				'Content-Type': 'application/json',
				...(option?.headers || {})
			}
			
			return fetchWithResponse<T>(url, { 
				method: 'put', 
				body, 
				...option,
				headers
			}, apiBase);
		},

		patch: <T>(url: string, body?: any, option?: any) => {
			// 确保添加Content-Type头
			const headers = {
				'Content-Type': 'application/json',
				...(option?.headers || {})
			}
			
			return fetchWithResponse<T>(url, { 
				method: 'patch', 
				body, 
				...option,
				headers
			}, apiBase);
		},

		delete: <T>(url: string, body?: any, option?: any) => {
			// 确保添加Content-Type头
			const headers = {
				'Content-Type': 'application/json',
				...(option?.headers || {})
			}
			
			return fetchWithResponse<T>(url, { 
				method: 'delete', 
				body, 
				...option,
				headers
			}, apiBase);
		}
	};
}; 