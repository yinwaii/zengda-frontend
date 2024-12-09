<template>
	<div class="container">
		<el-col>
			<product-arguments-selector v-model="rootArgument" />
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数管理" name="first">
					<product-arguments-table :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="规格书设计" name="third">
					<!-- <div class="specifications"> -->
					<product-arguments-template :arg="rootArgument" />
					<!-- </div> -->
				</el-tab-pane>
				<el-tab-pane label="表单预览" name="second">
					<div class="preview">
						<product-arguments-form :arg="rootArgument" />
						<utils-editor/>
						<!-- <el-input v-model="text" :autosize="{ minRows: 50 }" type="textarea" placeholder="Please input" /> -->
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-col>
	</div>
</template>

<script setup lang="ts">
const rootArgument = ref({children:[]})
const activeName = ref('first')
const text = ref('dasasdas')
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

		.product-arguments-form {
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