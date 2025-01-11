export default defineNuxtPlugin(async (nuxtApp) => { 
	if (import.meta.client) {
		const { Editor, Toolbar } = await import("@wangeditor/editor-for-vue");
		nuxtApp.vueApp.component('Toolbar', Toolbar);
		nuxtApp.vueApp.component('Editor', Editor);
	}
})