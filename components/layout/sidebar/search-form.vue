<template>
	<form>
		<shadcn-sidebar-group class="py-0">
			<shadcn-sidebar-group-content class="relative">
				<label for="search" class="sr-only">
					Search
				</label>
				<shadcn-sidebar-input id="search" placeholder="Search the docs..." class="pl-8" />
				<lucide-search class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
			</shadcn-sidebar-group-content>
		</shadcn-sidebar-group>
	</form>
</template>