<template>
	<div class="selector">
		<el-text size="large">模块： </el-text>
		<el-cascader placeholder="直接输入名称可搜索" :options="options" filterable !show-all-levels />
		<el-button type="primary">确认</el-button>
	</div>
</template>

<script lang="ts" setup>
import options from 'assets/data/product';
</script>

<style lang="scss" scoped>
.selector {
	padding: 10px 10px 0px 10px;

	.el-button {
		margin: 0 10px 0 10px;
	}
}
</style>