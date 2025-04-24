<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'

// defineProps<{
// 	payment: {
// 		id: string
// 	}
// }>()

defineEmits<{
	(e: 'expand'): void
	(e: 'edit'): void
	(e: 'delete'): void
}>()

function copy(id: string) {
	copyToClipboard(id)
	// navigator.clipboard.writeText(id)
}
</script>

<template>
	<shadcn-dropdown-menu>
		<shadcn-dropdown-menu-trigger as-child>
			<shadcn-button variant="ghost" class="w-8 h-8 p-0">
				<span class="sr-only">打开菜单</span>
				<MoreHorizontal class="w-4 h-4" />
			</shadcn-button>
		</shadcn-dropdown-menu-trigger>
		<shadcn-dropdown-menu-content align="end">
			<shadcn-dropdown-menu-label>操作</shadcn-dropdown-menu-label>
			<!-- <shadcn-dropdown-menu-item @click="copy(payment.id)">
				Copy payment ID
			</shadcn-dropdown-menu-item> -->
			<shadcn-dropdown-menu-item @click="$emit('expand')">
				展开
			</shadcn-dropdown-menu-item>
			<shadcn-dropdown-menu-separator />
			<shadcn-dropdown-menu-item @click="$emit('edit')">
				编辑
			</shadcn-dropdown-menu-item>
			<shadcn-dropdown-menu-item @click="$emit('delete')">
				删除
			</shadcn-dropdown-menu-item>
		</shadcn-dropdown-menu-content>
	</shadcn-dropdown-menu>
</template>