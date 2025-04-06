import { parseOriginalId, generateCompositeId } from './treeNodeFactory'

/**
 * ID转换工具 - 用于前端复合ID和后端原始ID之间的转换
 */

/**
 * 确保ID为原始数字ID (后端API使用)
 * 如果是复合ID，则提取其中的数字部分
 * @param id 任意格式的ID
 * @returns 原始数字ID
 */
export function toApiId(id: string | number | null | undefined): number | null {
	if (id === null || id === undefined) return null;

	try {
		// 如果输入已经是数字，直接返回
		if (typeof id === 'number') return id;

		// 字符串处理
		if (typeof id === 'string') {
			// 检查是否为包含冒号的复合ID
			if (id.includes(':')) {
				// 从最后一个冒号分隔符后取出数字部分
				const parts = id.split(':');
				const numericPart = parts[parts.length - 1];
				const parsed = parseInt(numericPart, 10);
				
				if (!isNaN(parsed)) {
					console.log(`toApiId: 从复合ID "${id}" 提取纯数字ID: ${parsed}`);
					return parsed;
				}
			} else {
				// 尝试直接转换为数字
				const parsed = parseInt(id, 10);
				if (!isNaN(parsed)) {
					console.log(`toApiId: 将字符串ID "${id}" 转换为数字: ${parsed}`);
					return parsed;
				}
			}
		}
		
		// 转换失败
		console.warn(`toApiId: 无法将 ${typeof id} 类型的值 "${id}" 转换为有效的API ID`);
		return null;
	} catch (err) {
		console.error(`toApiId: 转换ID "${id}" 时发生错误`, err);
		return null;
	}
}

/**
 * 确保一个对象中的ID字段为原始数字ID
 * 用于准备向后端API发送的数据
 * @param data 包含ID字段的对象
 * @param idField ID字段名，默认为'id'
 * @returns 转换后的对象（不修改原对象）
 */
export const prepareApiData = (
	data: Record<string, any>,
	idField: string = 'id'
): Record<string, any> => {
	if (!data || typeof data !== 'object') return data

	const result = { ...data }
	if (idField in result) {
		const apiId = toApiId(result[idField])
		if (apiId !== null) {
			result[idField] = apiId
		}
	}

	return result
}

/**
 * 确保ID为前端使用的复合ID格式
 * @param id 原始ID
 * @param type 节点类型
 * @returns 复合ID
 */
export const toFrontendId = (id: number | string | undefined | null, type: string): string | null => {
	if (id === undefined || id === null) return null

	// 如果已经是复合ID格式，检查前缀是否匹配
	if (typeof id === 'string' && id.includes(':')) {
		const parts = id.split(':')
		// 如果已经有正确的前缀，直接返回
		if (parts[0] === type) {
			console.log(`ID已经有正确前缀: ${id}`)
			return id
		}

		// 如果有不同前缀，可能需要提取原始ID部分
		const extractedId = parts[parts.length - 1]
		console.log(`从复合ID提取原始部分: ${id} -> ${extractedId}`)

		// 尝试转换为数字并验证
		const numId = Number(extractedId)
		if (!isNaN(numId)) {
			return generateCompositeId(type, numId)
		}
	}

	// 确保id是数字格式
	const numId = typeof id === 'number' ? id : Number(id)
	if (isNaN(numId)) {
		console.warn(`警告: 无法将ID "${id}" 转换为数字`);
		return null;
	}

	// 生成复合ID
	return generateCompositeId(type, numId)
}

/**
 * 批量转换API响应中的ID为前端使用的复合ID
 * @param items API返回的数据项数组
 * @param type 节点类型
 * @param idField ID字段名，默认为'id'
 * @returns 转换后的数组
 */
export const convertApiResponseIds = (
	items: Record<string, any>[],
	type: string,
	idField: string = 'id'
): Record<string, any>[] => {
	if (!items || !Array.isArray(items)) return items

	return items.map(item => {
		const result = { ...item }
		if (idField in result) {
			// 1. 处理ID - 首先判断是否已经是复合ID
			if (typeof result[idField] === 'string' && result[idField].includes(':')) {
				// 已经是复合ID，提取原始数字部分
				const parts = result[idField].split(':')
				const extractedId = parts[parts.length - 1]

				// 确保提取的部分是有效数字
				const numId = Number(extractedId)
				if (isNaN(numId)) {
					console.warn(`警告: 无法从复合ID "${result[idField]}" 提取有效数字`);
					return result;
				}

				// 设置原始ID为数字
				result['originalId'] = numId;

				// 如果前缀已经正确，保留原值，否则生成新的复合ID
				if (parts[0] === type) {
					console.log(`保留现有复合ID: ${result[idField]}`);
				} else {
					console.log(`重新生成复合ID: ${result[idField]} -> ${type}:${numId}`);
					result[idField] = generateCompositeId(type, numId);
				}
			} else {
				// 不是复合ID，正常处理
				const originalId = typeof result[idField] === 'number'
					? result[idField]
					: Number(result[idField]);

				// 确保originalId是一个有效的数字
				if (isNaN(originalId)) {
					console.warn(`警告: 无法将ID "${result[idField]}" 转换为数字`);
					return result;
				}

				// 保存原始数字ID
				result['originalId'] = originalId;

				// 设置复合ID
				const frontendId = generateCompositeId(type, originalId);
				console.log(`生成新的复合ID: ${result[idField]} -> ${frontendId}`);
				result[idField] = frontendId;
			}
		}
		return result
	})
}

/**
 * 批量转换多个字段的ID
 * @param data 包含多个ID字段的对象
 * @param fieldMap 字段映射 {字段名: 节点类型}
 * @returns 转换后的对象
 */
export const convertMultipleIds = (
	data: Record<string, any>,
	fieldMap: Record<string, string>
): Record<string, any> => {
	if (!data || typeof data !== 'object') return data

	const result = { ...data }

	for (const [field, type] of Object.entries(fieldMap)) {
		if (field in result) {
			const originalId = typeof result[field] === 'number'
				? result[field]
				: Number(result[field]);

			// 确保originalId是一个有效的数字
			if (isNaN(originalId)) {
				console.warn(`警告: 无法将字段 "${field}" 的值 "${result[field]}" 转换为数字`);
				continue;
			}

			// 保存原始数字ID
			result[`original_${field}`] = originalId;

			// 设置复合ID
			const frontendId = generateCompositeId(type, originalId);
			result[field] = frontendId;
		}
	}

	return result
} 