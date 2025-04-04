<template>
	<design-project-common-actions
		@edit="$emit('edit', project)"
		@delete="$emit('delete', project)"
	>
		<shadcn-dropdown-menu-item
			@click="$emit('open-detail', project)"
			class="cursor-pointer"
		>
			<LucideExternalLink class="mr-2 h-4 w-4" />
			查看详情
		</shadcn-dropdown-menu-item>
	</design-project-common-actions>
</template>

<script setup lang="ts">
import { LucideExternalLink } from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'

const props = defineProps<{
	project: ZdProject
}>()

const emit = defineEmits<{
	(e: 'edit', project: ZdProject): void
	(e: 'delete', project: ZdProject): void
	(e: 'open-detail', project: ZdProject): void
}>()
</script> 