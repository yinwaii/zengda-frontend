<template>
	<el-container>
		<el-aside width="200px">
			<el-scrollbar>
				<el-tree :load="loadNode" lazy :props="treeProps" @node-click="handleNodeClick" />
			</el-scrollbar>
		</el-aside>
		<el-main>
			<div v-if="isComponent && componentArgument" class="flex flex-col">
				<h2 class="text-lg font-bold">组件配置</h2>
				<el-form label-width="auto" label-position="left" style="max-width: 600px">
					<el-form-item label="数量">
						<el-input-number v-model="componentArgument.quantity" :min="1" :max="100" />
					</el-form-item>
					<el-form-item label="启用">
						<el-switch v-model="componentArgument.enabled" />
					</el-form-item>
				</el-form>
			</div>
			<div class="flex flex-col">
				<h2 class="text-lg font-bold">参数配置</h2>
				<el-form v-if="objectArgument && objectArgument.arguments.length > 0" label-width="auto" label-position="left" style="max-width: 600px">
					<el-form-item v-for="argument in objectArgument.arguments" :label="argument.name">
						<el-input v-model="argument.value" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSave">保存</el-button>
					</el-form-item>
				</el-form>
				<el-empty v-else description="当前对象不存在选项" />
			</div>
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
const objectArgument = ref<ZdObjectArgument>()
const componentConfigs = ref<ZdComponentConfiguration[]>()
const componentArgument = ref<ZdComponentConfiguration>()
const isComponent = ref(false)

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
onMounted(async () => {
	componentConfigs.value = await entityApis.component_configuration.get(props.configId)
})
const handleNodeClick = async (node: any) => {
	console.log(node)
	objectArgument.value = await entityApis.argument.get(props.configId, node.objectType, node.objectId)
	isComponent.value = node.objectType === 'component'
	if (isComponent.value) {
		const boms = await entityApis.bom.getByComponentId(node.objectId)
		if (boms.length > 0) {
			await entityApis.bom_configuration.update(props.configId, node.objectId, boms[0].id)
		}
		componentArgument.value = componentConfigs.value?.find((c) => c.tcomponentId === node.objectId)
	}
}
const handleSave = async () => {
	try {
		if (isComponent.value) {
			componentConfigs.value = componentConfigs.value?.map((c) => {
				if (c.tcomponentId === componentArgument.value?.tcomponentId) {
					return componentArgument.value
				}
				return c
			})
			await entityApis.component_configuration.update(props.configId, componentArgument.value)
		}
		await entityApis.argument.update(props.configId, objectArgument.value)
		ElMessage.success('保存成功')
	}
	catch (error) {
		ElMessage.error(error as string)
	}
}
</script>