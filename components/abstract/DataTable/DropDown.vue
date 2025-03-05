<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-vue-next'

defineProps<{
	payment: {
		id: string
	}
}>()

defineEmits<{
	(e: 'expand'): void
}>()

function copy(id: string) {
	navigator.clipboard.writeText(id)
}
</script>

<template>
	<shadcn-dropdown-menu>
		<shadcn-dropdown-menu-trigger as-child>
			<Button variant="ghost" class="w-8 h-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="w-4 h-4" />
			</Button>
		</shadcn-dropdown-menu-trigger>
		<shadcn-dropdown-menu-content align="end">
			<shadcn-dropdown-menu-label>Actions</shadcn-dropdown-menu-label>
			<shadcn-dropdown-menu-item @click="copy(payment.id)">
				Copy payment ID
			</shadcn-dropdown-menu-item>
			<shadcn-dropdown-menu-item @click="$emit('expand')">
				Expand
			</shadcn-dropdown-menu-item>
			<shadcn-dropdown-menuSeparator />
			<shadcn-dropdown-menu-item>View customer</shadcn-dropdown-menu-item>
			<shadcn-dropdown-menu-item>View payment details</shadcn-dropdown-menu-item>
		</shadcn-dropdown-menu-content>
	</shadcn-dropdown-menu>
</template>