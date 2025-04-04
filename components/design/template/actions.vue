<template>
	<design-project-common-actions
		@edit="$emit('edit', template)"
		@delete="$emit('delete', template)"
	>
		<shadcn-dropdown-menu-item
			@click="$emit('clone', template)"
			class="cursor-pointer"
		>
			<LucideCopy class="mr-2 h-4 w-4" />
			复制模板
		</shadcn-dropdown-menu-item>
	</design-project-common-actions>
</template>

<script setup lang="ts">
import { LucideCopy } from 'lucide-vue-next'

const props = defineProps<{
	template: ZdTemplate
}>()

const emit = defineEmits<{
	(e: 'edit', template: ZdTemplate): void
	(e: 'delete', template: ZdTemplate): void
	(e: 'clone', template: ZdTemplate): void
}>()
</script> 