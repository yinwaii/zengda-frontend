<template>
	<el-menu :collapse="false" default-active="/modules" router>
		<el-menu-item index="/module">模块管理</el-menu-item>
		<el-menu-item index="/preview">效果预览</el-menu-item>
		<el-menu-item index="/project">项目管理</el-menu-item>
		<el-menu-item index="/projectTemplate">模板管理</el-menu-item>
		<!-- <el-sub-menu index="/project">
			<template #title>项目管理</template>
			<el-menu-item index="/project/projects">项目列表</el-menu-item>
			<el-menu-item index="/project/create">创建项目</el-menu-item>
			<el-menu-item index="/project/edit">项目编辑</el-menu-item>
		</el-sub-menu> -->
		<el-menu-item index="/materials/list">物料列表</el-menu-item>
		<!-- <el-sub-menu index="/materials">
			<template #title>物料管理</template>
			<el-menu-item index="/materials/list">物料列表</el-menu-item>
		</el-sub-menu> -->
	</el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
	min-height: calc(100vh - var(--header-height));
	--el-menu-bg-color: var(--el-fill-color-light);
	.el-menu-item.is-active {
		background-color: var(--el-color-primary-light-7);
		color: var(--el-text-color-primary);
	}
}
</style>