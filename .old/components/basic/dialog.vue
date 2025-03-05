<template>
		<el-dialog v-model="isVisible" title="修改" width="500" align-center center>
			<slot></slot>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="onSave">保存</el-button>
					<el-button @click="onCancel">取消</el-button>
				</div>
			</template>
		</el-dialog>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">

const isVisible = ref(false)

const dialogData = inject<{
	isVisible: boolean
	message: string
	onClick: () => void
}>('dialog-data');

watch(() => dialogData?.isVisible, () => {
	if (dialogData) {
		isVisible.value = dialogData.isVisible
	}
})

const onSave = () => {
	if (dialogData) {
		dialogData.onClick()
		isVisible.value = false
	}
}

const onCancel = () => {
	if (dialogData) {
		isVisible.value = false
	}
}

</script>