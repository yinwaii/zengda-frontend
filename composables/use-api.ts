import parameters from "./api/parameters";
import modules from "./api/modules";
import materials from "./api/materials";
import documents from "./api/documents";
import materialsRecord from "./api/materialsRecord";
import projectTemplate from "./api/projectTemplate";
import project from "./api/project";

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