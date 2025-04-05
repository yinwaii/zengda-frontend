import type { ZdTComponent } from '~/models/entity/tcompoment'

/**
 * 扩展的ZdTComponent类型，包含原始ID字段
 */
export interface ExtendedZdTComponent extends ZdTComponent {
	originalComponentId?: number
	originalPsystemId?: number
	originalTemplateId?: number
} 