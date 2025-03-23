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
				<PSystemTree v-if="item.children" :items="item.children" @select="$emit('select', $event)" @component-select="$emit('componentSelect', $event)" />
			</div>
			<div v-if="item.components?.length && expandedKeys.includes(getKey(item))" class="ml-6 space-y-1">
				<div v-for="comp in item.components" :key="comp.id" class="flex items-center gap-1">
					<div class="w-6"></div>
					<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="$emit('componentSelect', comp.componentId)">
						<LucidePuzzle class="h-4 w-4" />
						<span class="flex-1">组件 {{ comp.componentId }}</span>
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