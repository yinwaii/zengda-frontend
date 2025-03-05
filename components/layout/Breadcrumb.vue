<template>
	<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
		<shadcn-sidebar-trigger class="-ml-1" />
		<shadcn-separator orientation="vertical" class="mr-2 h-4" />
		<shadcn-breadcrumb>
			<shadcn-breadcrumb-list>
				<shadcn-breadcrumb-item class="hidden md:block">
					<shadcn-breadcrumb-link href="#">
						Building Your Application
					</shadcn-breadcrumb-link>
				</shadcn-breadcrumb-item>
				<shadcn-breadcrumb-separator class="hidden md:block" />
				<shadcn-breadcrumb-item>
					<shadcn-breadcrumb-page>Data Fetching</shadcn-breadcrumb-page>
				</shadcn-breadcrumb-item>
			</shadcn-breadcrumb-list>
		</shadcn-breadcrumb>
	</header>
</template>