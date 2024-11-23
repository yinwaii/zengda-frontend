<template>
	<div class="container">
		<el-col>
			<product-selector></product-selector>
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数录入" name="first">
					<product-arg-table></product-arg-table>
				</el-tab-pane>
				<el-tab-pane label="渲染设置" name="second"></el-tab-pane>
				<el-tab-pane label="效果预览" name="third"></el-tab-pane>
			</el-tabs>
		</el-col>
	</div>
</template>

<script setup lang="ts">
const activeName = ref('first')
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;

	.el-tabs__content {
		padding: 32px;
		color: #6b778c;
		font-size: 32px;
		font-weight: 600;
	}
}
</style>