export default defineNuxtPlugin(async (nuxtApp) => { 
	if (import.meta.client) {
		const VueOfficeDocx = await import("@vue-office/docx");
		nuxtApp.vueApp.component('VueOfficeDocx', VueOfficeDocx);
	}
})