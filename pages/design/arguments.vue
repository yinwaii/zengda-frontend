<template>
	<div class="container">
		<el-col>
			<design-arguments-selector @update-module="onUpdateModuleId" />
			<el-tabs v-model="activeName">
				<el-tab-pane label="参数管理" name="first">
					<design-arguments-table :arg="params" />
				</el-tab-pane>
				<el-tab-pane label="规格书设计" name="third">
					<design-arguments-template :arg="rootArgument" />
				</el-tab-pane>
				<el-tab-pane label="表单预览" name="second">
					<div class="preview">
						<design-arguments-form :arg="params" />
						<div class="editor">
							<embed src="/_nuxt/public/AZTH1000L-BT-Ver1.0_compressed.pdf" width="100%" height="100%" />
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-col>
	</div>
</template>

<script setup lang="ts">
const api = useApi();
const rootArgument = ref<Module>({ id: -1, name: '', required: false, price: "", description: "", parameters: [], children: [], visible: true });
const params = ref<ModuleParams>({ id: -1, name: '', type: '', default_exp: '', can_modify: true, visible: true });
const activeName = ref('first')
const onUpdateModuleId = async (id?: number) => {
	if (id) {
		rootArgument.value = await unpackApi(api.modules.query(id));
		const deepParams = await unpackApi(api.modules.queryDeepParameters(id));
		clearEmptyChildren(deepParams);
		params.value = deepParams;
		console.log(params.value);
	}
}
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
			width: 50%;
			padding: 0px 10px 0px 10px;
		}

		.editor {
			width: 50%;
			// padding: 0px 10px 0px 10px;
		}
	}
}
</style>