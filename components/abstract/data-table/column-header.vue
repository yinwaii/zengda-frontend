<script setup lang="ts" generic="TData, TValue">
import type { Column } from '@tanstack/vue-table'
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from '@radix-icons/vue'

defineProps<{
	column: Column<TData, TValue>
	title: string
}>()
</script>

<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<template>
	<div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
		<shadcn-dropdown-menu>
			<shadcn-dropdown-menu-trigger as-child>
				<shadcn-button variant="ghost" size="sm" class="-ml-3 h-8 data-[state=open]:bg-accent">
					<span>{{ title }}</span>
					<ArrowDownIcon v-if="column.getIsSorted() === 'desc'" class="w-4 h-4 ml-2" />
					<ArrowUpIcon v-else-if="column.getIsSorted() === 'asc'" class="w-4 h-4 ml-2" />
					<CaretSortIcon v-else class="w-4 h-4 ml-2" />
				</shadcn-button>
			</shadcn-dropdown-menu-trigger>
			<shadcn-dropdown-menu-content align="start">
				<shadcn-dropdown-menu-item @click="column.toggleSorting(false)">
					<ArrowUpIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					升序
				</shadcn-dropdown-menu-item>
				<shadcn-dropdown-menu-item @click="column.toggleSorting(true)">
					<ArrowDownIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					降序
				</shadcn-dropdown-menu-item>
				<shadcn-dropdown-menu-separator />
				<shadcn-dropdown-menu-item @click="column.toggleVisibility(false)">
					<EyeNoneIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					隐藏
				</shadcn-dropdown-menu-item>
			</shadcn-dropdown-menu-content>
		</shadcn-dropdown-menu>
	</div>

	<div v-else :class="$attrs.class">
		{{ title }}
	</div>
</template>