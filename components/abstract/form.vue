<template>
	<el-form label-position="left" label-width="80px">
		<template v-for="(value, key) in $props.param">
			<el-form-item :label="value?.name" label-position='left'>
				<!-- <el-tooltip effect="dark" :content="data.description" placement="left"> -->
				<el-input size="small" v-model="model[key]" v-if="value?.type === 'float'" />
				<el-input size="small" v-model="model[key]" v-else-if="value?.type === 'int'" />
				<el-input size="small" v-model="model[key]" v-else-if="value?.type === 'string'" />
				<el-switch size="small" v-model="model[key]" v-else-if="value?.type === 'boolean'" />
				<el-button size="small" type="primary" v-else-if="value?.type === 'file'">上传</el-button>
				<el-select size="small" v-model="model[key]" v-else-if="value?.type?.startsWith('selector')">
					<el-option v-for="item in splitSelector(value?.type)" :key="item" :label="item" :value="item" />
				</el-select>
				<!-- <el-select size="small" v-model="model[key]" v-else-if="value?.type === 'type'">
						<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select> -->
				<span v-else-if="value?.type === 'submodule'"></span>
				<span v-else>{{ (value?.type as String) }}</span>
				<!-- </el-tooltip> -->
			</el-form-item>
		</template>
	</el-form>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">

const model = defineModel<T>({ required: true })

defineProps<{
	param: Partial<Record<keyof T, ParamOptions>>
}>()

</script>