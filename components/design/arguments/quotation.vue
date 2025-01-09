<template>
	<el-form class="design-arguments-quotation" :inline="true" label-width="auto">
		<div>{{ arg.name }}</div>
		<el-tree :data="arg.children" node-key="id" default-expand-all :props="{ class: (data: any) => data?.type }"
			expand-on-click-node draggable>
			<template #default="{ data }">
				<el-form-item :label="data.name" label-position='left'>
					<el-tooltip effect="dark" :content="data.description+' '+data.default_exp" placement="left">
						<el-input size="small" v-model="data.value" v-if="data.type === 'float'" :disabled="true"/>
						<el-input size="small" v-model="data.value" v-else-if="data.type === 'int'"  :disabled="true"/>
						<el-input size="small" v-model="data.value" v-else-if="data.type === 'string'"  :disabled="true"/>
						<el-switch size="small" v-model="data.value" v-else-if="data.type === 'boolean'"  :disabled="true"/>
						<el-button size="small" type="primary" v-else-if="data.type === 'file'"  :disabled="true">上传</el-button>
						<el-select size="small" v-model="data.value" v-else-if="data.type.startsWith('selector')" :disabled="true">
							<el-option v-for="item in splitSelector(data.type)" :key="item" :label="item" :value="item" />
						</el-select>
						<span v-else-if="data.type === 'submodule'"></span>
						<span v-else>{{ (data.type as String) }}</span>
					</el-tooltip>
					<!-- node.parent.data.type === 'struct' ? 'top' : -->
				</el-form-item>
			</template>
		</el-tree>
		<div v-if="arg.value">产品总价 {{ arg.value }}</div>
	</el-form>
</template>

<script lang="ts" setup>
const props = defineProps({
	arg: { type: Object as PropType<ModuleParams>, required: true }
});



</script>

<style lang="scss" scoped>
.el-form {
	overflow-x: auto;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 0 10px 0;

	.el-tree {
		padding: 10px 0 10px 0;

		.el-tree-node__content {
			margin: 5px 0px 5px 0px;
			padding: 5px 0px 5px 0px;

			.el-form-item {
				margin-bottom: 0;

				.el-form-item__content {
					display: flex;
					flex-direction: column;

					.el-input,
					.el-switch,
					.el-button,
					.el-select {
						width: 100px;
					}
				}
			}

		}

		:deep(.el-tree-node.struct > .el-tree-node__children) {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.el-form-item {
				margin-right: 0 !important;

				.el-input,
				.el-switch,
				.el-button,
				.el-select {
					width: 50px;
				}
			}

			.el-tree-node:nth-child(n+2) .el-tree-node__content {
				padding-left: 0 !important;
			}
		}
	}
}
</style>