<template>
	<module-selector @update-module="onUpdateModule" />
	<div class="module-test">
		<module-form v-model="parameters" :can-modify="true" @update-price="onUpdatePrice" />
		<div class="module-main">
			<el-tabs v-model="activeName">
				<el-tab-pane label="报价计算" name="first">
					<module-form class="module-result" v-model="parameters" :can-modify="false" />
				</el-tab-pane>
				<el-tab-pane label="规格书预览" name="second">
					<module-specifications ref="specifications" :parameters="parameters" />
				</el-tab-pane>
				<el-tab-pane label="报价表预览" name="third">
					<!-- <module-template :mid="mid" /> -->
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
const api = useApi()
const activeName = ref('first')
const parameters = ref<ModuleParams>(await unpackApi(api.modules.queryDeepParameters(1)))
const specifications = useTemplateRef('specifications')
const onUpdateModule = async (id?: number) => {
	if (id)
		parameters.value = await unpackApi(api.modules.queryDeepParameters(id))
}
const onUpdatePrice = async (data: ModuleParams) => {
	parameters.value = await unpackApi(api.arguments.queryPriceParameters(data));
	specifications.value?.onGetSpecification();
	// specifications.value?.onGet
	// console.log(res);
}
</script>

<style lang="scss" scoped>
.module-test {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-height: 60vh;

	.module-form {
		width: 50%;
		margin: 10px;
	}

	.module-main {
		width: 50%;

		.module-result {
			width: 100%;
			margin: 10px;
		}
	}
}
</style>
