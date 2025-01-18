<template>
	<div class="module-form">
		<el-form class="design-arguments-form" :inline="true" label-width="auto">
			<div>{{ parameters.name }}</div>
			<el-tree ref="treeRef" :data="parameters.children" node-key="id" default-expand-all
				:props="{ class: (data: any) => data?.type }" :filter-node-method="filterNode" expand-on-click-node>
				<template #default="{ data }">
					<el-form-item :label="data.name" label-position='left'>
						<el-tooltip effect="dark" :content="data.description + ' ' + data.default_exp" placement="left">
							<el-input size="small" v-model="data.value" v-if="data.type === 'float'" :disabled="!$props.canModify" />
							<el-input size="small" v-model="data.value" v-else-if="data.type === 'int'"
								:disabled="!$props.canModify" />
							<el-input size="small" v-model="data.value" v-else-if="data.type === 'string'"
								:disabled="!$props.canModify" />
							<el-switch size="small" v-model="data.value" v-else-if="data.type === 'boolean'"
								:disabled="!$props.canModify" />
							<el-button size="small" type="primary" v-else-if="data.type === 'file'"
								:disabled="!$props.canModify">上传</el-button>
							<el-select size="small" v-model="data.value" v-else-if="data.type.startsWith('selector')"
								:disabled="!$props.canModify">
								<el-option v-for="item in splitSelector(data.type)" :key="item" :label="item" :value="item" />
							</el-select>
							<el-input size="small" v-model="data.quantity" type="primary" v-else-if="data.type === 'bomline'"
								:disabled="!$props.canModify"/>
							<span v-else-if="data.type === 'submodule'"></span>
							<span v-else>{{ (data.type as String) }}</span>
						</el-tooltip>
						<!-- node.parent.data.type === 'struct' ? 'top' : -->
					</el-form-item>
				</template>
			</el-tree>
			<div v-if="!$props.canModify">产品总价 {{ parameters.value }}</div>
			<el-button-group v-if="$props.canModify">
				<el-button type="primary" @click="onSave">保存</el-button>
			</el-button-group>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	canModify: boolean
}>();
const parameters = defineModel<ModuleParams>({required: true});
const emit = defineEmits<{
	(e: 'update-price', data: ModuleParams): void
}>();

const filterNode = (_: string, data: any) => {
	return props.canModify ? data.can_modify : !data.can_modify;
}
const treeRef = useTemplateRef('treeRef');
onMounted(() => {
	treeRef.value?.filter(parameters.value);
});
onUpdated(() => {
	treeRef.value?.filter(parameters.value);
});

const onSave = async () => {
	emit('update-price', parameters.value);
}
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