<template>
	<div class="container">
		<el-col>
			<design-algorithm-selector v-model="rootArgument" />
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数列表" name="first">
					<design-algorithm-table :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="计算公式" name="second">
					<design-algorithm-template :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="报价单预览" name="third">
					<div class="preview">
						<design-arguments-form :arg="rootArgument.form" />
						<div class="editor">
							<embed src="/_nuxt/public/申丰库板报价单120℃.pdf" width="100%" height="100%" />
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-col>
	</div>
</template>

<script setup lang="ts">
const rootArgument = ref({ children: [], form: [] })
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

	.preview {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		min-height: 70vh;

		.design-arguments-form {
			width: 33%;
			padding: 0px 10px 0px 10px;
		}

		.editor {
			width: 66%;
			// padding: 0px 10px 0px 10px;
		}
	}
}
</style>