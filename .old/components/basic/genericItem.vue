<template>
	<span v-if="value?.type === undefined"></span>
	<el-input size="small" v-model="model" v-else-if="value?.type === 'float'" />
	<el-input size="small" v-model="model" v-else-if="value?.type === 'number'" />
	<el-input size="small" v-model="model" v-else-if="value?.type === 'string'" />
	<el-button size="small" type="primary" v-else-if="value?.type === 'file'">上传</el-button>
	<el-switch size="small" v-model="model" v-else-if="value?.type === 'boolean' && model" />
	<el-select size="small" v-model="model" v-else-if="value?.type?.startsWith('selector') && model">
		<el-option v-for="item in splitSelector(value?.type)" :key="item" :label="item" :value="item" />
	</el-select>
	<span v-else-if="value?.type === 'submodule'"></span>
	<span v-else>{{ (value?.type as String) }}</span>
</template>

<script lang="ts" setup generic="T">
const model = defineModel<string | number | null>({ required: true })
defineProps<{
	value?: ParamOptions | ParamOptionsCustom<T>
}>()
</script>