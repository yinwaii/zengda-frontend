<template>
	
</template>
<script setup lang="ts">
// const onGetSpecification = async () => {
// 	try {
// 		const res = await $fetch('/doc/generate', {
// 			baseURL: useRuntimeConfig().public.baseUrl,
// 			method: 'post',
// 			body: { "data": props.arg },
// 			responseType: 'blob',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		});

// 		// const res = await api.arguments.querySpecification(props.arg);
// 		console.log(res);
// 		const blob = new Blob([res as BlobPart], {
// 			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
// 		});

// 		const url = window.URL.createObjectURL(blob);
// 		const link = document.createElement('a');
// 		link.href = url;

// 		link.download = `specification_${props.arg.name}.docx`;

// 		document.body.appendChild(link);
// 		link.click();
// 		document.body.removeChild(link);
// 		window.URL.revokeObjectURL(url);
// 	} catch (error) {
// 		console.error('下载规格书失败:', error);
// 	}
// }
</script>