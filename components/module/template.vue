<template>
			<div class="template-menu">
			<el-upload
				class="upload-demo" name="document"
				:action="useRuntimeConfig().public.baseUrl + `/doc/${$props.mid}`"
				:show-file-list="false"
				@on-success="onSuccess">
				<el-button type="primary">上传</el-button>
			</el-upload>
			<a :href="useRuntimeConfig().public.baseUrl + `/doc/${$props.mid}`"><el-button type="primary">下载</el-button></a>
			<el-button type="danger" @click="onDelete">删除</el-button>
		</div>
		<utils-word v-if="hasTemplate" :docx="useRuntimeConfig().public.baseUrl + `/doc/${$props.mid}`"/>
		<el-alert v-else title="请先上传模板" type="warning" />
</template>
<script setup lang="ts">
import type { UploadProps } from 'element-plus';
const api = useApi()

const props = defineProps<{
	mid: number
}>()

const hasTemplate = ref<boolean>(await unpackApi(api.documents.exist(props.mid)));

watch(() => props.mid, async (mid) => {
	hasTemplate.value = await unpackApi(api.documents.exist(mid))
})

const onSuccess: UploadProps['onSuccess'] = (response, file, fileList) => {
	console.log(response, file, fileList);
}

const onDelete = async () => {
	await unpackApi(api.documents.delete(props.mid))
	hasTemplate.value = false
}

</script>
<style lang="scss" scoped>
	.template-menu {
		display: flex;
		display-direction: row;
		.el-button {
			margin: 10px
		}
	}
</style>