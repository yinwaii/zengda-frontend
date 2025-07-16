<template>
	<el-container>
		<el-header>
			<layouts-header />
		</el-header>
		<el-container>
			<el-aside width="150px" style="border-right: 1px solid #e4e7ed;">
				<el-scrollbar>
					<layouts-sidebar />
				</el-scrollbar>
			</el-aside>
			<el-main>
				<slot></slot>
			</el-main>
		</el-container>
		<el-footer>
			<layouts-footer />
		</el-footer>
	</el-container>
</template>