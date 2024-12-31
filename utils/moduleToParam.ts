export default function (childModule: Module): ModuleParams {
	return {
		id: childModule.id,
		type: 'submodule',
		name: childModule.name,
		description: childModule.description,
		default_exp: childModule.price,
		visible: childModule.visible,
		can_modify: true,
		module_id: childModule.parent_id,
		value: childModule.value,
		hasChildren: true,
		children: []
	};
}