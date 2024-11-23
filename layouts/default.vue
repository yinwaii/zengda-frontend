<template>
	<el-container class="layout">
		<el-header>
			<layout-header></layout-header>
		</el-header>
		<el-container>
			<el-aside>
				<el-scrollbar>
					<layout-navigator></layout-navigator>
				</el-scrollbar>
			</el-aside>
			<el-container class="content">
				<el-scrollbar>
					<el-main>
						<slot></slot>
					</el-main>
					<el-footer>
						<layout-footer></layout-footer>
					</el-footer>
				</el-scrollbar>
			</el-container>
		</el-container>
	</el-container>
</template>

<style lang="scss" scoped>
.layout {
	height: 100vh;

	.el-header {
		box-shadow: var(--el-box-shadow-light);
		height: var(--header-height);
	}

	.el-aside {
		width: 200px;
		color: var(--el-text-color-primary);
	}

	.el-scrollbar {
		width: 100%;
		height: calc(100vh - var(--header-height));
	}

	.content {
		background-color: var(--el-fill-color);

		.el-main {
			padding: 0 16px 16px;
			min-height: calc(100vh - var(--header-height) - var(--footer-min-height) - 10px);
		}
	}

	.el-footer {
		min-height: var(--footer-min-height);
	}
}
</style>