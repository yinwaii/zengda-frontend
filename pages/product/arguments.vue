<template>
	<div class="container">
		<el-col>
			<product-arguments-selector></product-arguments-selector>
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数管理" name="first">
					<product-arguments-table></product-arguments-table>
				</el-tab-pane>
				<el-tab-pane label="表单设计" name="second">
					<product-arguments-form></product-arguments-form>
				</el-tab-pane>
				<el-tab-pane label="规格书预览" name="third"></el-tab-pane>
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