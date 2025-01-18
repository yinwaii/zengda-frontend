<template>
	<ClientOnly>
		<el-scrollbar :height="docxHeight">
			<vue-office-docx :src="$props.docx" class="vue-office" @rendered="renderedHandler" @error="errorHandler"
				:option="option" />
		</el-scrollbar>
	</ClientOnly>
</template>

<script lang="ts" setup>
defineProps<{
	docx: string | ArrayBuffer
}>()
const docxHeight = ref('100%');
// const docx = 'http://static.shanhuxueyuan.com/test6.docx' //设置文档网络地址，可以是相对地址
const option = {
	className: "docx", //class name/prefix for default and document style classes
	inWrapper: true, //enables rendering of wrapper around document content
	ignoreWidth: false, //disables rendering width of page
	ignoreHeight: false, //disables rendering height of page
	ignoreFonts: false, //disables fonts rendering
	breakPages: true, //enables page breaking on page breaks
	ignoreLastRenderedPageBreak: false, //disables page breaking on lastRenderedPageBreak elements
	experimental: false, //enables experimental features (tab stops calculation)
	trimXmlDeclaration: true, //if true, xml declaration will be removed from xml documents before parsing
	useBase64URL: false, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
	useMathMLPolyfill: false, //includes MathML polyfills for chrome, edge, etc.
	showChanges: false, //enables experimental rendering of document changes (inserions/deletions)
	debug: false, //enables additional logging
}
const renderedHandler = () => {
	console.log("渲染完成")
	if (import.meta.client) {
		const docxElem = document.querySelector('div.docx-wrapper') as HTMLElement;
		const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
		const docxWidth = docxElem.offsetWidth;
		console.log(docxElem.offsetWidth, clientWidth);
		docxElem.style.zoom = `${docxWidth / clientWidth * 1.4}`;
		docxHeight.value = `${docxWidth * 1.414}px`;
	}
}
const errorHandler = () => {
	console.log("渲染失败")
}
</script>