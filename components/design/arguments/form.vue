<template>
	<el-form  class="design-arguments-form" :inline="true" label-width="auto">
		<div>{{ arg.name }}</div>
		<el-tree :data="arg.children" ref="treeRef" node-key="id" default-expand-all :props="{ class: (data: any) => data?.type }"
			:filter-node-method="filterNode"
			expand-on-click-node>
			<template #default="{ data }">
					<el-form-item :label="data.name" label-position='left'>
						<el-tooltip effect="dark" :content="data.description+' '+data.default_exp" placement="left">
							<el-input size="small" v-model="data.value" v-if="data.type === 'float'" :disabled="!data.can_modify"/>
							<el-input size="small" v-model="data.value" v-else-if="data.type === 'int'"  :disabled="!data.can_modify"/>
							<el-input size="small" v-model="data.value" v-else-if="data.type === 'string'"  :disabled="!data.can_modify"/>
							<el-switch size="small" v-model="data.value" v-else-if="data.type === 'boolean'"  :disabled="!data.can_modify"/>
							<el-button size="small" type="primary" v-else-if="data.type === 'file'"  :disabled="!data.can_modify">上传</el-button>
							<el-select size="small" v-model="data.value" v-else-if="data.type.startsWith('selector')" :disabled="!data.can_modify">
								<el-option v-for="item in splitSelector(data.type)" :key="item" :label="item" :value="item" />
							</el-select>
							<span v-else-if="data.type === 'submodule'"></span>
							<span v-else>{{ (data.type as String) }}</span>
						</el-tooltip>
						<!-- node.parent.data.type === 'struct' ? 'top' : -->
					</el-form-item>
			</template>
		</el-tree>

		<el-button-group>
			<el-button type="primary" @click="onSave">保存</el-button>
			<el-button type="primary" @click="onGetSpecification" :disabled="props === null">下载规格书</el-button>
		</el-button-group>

	</el-form>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'

const emit = defineEmits(['update-price-params'])
const treeRef = ref<InstanceType<typeof ElTree>>()

const props = defineProps({
	arg: { type: Object as PropType<ModuleParams>, required: true }
});



const defaultProps = {
	children: 'children',
	label: 'label',
}

const api = useApi();

const filterNode = (value: string, data: any, node: any) => {
	return data.can_modify;
}

onUpdated(() => {
	treeRef.value?.filter(props.arg);
});

const onSave = async () => {
	const res = await api.arguments.queryPriceParameters(props.arg);
	emit('update-price-params', res.data);
	// console.log(res);
}

const onGetSpecification = async () => {
	try {
		const res = await $fetch('/doc/generate', {
			baseURL: useRuntimeConfig().public.baseUrl,
			method: 'post',
			body: {"data": props.arg},
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// const res = await api.arguments.querySpecification(props.arg);
		console.log(res);
		const blob = new Blob([res as BlobPart], { 
			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		});
		
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		
		link.download = `specification_${props.arg.name}.docx`;
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error('下载规格书失败:', error);
	}
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