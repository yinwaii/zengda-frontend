<template>
	<div class="quill-editor">
		<ClientOnly>
			<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
				mode="default" />
			<Editor style="height: 500px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
				@onCreated="handleCreated" />
		</ClientOnly>
	</div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
if (process.client) {
	const { Editor, Toolbar } = await import("@wangeditor/editor-for-vue");
	const { vueApp } = useNuxtApp();
	vueApp.component('Toolbar', Toolbar);
	vueApp.component('Editor', Editor);
}
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = defineModel(); // 内容 HTML
// 模拟 ajax 异步获取内容
onMounted(() => {
	setTimeout(() => {
		valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
	}, 1500);
});
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
