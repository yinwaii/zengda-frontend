<template>
	<abstract-tree
		:items="[project]"
		:has-children="nodeHasChildren"
		:get-node-key="getNodeKey"
		:get-node-label="getNodeLabel"
		@node-click="handleNodeClick"
	>
		<!-- 自定义项目节点图标 -->
		<template #icon="{ node }">
			<LucideFolder v-if="isProject(node)" class="h-4 w-4" />
			<LucideBookTemplate v-else-if="isTemplate(node)" class="h-4 w-4" />
			<LucideFileText v-else-if="isSpecification(node)" class="h-4 w-4" />
		</template>
		
		<!-- 自定义子节点渲染 -->
		<template #children="{ node }">
			<!-- 项目子节点（模板） -->
			<abstract-tree-node
				v-if="isProject(node) && template"
				:node="template"
				:has-children="() => !!templateSystems.length || !!specification"
				@click="handleTemplateClick"
				@toggle="handleTemplateToggle"
			>
				<template #icon>
					<LucideBookTemplate class="h-4 w-4" />
				</template>
				
				<template #children>
					<!-- 模板子节点（系统） -->
					<div v-if="templateSystems.length > 0" class="space-y-1">
						<design-template-tree-wrapper
							:items="adaptedSystems as unknown as ZdPSystem[]" 
							@update:selected="handleTreeSelectedNodes"
							@update:open="handleTreeNodeExpanded"
						/>
					</div>
					
					<!-- 规格书节点 -->
					<abstract-tree-node
						v-if="specification"
						:node="specification"
						:has-children="() => !!(specification?.children?.length)"
						@click="handleSpecificationClick"
						@toggle="handleSpecificationToggle"
					>
						<template #icon>
							<LucideFileText class="h-4 w-4" />
						</template>
						
						<template #label>
							<span class="flex-1 truncate">规格书</span>
						</template>
						
						<template #children>
							<div v-if="specification.children" class="space-y-1">
								<design-specification-node 
									v-for="(child, index) in specification.children" 
									:key="index" 
									:spec="child" 
									@select="$emit('specification-node-select', $event)"
								/>
							</div>
						</template>
					</abstract-tree-node>
				</template>
			</abstract-tree-node>
		</template>
	</abstract-tree>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
	LucideFolder, 
	LucideBookTemplate, 
	LucideFileText 
} from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPSystemWithComponents } from '~/components/design/template/types'
import { extendSystem } from '~/components/design/template/adapter'

const props = defineProps<{
	project: ZdProject
	selectedProjectId?: number
}>()

const emit = defineEmits<{
	select: [project: ZdProject]
	'template-select': [template: ZdTemplate]
	'system-select': [system: ZdPSystem]
	'component-select': [componentId: number]
	'bom-select': [bomId: number]
	'specification-select': [spec: ZdSpecification]
	'specification-node-select': [spec: ZdSpecification]
}>()

// 状态控制
const isExpanded = ref(false)
const isTemplateExpanded = ref(false)
const isSpecificationExpanded = ref(false)

// 存储获取的数据
const template = ref<ZdTemplate | null>(null)
const templateSystems = ref<ZdPSystem[]>([])
const specification = ref<ZdSpecification | null>(null)

// 计算是否有子节点
const hasTemplateChildren = computed(() => templateSystems.value.length > 0 || !!specification.value)
const specificationHasChildren = computed(() => specification.value?.children && specification.value.children.length > 0)

// 实体API
const entityApis = useEntityApis()

// 类型检查
const isProject = (node: any): node is ZdProject => {
	return node && node.id === props.project.id
}

const isTemplate = (node: any): node is ZdTemplate => {
	return node && template.value && node.id === template.value.id
}

const isSpecification = (node: any): node is ZdSpecification => {
	return node && specification.value && node.id === specification.value.id
}

// 节点属性获取函数
const nodeHasChildren = (node: TreeNodeData): boolean => {
	if (isProject(node)) {
		return !!props.project.templateId
	}
	if (isTemplate(node)) {
		return !!templateSystems.value.length || !!specification.value
	}
	if (isSpecification(node)) {
		return !!(specification.value?.children && specification.value.children.length > 0)
	}
	return false
}

const getNodeKey = (node: TreeNodeData) => {
	if (isProject(node)) return `project-${node.id}`
	if (isTemplate(node)) return `template-${node.id}`
	if (isSpecification(node)) return `spec-${node.id}`
	return String(node.id)
}

const getNodeLabel = (node: TreeNodeData) => {
	return node.name || String(node.id)
}

// 事件处理函数
const handleNodeClick = (node: TreeNodeData) => {
	if (isProject(node)) {
		emit('select', node)
	}
}

const handleTemplateClick = (node: TreeNodeData) => {
	if (isTemplate(node)) {
		emit('template-select', node)
	}
}

const handleTemplateToggle = (node: TreeNodeData, expanded: boolean) => {
	isTemplateExpanded.value = expanded
	if (expanded && templateSystems.value.length === 0 && template.value) {
		fetchTemplateSystems()
	}
}

const handleSpecificationClick = (node: TreeNodeData) => {
	if (isSpecification(node)) {
		emit('specification-select', node)
	}
}

const handleSpecificationToggle = (node: TreeNodeData, expanded: boolean) => {
	isSpecificationExpanded.value = expanded
}

// 获取模板数据
const fetchTemplateData = async () => {
	if (!props.project.templateId) return
	
	try {
		console.log('正在获取模板数据，模板ID:', props.project.templateId)
		const templateData = await entityApis.template.get(props.project.templateId)
		template.value = templateData
		console.log('获取到模板数据:', templateData)
		
		// 立即获取模板系统数据，无需等待用户点击
		await fetchTemplateSystems()
		
		// 如果模板有规格书ID，获取规格书数据
		if (templateData.specId) {
			await fetchSpecificationData(templateData.specId)
		}
		
		// 自动展开模板节点，提升用户体验
		isTemplateExpanded.value = true
	} catch (error) {
		console.error('获取模板数据失败:', error)
	}
}

// 获取模板系统数据
const fetchTemplateSystems = async () => {
	if (!template.value) return
	
	try {
		console.log('正在获取模板系统数据，模板ID:', template.value.id)
		const response = await entityApis.template_psystem.getByTemplateId(template.value.id)
		templateSystems.value = response.list
		console.log('获取到模板系统数据, 数量:', response.list.length)
	} catch (error) {
		console.error('获取模板系统数据失败:', error)
	}
}

// 获取规格书数据
const fetchSpecificationData = async (specId: number) => {
	try {
		const response = await entityApis.specification.getAll(specId)
		specification.value = response
	} catch (error) {
		console.error('获取规格书数据失败:', error)
	}
}

// 修改适配系统列表的计算属性
const adaptedSystems = computed(() => {
	return templateSystems.value.map(system => extendSystem(system))
})

// 添加处理树节点选择的函数
const handleTreeSelectedNodes = (systems: ZdPSystemWithComponents[]) => {
	if (systems.length === 0) return
	
	const selectedSystem = systems[0]
	// 如果是组件节点
	if (selectedSystem.components && selectedSystem.components.length > 0) {
		emit('component-select', selectedSystem.components[0].componentId)
	} else {
		// 如果是系统节点，需要转换回ZdPSystem类型
		emit('system-select', {
			...selectedSystem,
			id: selectedSystem.systemId, // 确保有id字段
			children: selectedSystem.children as any // 类型兼容处理
		})
	}
}

// 添加处理树节点展开的函数
const handleTreeNodeExpanded = (system: ZdPSystemWithComponents) => {
	console.log('Tree node expanded:', system)
}

// 如果有selectedProjectId匹配当前项目，则自动展开
watch(() => props.selectedProjectId, (newId) => {
	if (newId === props.project.id && !isExpanded.value) {
		isExpanded.value = true
		if (!template.value && props.project.templateId) {
			fetchTemplateData()
		}
	}
}, { immediate: true })

// 项目ID变化时重新加载数据
watch(() => props.project, async (newProject) => {
	// 如果项目发生变化且不是加载中状态，自动获取模板数据
	if (newProject && newProject.templateId && newProject.name !== '加载中...') {
		isExpanded.value = true  // 自动展开项目节点
		await fetchTemplateData() // 获取模板数据
		
		// 如果获取到了模板，自动展开模板节点
		if (template.value) {
			isTemplateExpanded.value = true 
			await fetchTemplateSystems() // 获取模板系统数据
		}
	}
}, { immediate: true, deep: true })
</script> 