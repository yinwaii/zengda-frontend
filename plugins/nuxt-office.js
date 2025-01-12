export default defineNuxtPlugin(async (nuxtApp) => { 
	if (import.meta.client) {
		const VueOfficeDocx = await import("@vue-office/docx");
		const VueOfficeExcel = await import("@vue-office/excel");
		nuxtApp.vueApp.component('VueOfficeDocx', VueOfficeDocx);
		nuxtApp.vueApp.component('VueOfficeExcel', VueOfficeExcel);
	}
})