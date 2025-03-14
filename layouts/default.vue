<script lang="ts">
export const iframeHeight = '800px'
export const description
	= 'A simple sidebar with navigation grouped by section.'
</script>
<template>
	<shadcn-sidebar-provider>
		<layout-sidebar :data="sidebarData" />
		<shadcn-sidebar-inset>
			<layout-breadcrumb />
			<slot></slot>
			<!-- <div class="flex flex-1 flex-col gap-4 p-4">
				<div class="grid auto-rows-min gap-4 md:grid-cols-3">
					<div class="aspect-video rounded-xl bg-muted/50" />
					<div class="aspect-video rounded-xl bg-muted/50" />
					<div class="aspect-video rounded-xl bg-muted/50" />
				</div>
				<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
			</div> -->
		</shadcn-sidebar-inset>
	</shadcn-sidebar-provider>
</template>