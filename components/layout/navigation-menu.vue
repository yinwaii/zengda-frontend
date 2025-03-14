<script setup lang="ts">
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
defineProps<{
	root: string
}>()
</script>
<template>
	<shadcn-navigation-menu>
		<shadcn-navigation-menu-list>
			<shadcn-navigation-menu-item>
				<nuxt-link v-slot="{ isActive, href, navigate }" :to="`/design/${root}/table`" custom>
					<shadcn-navigation-menu-link :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
						总览
					</shadcn-navigation-menu-link>
				</nuxt-link>
			</shadcn-navigation-menu-item>
		</shadcn-navigation-menu-list>
	</shadcn-navigation-menu>
</template>