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
				<design-template-tree v-if="item.children" :items="item.children" @select="$emit('select', $event)" @component-select="$emit('componentSelect', $event)" />
			</div>
			<div v-if="item.components?.length && expandedKeys.includes(getKey(item))" class="ml-6 space-y-1">
				<div v-for="comp in item.components" :key="comp.id" class="flex items-center gap-1">
					<div class="w-6"></div>
					<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="$emit('componentSelect', comp.componentId)">
						<LucidePuzzle class="h-4 w-4" />
						<span class="flex-1">{{ componentNames[comp.componentId] || `组件 ${comp.componentId}` }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ZdPSystem } from '~/models/entity/psystem'
import { ZdTComponent } from '~/models/entity/tcompoment'
import { LucideChevronRight, LucideFolder, LucidePuzzle } from 'lucide-vue-next'

const props = defineProps<{
	items: (ZdPSystem & { components?: ZdTComponent[] })[]
}>()

const emit = defineEmits<{
	select: [system: ZdPSystem]
	componentSelect: [componentId: number]
}>()

const expandedKeys = ref<string[]>([])
const componentNames = ref<Record<number, string>>({})
const entityApis = useEntityApis()

// 获取组件名称
const fetchComponentName = async (componentId: number) => {
	if (componentNames.value[componentId]) return
	try {
		const component = await entityApis.component.get(componentId)
		componentNames.value[componentId] = component.name
	} catch (error) {
		console.error('获取组件名称失败:', error)
		componentNames.value[componentId] = `组件 ${componentId}`
	}
}

// 获取所有组件名称
const fetchAllComponentNames = async (items: (ZdPSystem & { components?: ZdTComponent[] })[]) => {
	for (const item of items) {
		if (item.components) {
			for (const comp of item.components) {
				await fetchComponentName(comp.componentId)
			}
		}
		if (item.children) {
			await fetchAllComponentNames(item.children)
		}
	}
}

// 监听items变化，获取组件名称
watch(() => props.items, async (newItems) => {
	await fetchAllComponentNames(newItems)
}, { immediate: true })

const getKey = (item: ZdPSystem) => item.id.toString()

const getTitle = (item: ZdPSystem) => item.name

const hasChildren = (item: ZdPSystem & { components?: ZdTComponent[] }) => {
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