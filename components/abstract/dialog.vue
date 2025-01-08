<template>
	<el-dialog v-model="model.isVisible" title="修改" width="500" align-center center>
		<el-form label-position="left" label-width="80px">
			<template v-for="(value, key) in $props.param">
				<el-form-item :label="value?.name" label-position='left'>
					<!-- <el-tooltip effect="dark" :content="data.description" placement="left"> -->
					<el-input size="small" v-model="model.data[key]" v-if="value?.type === 'float'" />
					<el-input size="small" v-model="model.data[key]" v-else-if="value?.type === 'int'" />
					<el-input size="small" v-model="model.data[key]" v-else-if="value?.type === 'string'" />
					<el-switch size="small" v-model="model.data[key]" v-else-if="value?.type === 'boolean'" />
					<el-button size="small" type="primary" v-else-if="value?.type === 'file'">上传</el-button>
					<el-select size="small" v-model="model.data[key]" v-else-if="value?.type?.startsWith('selector')">
						<el-option v-for="item in splitSelector(value?.type)" :key="item" :label="item" :value="item" />
					</el-select>
					<!-- <el-select size="small" v-model="model.data[key]" v-else-if="value?.type === 'type'">
						<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select> -->
					<span v-else-if="value?.type === 'submodule'"></span>
					<span v-else>{{ (value?.type as String) }}</span>
					<!-- </el-tooltip> -->
				</el-form-item>
			</template>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="onSave">保存</el-button>
				<el-button @click="onCancel">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import type { ParamOptions } from './table.vue';

export interface DialogModel<T> {
	isVisible: boolean
	data: T
	message: string
}

const model = defineModel<DialogModel<T>>({ required: true })

const emit = defineEmits<{
	(e: 'post-message', message: string, data: T): void
}>()

const typeOptions = [
	{ value: 'string', label: '字符串' },
	{ value: 'int', label: '整数' },
	{ value: 'float', label: '浮点数' },
	{ value: 'selector', label: '枚举' },
	{ value: 'boolean', label: '布尔' },
	{ value: 'file', label: '文件' },
	// { value: 'type', label: '类型' },
]

defineProps<{
	param: Partial<Record<keyof T, ParamOptions>>
}>()

const onSave = () => {
	emit('post-message', model.value.message, model.value.data)
	model.value.isVisible = false
}

const onCancel = () => {
	model.value.isVisible = false
}

</script>