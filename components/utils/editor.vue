<template>
	<div class="quill-editor">
		<ClientOnly>
			<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
				mode="default" />
			<Editor style="height: 100%; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
				@onCreated="handleCreated" />
		</ClientOnly>
	</div>
</template>

<script setup>
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = defineModel(); // 内容 HTML
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});
const handleCreated = (editor) => {
	editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style scoped lang="scss">
.editor {
	border: 1px solid #ccc;
}

:deep(.w-e-text-placeholder) {
	top: 10px;
}
</style>
