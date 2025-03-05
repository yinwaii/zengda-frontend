import parameters from "../.old/composables/api/parameters";
import modules from "../.old/composables/api/modules";
import materials from "../.old/composables/api/materials";
import documents from "../.old/composables/api/documents";
import materialsRecord from "../.old/composables/api/materialsRecord";
import projectTemplate from "../.old/composables/api/projectTemplate";
import project from "../.old/composables/api/project";

export default function (baseUrl?: string) {
	return {
		modules: modules(baseUrl),
		arguments: parameters(baseUrl),
		materials: materials(baseUrl),
		documents: documents(baseUrl),
		materialsRecord: materialsRecord(baseUrl),
		projectTemplate: projectTemplate(baseUrl),
		project: project(baseUrl)
	}
}