<template>
	<div class="selector">
		<el-text size="large">模块： </el-text>
		<el-cascader v-model="selected" :options="options" :props="props" 
			placeholder="直接输入名称可搜索"  filterable !show-all-levels />
		<el-button type="primary" @click="selectModule">确认</el-button>
	</div>
</template>

<script lang="ts" setup>
import type { CascaderProps, CascaderOption } from 'element-plus';

const options: CascaderOption[] = await $fetch('/api/modules/list');
const props: CascaderProps = {
	label: 'name',
	value: 'id',
}
const selected = ref<string>()
const rootArgument = defineModel()

const selectModule = async () => {
	if (selected.value)
		rootArgument.value = await $fetch(`/api/modules/detail?id=${selected.value.at(-1)}`)
}
</script>

<style lang="scss" scoped>
.selector {
	padding: 10px 10px 0px 10px;

	.el-button {
		margin: 0 10px 0 10px;
	}
}
</style>