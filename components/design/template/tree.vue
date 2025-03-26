<template>
	<div class="space-y-1">
		<div v-for="item in items" :key="getKey(item)" class="space-y-1">
			<div class="flex items-center gap-1">
				<button v-if="hasChildren(item)" class="p-1 hover:bg-accent rounded-sm" @click="toggleExpand(item)">
					<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expandedKeys.includes(getKey(item)) }]" />
				</button>
				<div v-else class="w-6"></div>
				<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="handleClick(item)">
					<LucideFolder class="h-4 w-4" />
					<span class="flex-1">{{ getTitle(item) }}</span>
				</div>
			</div>
			<div v-if="hasChildren(item) && expandedKeys.includes(getKey(item))" class="ml-6 space-y-1">
				<design-template-tree v-if="item.children" :items="item.children" @select="$emit('select', $event)" @component-select="$emit('componentSelect', $event)" @bom-select="$emit('bomSelect', $event)" />
			</div>
			<div v-if="item.components?.length && expandedKeys.includes(getKey(item))" class="ml-6 space-y-1">
				<div v-for="comp in item.components" :key="comp.id" class="space-y-1">
					<design-component-tree-node 
						:component="{ 
							componentId: comp.componentId, 
							description: componentDescriptions[comp.componentId], 
							bomId: componentBomIds[comp.componentId] 
						}" 
						@select="$emit('componentSelect', $event)"
						@bom-select="$emit('bomSelect', $event)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ZdPSystem } from '~/models/entity/psystem'
import { ZdTComponent } from '~/models/entity/tcompoment'
import { LucideChevronRight, LucideFolder } from 'lucide-vue-next'

// 定义扩展的 ZdPSystem 类型，包含 components 属性
type ZdPSystemWithComponents = ZdPSystem & {
	components?: ZdTComponent[]
}

const props = defineProps<{
	items: ZdPSystemWithComponents[]
}>()

const emit = defineEmits<{
	select: [system: ZdPSystem]
	componentSelect: [componentId: number]
	bomSelect: [bomId: number]
}>()

const expandedKeys = ref<string[]>([])
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
		const collectComponentIds = (items: ZdPSystemWithComponents[]) => {
			items.forEach(item => {
				if (item.components) {
					item.components.forEach((comp: ZdTComponent) => {
						if (comp.componentId) {
							componentIds.add(comp.componentId)
						}
					})
				}
				if (item.children) {
					collectComponentIds(item.children)
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

const getKey = (item: ZdPSystem) => item.id.toString()

const getTitle = (item: ZdPSystem) => item.name

const hasChildren = (item: ZdPSystemWithComponents) => {
	return (item.children && item.children.length > 0) || (item.components && item.components.length > 0)
}

const toggleExpand = (item: ZdPSystem) => {
	const key = getKey(item)
	const index = expandedKeys.value.indexOf(key)
	if (index === -1) {
		expandedKeys.value.push(key)
	} else {
		expandedKeys.value.splice(index, 1)
	}
}

const handleClick = (item: ZdPSystem) => {
	emit('select', item)
}
</script> 