<template>
	<div class="abstract-table">
		<el-table :data="$props.data" stripe :row-key="$props.rowKey" default-expand-all>
			<template v-for="(value, key) in $props.param">
				<el-table-column align="left" :prop="key.toString()" show-overflow-tooltip :label="value?.name">
					<template #default="{ row }">
						{{ value?.getItem(row)[key] }}
					</template>
				</el-table-column>
			</template>
			<basic-table-manager v-if="props.editable === true">
				<slot></slot>
			</basic-table-manager>
		</el-table>
	</div>
</template>

<script lang="ts" setup generic="T">
const props = defineProps<{
	param: GenericParamMap<T>
	data: T[]
	rowKey?: (row: T) => string
	editable?: boolean
}>()

</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;

	.insert-button {
		margin: 0 10px 0 10px;
	}
}
</style>