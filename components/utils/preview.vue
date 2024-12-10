<template>
	<div class="center">
		<div class="center-file" :id="domId"></div>
	</div>
</template>

<script setup>
import { renderAsync } from "docx-preview";

const props = defineProps({
	// 传入文件url,[{src: '',name: '' }]
	wordInfo: {
		type: Object,
		default: () => { }
	}
});

// const domId = ref(`bodyContainer${new Date().getTime().toString()}`);
const domId = `bodyContainer_${Math.random().toString(36).substring(2, 15)}`;

watch(
	() => props.wordInfo,
	newVal => {
		if (newVal && newVal.src) {
			nextTick(() => {
				setTimeout(() => {
					getFileBlob();
				}, 20);
			});
		}
	},
	{ deep: true, immediate: true }
);
const getFileBlob = async () => {
	try {
		const url = props.wordInfo.src;
		if (!url) return;
		// const response = await $fetch('https://2009.filemail.com/api/file/get', {
		// 	query: {
		// 		filekey: 'zuzjG_arFWP1qwoZI3lAGwuCBcA7hQ7aPW4jlRVzBCJwf4OaDiBeZ6UPRlKAOP90AVbkdjB_wZYClw',
		// 		pk_vid: 'cdfb171dbec9b4ad173381816247c8db'
		// 	},
		// 	responseType: "blob"
		// });
		const response = await $fetch(url, { responseType: "blob" });
		const blob = response.data; // Blob | ArrayBuffer | Uint8Array, 可以是 JSZip.loadAsync 支持的任何类型
		let bodyContainer = document.getElementById(domId); // HTMLElement 渲染文档内容的元素,
		// null // HTMLElement, 用于呈现文档样式、数字、字体的元素。如果为 null，则将使用 bodyContainer。

		await renderDoc(blob, bodyContainer);
	} catch (error) {
		console.error("Error fetching the file:", error);
	}
};

const renderDoc = async (blob, container) => {
	try {
		await renderAsync(blob, container, null, {
			className: "docx",
			inWrapper: false,
			ignoreWidth: false,
			ignoreHeight: false,
			ignoreFonts: false,
			breakPages: false,
			ignoreLastRenderedPageBreak: false,
			experimental: false,
			trimXmlDeclaration: false,
			debug: false
		}).then(res => {
			console.log(res);
		});
	} catch (error) {
		console.error("Error rendering the document:", error);
	}
};
</script>

<style scoped lang="scss">
.center {
	width: 100vh;
	height: 100vh;
	background-color: #efefef;
	padding: 24px;
	box-sizing: border-box;

	.center-file {
		width: 100%;
		height: 100%;
		overflow: auto;
		background: #fff;
	}
}
</style>
