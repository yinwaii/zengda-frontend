<template>
	<div class="template-header">
		<h1>规格书</h1>
		<div class="template-menu">
			<el-upload
				class="upload-demo" name="document"
				:action="useRuntimeConfig().public.baseUrl + `/doc/${$props.mid}`"
				:show-file-list="false"
				@on-success="onSuccess">
				<el-button type="primary">上传</el-button>
			</el-upload>
			<el-button type="primary">保存</el-button>
		</div>
	</div>
	<utils-editor v-model="exampleText" />
</template>

<script lang="ts" setup>
import type { UploadProps } from 'element-plus';
const exampleText = ref('sdadsad')

defineProps<{
	mid: number
}>()

const onSuccess: UploadProps['onSuccess'] = (response, file, fileList) => {
	console.log(response, file, fileList);
}

</script>

<style lang="scss" scoped>
.template-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.template-menu {
		display: flex;
		display-direction: row;
		.el-button {
			margin: 10px
		}
	}
}
</style>