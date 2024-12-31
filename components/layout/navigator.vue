<template>
	<el-menu :collapse="false" :default-openeds="['/design']" default-active="/design/arguments" router>
		<el-sub-menu index="/design">
			<template #title>模板管理</template>
			<el-menu-item index="/design/arguments">模块管理</el-menu-item>
			<el-menu-item index="/design/algorithm">报价算法</el-menu-item>
			<el-menu-item index="/design/product">产品模板</el-menu-item>
			<el-menu-item index="/design/history">历史报价</el-menu-item>
		</el-sub-menu>
		<!-- <el-sub-menu index="/price">
			<template #title>报价管理</template>
			<el-menu-item index="/price/calculate">报价计算</el-menu-item>
			<el-menu-item index="/price/edify">报价校核</el-menu-item>
			<el-menu-item index="/price/specification">规格书管理</el-menu-item>
			<el-menu-item index="/price/bom">BOM表管理</el-menu-item>
		</el-sub-menu>
		<el-sub-menu index="/manage">
			<template #title>系统管理</template>
			<el-menu-item index="/manage/users">用户管理</el-menu-item>
			<el-menu-item index="/manage/record">活动记录</el-menu-item>
			<el-menu-item index="/manage/db">数据库管理</el-menu-item>
			<el-menu-item index="/manage/log">系统日志</el-menu-item>
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