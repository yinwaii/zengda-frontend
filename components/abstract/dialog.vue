<template>
	<el-dialog v-model="model.isVisible" title="修改" width="500" align-center center>
		<abstract-form v-model="model.data" :param="$props.param"></abstract-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="onSave">保存</el-button>
				<el-button @click="onCancel">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">

export interface DialogModel<T> {
	isVisible: boolean
	data: T
	message: string
}

const model = defineModel<DialogModel<T>>({ required: true })

const emit = defineEmits<{
	(e: 'post-message', message: string, data: T): void
}>()

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