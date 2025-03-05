<template>
	<el-descriptions :title="$props.title" :column="2" border>
		<template #extra>
			<el-button type="primary" @click="onClick">修改</el-button>
		</template>
		<template #default>
			<template v-for="(value, key) in $props.param">
				<el-descriptions-item :label="value?.name">{{ data[key] }}</el-descriptions-item>
			</template>
		</template>
	</el-descriptions>
	<abstract-dialog v-model="dialogModel" :param="$props.param" @post-message="onSave" />
</template>

<script lang="ts" setup generic="T extends Record<string, any>">

const props = defineProps<{
	title: string
	param: ParamSchema<T>
	defaultValue: () => T
	data: T
}>()

const dialogModel = reactive({
	isVisible: false,
	message: 'update',
	data: props.defaultValue() as Record<string, any>
})

const emit = defineEmits<{
	(e: 'update-row', row: T): void
}>()

const onClick = () => {
	dialogModel.data = props.data
	dialogModel.isVisible = true
}

const onSave = (message: string, data: any) => {
	if (message === 'update' && data) {
		emit('update-row', data as T)
	}
}

</script>