<template>
	<div class="module-test">
		<module-tree ref="moduleTree" :id="1" />
		<div class="module-main">
			<el-tabs v-model="activeName">
				<el-tab-pane label="模块详情" name="first">
					<module-descriptions :mid="mid" />
					<!-- <el-divider /> -->
					<module-template :mid="mid" />
				</el-tab-pane>
				<el-tab-pane label="参数列表" name="second">
					<module-arguments :mid="mid" />
				</el-tab-pane>
				<!-- <el-tab-pane label="参数管理" name="first">
					<module-table :arg="params" @update-data="onUpdateModuleId" />
				</el-tab-pane>
				<el-tab-pane label="规格书设计" name="third">
					<design-arguments-template :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="表单预览" name="second">
					<div class="preview">
						<design-arguments-form :arg="params" @update-price-params="onUpdatePriceParams" />
						<design-arguments-quotation :arg="priceParams" />
					</div>
				</el-tab-pane> -->
			</el-tabs>
			<!-- <utils-quill></utils-quill> -->
			<!-- <utils-editor v-model="exampleText"></utils-editor> -->
			<!-- <utils-word></utils-word> -->
			<!-- <h1>参数列表</h1>
			<module-arguments :mid="mid" /> -->
		</div>
	</div>
</template>

<script setup lang="ts">
const activeName = ref('first')
const mid = ref(1)
const exampleText = ref('sdadsad')
provide('afterSelectedTree', (node: Module) => {
	mid.value = node.id
})
</script>

<style lang="scss" scoped>
.module-test {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-height: 60vh;

	.module-tree {
		width: 25%;
		margin: 10px;
	}

	.module-main {
		width: 75%;
	}
}
</style>
