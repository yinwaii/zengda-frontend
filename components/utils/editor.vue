<template>
	<div class="editor" v-loading.fullscreen.lock="fullLoading">
		<component :is="toolBarComponent" style="border-bottom: 1px solid #ccc" :editor="editorRef"
			:defaultConfig="toolbarConfig" mode="default" />
		<component :is="editorComponent" v-model="valueHtml"
			:defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" @onChange="returnHtml" />
	</div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

const emit = defineEmits([''])
// 上传显示loading
const fullLoading = ref(false)
// 工具栏
const toolBarComponent = ref(null)
// 编辑组件
const editorComponent = ref(null)
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef(null);
// 内容 HTML 
const valueHtml = defineModel();
// 工具栏默认配置
const toolbarConfig = {};
// 输入框配置
const editorConfig = {
	placeholder: "请输入内容...",
	readOnly: false
};

// 动态组件赋值
if (import.meta.client) {
	const { Editor, Toolbar } = await import("@wangeditor/editor-for-vue");
	editorComponent.value = Editor
	toolBarComponent.value = Toolbar
}

// 记录 editor 实例，重要！
const handleCreated = (editor) => {
	editorRef.value = editor;
};

// 返回内容
const returnHtml = async () => {
	emit('changeHtml', valueHtml.value)
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});


</script>

<style scoped lang="scss">
.editor {
	border: 1px solid #ccc;
}

:deep(.w-e-text-placeholder) {
	top: 10px;
}
</style>
