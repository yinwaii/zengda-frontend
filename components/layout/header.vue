<template>
	<el-menu router mode="horizontal" :ellipsis="false">
		<nuxt-link class="logo" to="/">
			<img style="height: 60px" src="/assets/imgs/logo.png" alt="Element logo" />
			<el-text size="large" tag="b">上海增达科技股份有限公司</el-text>
		</nuxt-link>
		<el-sub-menu index="personal">
			<template #title>个人</template>
			<el-menu-item index="/personal/center">个人中心</el-menu-item>
			<el-menu-item index="/personal/settings">设置</el-menu-item>
			<el-menu-item index="/personal/login">退出</el-menu-item>
		</el-sub-menu>
	</el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
	background-color: transparent;

	.logo {
		display: flex;
		flex-direction: row;
		text-decoration: none;
	}

	&--horizontal {
		--el-menu-horizontal-height: var(--header-height);
	}

	.el-sub-menu {
		margin-left: auto;
	}
}
</style>