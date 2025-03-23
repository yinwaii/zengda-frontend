<template>
	<div class="space-y-1">
		<template v-for="item in items" :key="item.id">
			<div class="flex items-center gap-1">
				<button v-if="item.children?.length" class="p-1 hover:bg-accent rounded-sm" @click="toggleExpand(item)">
					<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': expandedItems.includes(item.id) }]" />
				</button>
				<div v-else class="w-6"></div>
				<div
					class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
					:class="{ 'bg-accent': selectedItem?.id === item.id }"
					@click="handleSelect(item)"
				>
					<LucideBoxes class="h-4 w-4" />
					<span class="flex-1">{{ item.name }}</span>
				</div>
			</div>
			<div v-if="item.children?.length && expandedItems.includes(item.id)" class="ml-6">
				<ProjectTree :items="item.children" @select="handleSelect" @component-select="$emit('component-select', $event)" />
			</div>
			<div v-if="item.components?.length" class="ml-6">
				<div
					v-for="comp in item.components"
					:key="comp.id"
					class="flex items-center gap-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
					:class="{ 'bg-accent': selectedComponent?.id === comp.id }"
					@click="$emit('component-select', comp.componentId)"
				>
					<LucidePackage class="h-4 w-4" />
					<span class="flex-1">{{ comp.description || '未命名组件' }}</span>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucideChevronRight, LucideBoxes, LucidePackage } from 'lucide-vue-next'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdTComponent } from '~/models/entity/tcompoment'

interface Props {
	items: (ZdPSystem & { components?: ZdTComponent[] })[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'select', system: ZdPSystem): void
	(e: 'component-select', componentId: number): void
}>()

const expandedItems = ref<number[]>([])
const selectedItem = ref<ZdPSystem | null>(null)
const selectedComponent = ref<ZdTComponent | null>(null)

const toggleExpand = (item: ZdPSystem) => {
	const index = expandedItems.value.indexOf(item.id)
	if (index === -1) {
		expandedItems.value.push(item.id)
	} else {
		expandedItems.value.splice(index, 1)
	}
}

const handleSelect = (item: ZdPSystem) => {
	selectedItem.value = item
	selectedComponent.value = null
	emit('select', item)
}
</script> 