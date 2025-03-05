<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar';
// import type { SidebarData } from '';
const props = defineProps<{
	config?: SidebarProps
	data: SidebarData
}>()
</script>
<template>
	<shadcn-sidebar v-bind="props.config">
		<shadcn-sidebar-header>
			<!-- <layout-sidebar-version-switcher :versions="data.versions" :default-version="(data.versions[0] as string)" /> -->
			<layout-sidebar-search-form />
		</shadcn-sidebar-header>
		<shadcn-sidebar-content>
			<shadcn-sidebar-group v-for="item in props.data" :key="item.title">
				<shadcn-sidebar-group-label>{{ item.title }}</shadcn-sidebar-group-label>
				<shadcn-sidebar-group-content>
					<shadcn-sidebar-menu>
						<shadcn-sidebar-menu-item v-for="childItem in item.items" :key="childItem.title">
							<shadcn-sidebar-menu-button as-child :is-active="childItem.isActive">
								<a :href="childItem.url">{{ childItem.title }}</a>
							</shadcn-sidebar-menu-button>
						</shadcn-sidebar-menu-item>
					</shadcn-sidebar-menu>
				</shadcn-sidebar-group-content>
			</shadcn-sidebar-group>
		</shadcn-sidebar-content>
		<shadcn-sidebar-rail />
	</shadcn-sidebar>
</template>
