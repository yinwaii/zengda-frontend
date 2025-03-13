<script setup lang="ts" generic="TData">
import { type Table as TableType } from '@tanstack/vue-table'
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
	table: TableType<TData>
}>()
</script>

<template>
	<shadcn-dropdown-menu>
		<shadcn-dropdown-menu-trigger as-child>
			<shadcn-button variant="outline" size="sm" class="hidden h-8 ml-auto lg:flex">
				显示字段
				<ChevronDown class="w-4 h-4 ml-2" />
			</shadcn-button>
		</shadcn-dropdown-menu-trigger>
		<shadcn-dropdown-menu-content align="end" class="w-[150px]">
			<!-- <shadcn-dropdown-menu-label>显示/隐藏字段</shadcn-dropdown-menu-label>
			<shadcn-dropdown-menu-separator /> -->
			<shadcn-dropdown-menu-checkbox-item
				v-for="column in table.getAllColumns().filter((column) => column.getCanHide())" :key="column.id"
				class="capitalize" :modelValue="column.getIsVisible()" @update:modelValue="(value) => {
					column.toggleVisibility(!!value)
				}">
				{{ column.id }}
			</shadcn-dropdown-menu-checkbox-item>
		</shadcn-dropdown-menu-content>
	</shadcn-dropdown-menu>
</template>