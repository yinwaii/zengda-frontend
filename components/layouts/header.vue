<template>
	<el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
		<el-menu-item index="0">
			<img src="/public/favicon.ico" alt="Element logo" />
			<el-text>增达科技报价系统</el-text>
		</el-menu-item>
		<el-sub-menu index="1">
			<template #title>个人中心</template>
			<el-menu-item index="1-1">我的报价（开发中）</el-menu-item>
			<el-menu-item index="1-2">我的项目（开发中）</el-menu-item>
			<el-menu-item index="1-3">我的模板（开发中）</el-menu-item>
		</el-sub-menu>
	</el-menu>
</template>

<style scoped>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
	margin-right: auto;
}
</style>