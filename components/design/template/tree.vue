<template>
	<abstract-tree
		:items="treeItems"
		:get-node-key="getKey"
		:get-node-label="getTitle"
		:has-children="hasChildren"
		@node-click="handleClick"
	>
		<!-- 自定义图标 -->
		<template #icon="{ node }">
			<LucideFolder class="h-4 w-4" />
		</template>
		
		<!-- 子节点渲染 -->
		<template #children="{ node }">
			<!-- 常规子节点渲染（递归） -->
			<abstract-tree
				v-if="node.children?.length"
				:items="node.children"
				:get-node-key="getKey"
				:get-node-label="getTitle"
				:has-children="hasChildren"
				@node-click="handleClick"
			>
				<template #icon="{ node }">
					<LucideFolder class="h-4 w-4" />
				</template>
			</abstract-tree>
			
			<!-- 组件节点渲染 -->
			<div v-if="getOriginalSystem(node).components?.length" class="space-y-1">
				<design-component-tree-node 
					v-for="comp in getOriginalSystem(node).components || []" 
					:key="comp.id"
					:component="{ 
						componentId: comp.componentId, 
						description: componentDescriptions[comp.componentId], 
						bomId: componentBomIds[comp.componentId] 
					}" 
					@select="$emit('componentSelect', $event)"
					@bom-select="$emit('bomSelect', $event)"
				/>
			</div>
		</template>
	</abstract-tree>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import { LucideFolder } from 'lucide-vue-next'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { adaptSystemToTreeNode, getOriginalSystem } from './adapter'
import type { ZdPSystemWithComponents } from './types'

const props = defineProps<{
	items: TreeNodeData[]
}>()

const emit = defineEmits(['select', 'componentSelect', 'bomSelect'])

// treeItems现在直接使用items，因为已经适配过
const treeItems = computed(() => props.items)

const componentDescriptions = ref<Record<number, string>>({})
const componentBomIds = ref<Record<number, number>>({})
const entityApis = useEntityApis()

// 获取组件名称和BOM信息
const fetchComponentDetails = async (componentId: number) => {
	try {
		const component = await entityApis.component.get(componentId)
		if (component) {
			componentDescriptions.value[componentId] = component.name || component.description || `组件${componentId}`
			
			// 如果组件有bomId属性，保存它
			if (component.bomId) {
				componentBomIds.value[componentId] = component.bomId
			}
		} else {
			componentDescriptions.value[componentId] = `组件${componentId}`
		}
	} catch (error) {
		console.warn(`获取组件(${componentId})信息失败:`, error)
		componentDescriptions.value[componentId] = `组件${componentId}`
	}
}

// 获取所有组件名称和BOM信息
const fetchAllComponentDetails = async () => {
	try {
		const componentIds = new Set<number>()
		
		// 收集所有组件ID
		const collectComponentIds = (items: TreeNodeData[]) => {
			items.forEach(node => {
				const system = getOriginalSystem(node);
				if (system.components) {
					system.components.forEach((comp: ZdTComponent) => {
						if (comp.componentId) {
							componentIds.add(comp.componentId)
						}
					})
				}
				if (node.children) {
					collectComponentIds(node.children)
				}
			})
		}
		
		collectComponentIds(props.items)
		
		// 获取所有组件名称和BOM信息
		const promises = Array.from(componentIds).map(fetchComponentDetails)
		await Promise.allSettled(promises)
	} catch (error) {
		console.warn('获取组件信息列表失败:', error)
	}
}

// 监听items变化，获取组件名称
watch(() => props.items, async (newItems) => {
	await fetchAllComponentDetails()
}, { immediate: true })

// 节点属性函数
const getKey = (item: TreeNodeData): string => {
	return String(item.id)
}

const getTitle = (item: TreeNodeData): string => {
	return item.label || String(item.id)
}

const hasChildren = (item: TreeNodeData): boolean => {
	// 检查常规子节点
	if (item.children && item.children.length > 0) {
		return true
	}
	
	// 检查组件子节点
	const system = getOriginalSystem(item)
	return !!(system.components && system.components.length > 0)
}

// 事件处理
const handleClick = (item: TreeNodeData) => {
	const original = getOriginalSystem(item)
	// 转换为兼容格式并传给父组件
	emit('select', {
		...original,
		id: original.systemId || (original as any).id, // 确保id属性存在
		children: original.children as (ZdPSystem[] | null) // 类型强制转换
	})
}
</script> 