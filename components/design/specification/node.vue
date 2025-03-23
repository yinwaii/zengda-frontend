<template>
	<div class="space-y-1">
		<div class="flex items-center gap-1">
			<button v-if="hasChildren" class="p-1 hover:bg-accent rounded-sm" @click="isExpanded = !isExpanded">
				<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isExpanded }]" />
			</button>
			<div v-else class="w-6"></div>
			<div 
				class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
				@click="$emit('select', spec)"
			>
				<LucideFileText class="h-4 w-4" />
				<span class="flex-1 truncate">{{ spec.name }}</span>
			</div>
		</div>
		
		<div v-if="hasChildren && isExpanded" class="ml-6 space-y-1">
			<div v-for="(child, index) in spec.children" :key="index" class="space-y-1">
				<design-specification-node 
					:spec="child" 
					@select="handleSelect" 
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucideFileText, LucideChevronRight } from 'lucide-vue-next'
import type { ZdSpecification } from '~/models/entity/specification'

const props = defineProps<{
	spec: ZdSpecification
}>()

const emit = defineEmits<{
	select: [spec: ZdSpecification]
}>()

const isExpanded = ref(true)

const hasChildren = computed(() => {
	return props.spec.children && props.spec.children.length > 0
})

const handleSelect = (spec: ZdSpecification) => {
	emit('select', spec)
}
</script> 