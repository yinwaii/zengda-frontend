<template>
	<ClientOnly>
		<vue-office-docx :src="docx" class="vue-office" @rendered="renderedHandler" @error="errorHandler"
			:option="option" />
	</ClientOnly>
</template>

<script lang="ts" setup>
const docx = 'http://static.shanhuxueyuan.com/test6.docx' //设置文档网络地址，可以是相对地址
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
}
const errorHandler = () => {
	console.log("渲染失败")
}
</script>

<style lang="scss">
section.docx {
	//设置文档样式
	width: 100% !important;
}
</style>