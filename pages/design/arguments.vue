<template>
	<div class="container">
		<el-col>
			<design-arguments-selector v-model="rootArgument" />
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数管理" name="first">
					<design-arguments-table :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="规格书设计" name="third">
					<!-- <div class="specifications"> -->
					<design-arguments-template :arg="rootArgument" />
					<!-- </div> -->
				</el-tab-pane>
				<el-tab-pane label="表单预览" name="second">
					<div class="preview">
						<design-arguments-form :arg="rootArgument" />
						<div class="editor">
							<embed src="/_nuxt/public/AZTH1000L-BT-Ver1.0_compressed.pdf" width="100%" height="100%" />
						</div>
						<!-- <utils-preview :src="'/assets/docs/AZTH1000L-BT-Ver1.0.docx'" :name="previewName"/> -->
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