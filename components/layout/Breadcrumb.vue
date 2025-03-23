<template>
	<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
		<shadcn-sidebar-trigger class="-ml-1" />
		<shadcn-separator orientation="vertical" class="mr-2 h-4" />
		<div class="flex items-center gap-2">
			<button @click="router.back()" class="p-1 hover:bg-accent rounded-md">
				<LucideArrowLeft class="h-4 w-4" />
			</button>
			<button @click="router.forward()" class="p-1 hover:bg-accent rounded-md">
				<LucideArrowRight class="h-4 w-4" />
			</button>
			<shadcn-separator orientation="vertical" class="h-4" />
		</div>
		<ClientOnly>
			<shadcn-breadcrumb>
				<shadcn-breadcrumb-list>
					<shadcn-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
						<template v-if="index < breadcrumbs.length - 1">
							<shadcn-breadcrumb-link :href="item.path">
								{{ item.title }}
							</shadcn-breadcrumb-link>
							<shadcn-breadcrumb-separator />
						</template>
						<template v-else>
							<shadcn-breadcrumb-page>{{ item.title }}</shadcn-breadcrumb-page>
						</template>
					</shadcn-breadcrumb-item>
				</shadcn-breadcrumb-list>
			</shadcn-breadcrumb>
		</ClientOnly>
	</header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LucideArrowLeft, LucideArrowRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
	const paths = route.path.split('/').filter(Boolean)
	return paths.map((path, index) => {
		const fullPath = '/' + paths.slice(0, index + 1).join('/')
		return {
			title: path.charAt(0).toUpperCase() + path.slice(1),
			path: fullPath
		}
	})
})
</script>