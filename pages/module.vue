<template>
	<module-selector @update-module="onUpdateModule" />
	<div class="module-test">
		<module-tree ref="moduleTree" :id="rootid" />
		<div class="module-main">
			<el-tabs v-model="activeName">
				<el-tab-pane label="模块详情" name="first">
					<module-descriptions :mid="mid" />
					<!-- <el-divider /> -->
					<module-editor :mid="mid" />
				</el-tab-pane>
				<el-tab-pane label="参数列表" name="second">
					<module-arguments :mid="mid" />
				</el-tab-pane>
				<el-tab-pane label="物料详情" name="third">
					<material-module-table :mid="mid" />
				</el-tab-pane>
				<el-tab-pane label="规格书管理" name="fourth">
					<module-template :mid="mid" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
const activeName = ref('first')
const mid = ref(1), rootid = ref(1)
provide('afterSelectedTree', (node: Module) => {
	mid.value = node.id
})
const onUpdateModule = (id?: number) => {
	if (id)
		mid.value = rootid.value = id
}
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
