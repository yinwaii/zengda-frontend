<script setup lang="ts">
const iframeHeight = '800px'
const description = 'A simple sidebar with navigation grouped by section.'

// 导入SidebarData类型
// import type { SidebarData } from '@/models/sidebar'

// 侧边栏数据，符合SidebarNode接口要求
const sidebarData: any = [
	{
		title: '设计 / Design',
		url: '/design',
		items: [
			{
				title: '首页 / Home',
				url: '/design',
			},
			{
				title: '选件清单 / Bom',
				url: '/design/bom',
			},
			{
				title: '组件 / Component',
				url: '/design/component',
			},
			{
				title: '模块 / PSystem',
				url: '/design/psystem',
			},
			{
				title: '模板 / Template',
				url: '/design/template',
			},
			{
				title: '项目 / Project',
				url: '/design/project',
			},
		],
	},
	{
		title: '管理 / Management',
		url: '/manage',
		items: [
			{
				title: '产品类型 / PType',
				url: '/manage/ptype',
			},
		],
	},
	{
		title: '系统管理 / System',
		url: '/system',
		items: [
			{
				title: '用户管理 / User',
				url: '/system/user',
			},
			{
				title: '角色管理 / Role',
				url: '/system/role',
			},
			{
				title: '菜单管理 / Menu',
				url: '/system/menu',
			},
			{
				title: '部门管理 / Department',
				url: '/system/dept',
			},
		],
	},
]
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