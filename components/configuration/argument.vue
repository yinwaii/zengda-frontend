<template>
	<el-container>
		<el-aside width="200px">
			<el-scrollbar>
				<el-tree :load="loadNode" lazy :props="treeProps" />
			</el-scrollbar>
		</el-aside>
		<el-main>
		</el-main>
	</el-container>
</template>
<script setup lang="ts">
const props = defineProps<{
	configId: number
	templateId: number
}>()
const entityApis = useEntityApis()
const treeProps = {
	label: 'name',
	children: 'zones',
	isLeaf: 'leaf',
}
const loadNode = async (node: any, resolve: any) => {
	if (node.level === 0) {
		const template = await entityApis.template.get(props.templateId)
		resolve([{
			name: template.name,
			objectType: 'template',
			objectId: template.id
		}])
	}
	else if (node.data.objectType === 'template') {
		const tcomponents = (await entityApis.template_component.getByTemplateId(node.data.objectId)).list
		const components = await Promise.all(tcomponents.map(async (component: any) => await entityApis.component.get(component.id)))
		const component_nodes = components.map((component: any) => ({
			name: component.name,
			objectType: 'component',
			objectId: component.id,
			leaf: true
		}))
		const psystem_lists = (await entityApis.template_psystem.getByTemplateId(props.templateId)).list
		const psystems = await Promise.all(psystem_lists.map(async (psystem: any) => await entityApis.psystem.get(psystem.id)))
		const psystem_nodes = psystems.map((psystem: any) => ({
			name: psystem.name,
			objectType: 'psystem',
			objectId: psystem.id,
			leaf: false
		}))
		resolve(component_nodes.concat(psystem_nodes))
	}
	else if (node.data.objectType === 'psystem') {
		const component_lists = await entityApis.psystem_component.getAll(node.data.objectId)
		// console.log(component_lists)
		const components_res = await Promise.all(component_lists.map(async (id: number) => (await entityApis.component.get(id))))
		// console.log(components_res)
		const component_nodes = components_res.map((component: any) => ({
			name: component.name,
			objectType: 'component',
			objectId: component.id,
			leaf: true
		}))
		resolve(component_nodes)
	}
	else
		resolve([])
}
</script>