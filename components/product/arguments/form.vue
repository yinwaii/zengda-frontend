<template>
	<el-form class="product-arguments-form" :inline="true" label-width="auto">
		<div>模块名</div>
		<el-tree :data="rootArgument.children" node-key="id" default-expand-all :props="{ class: (data) => data.type }"
			expand-on-click-node draggable>
			<template #default="{ data, node }">
				<el-form-item :label="data.name" :label-position="node.parent.data.type === 'struct' ? 'top' : 'left'">
					<el-input size="small" v-if="data.type === 'string'" />
					<el-input size="small" v-if="data.type === 'number'" />
					<el-button size="small" type="primary" v-if="data.type === 'file'">上传</el-button>
					<el-row v-if="data.type === 'pair'">
						<el-col :span="5">
							<el-input size="small" />
						</el-col>
						<span>&nbsp; ~ &nbsp;</span>
						<el-col :span="5">
							<el-input size="small" />
						</el-col>
					</el-row>
				</el-form-item>
			</template>
		</el-tree>
		<el-button type="primary">保存</el-button>
	</el-form>
</template>

<script lang="ts" setup>
import { rootArgument } from 'assets/data/args'
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
			}

		}

		:deep(.el-tree-node.struct > .el-tree-node__children) {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.el-form-item {
				margin-right: 0 !important;

				.el-input {
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