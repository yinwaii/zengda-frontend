import parameters from "./api/parameters";
import modules from "./api/modules";

interface PatchedItem {
	param: string
	value: string
}

export interface PatchedData {
	ops: Array<PatchedItem>
}

export interface Module {
	id: number
	name: string
	required: boolean
	visible: boolean
	parent_id?: number
	price: string
	description: string
	children: Array<Module>
	parameters: Array<ModuleParams>
	value?: any
}

export interface ModuleParams {
	id: number
	name: string
	type: string
	default_exp: string
	value?: any
	visible: boolean
	can_modify: boolean
	module_id?: number
	description?: string
	hasChildren?: boolean
	children?: Array<ModuleParams>
}

export interface ModuleInsertRequest {
	name: string
	required: boolean
	price: string
	parent_id: number
	description: string
}

export { defaultModule } from './api/modules'

export default function (baseUrl?: string) {
	return {
		modules: modules(baseUrl),
		arguments: parameters(baseUrl),
	}
}