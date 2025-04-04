<template>
	<abstract-tree
		:items="[template]"
		:has-children="nodeHasChildren"
		:get-node-key="getNodeKey"
		:get-node-label="getNodeLabel"
		@node-click="handleNodeClick"
	>
		<!-- 自定义项目节点图标 -->
		<template #icon="{ node }">
			<LucideBookTemplate v-if="isTemplate(node)" class="h-4 w-4 text-blue-500" />
			<LucideLayoutGrid v-else-if="isPSystem(node)" class="h-4 w-4 text-purple-500" />
			<LucideFileText v-else-if="isSpecification(node)" class="h-4 w-4 text-green-500" />
			<LucideFolder v-else class="h-4 w-4 text-gray-500" />
		</template>
		
		<!-- 自定义子节点渲染 -->
		<template #children="{ node }">
			<!-- 模板子节点（系统） -->
			<div v-if="isTemplate(node) && systemsData.length > 0" class="space-y-1">
				<abstract-tree
					:items="adaptedSystems"
					:get-node-key="getKey"
					:get-node-label="getTitle"
					:has-children="hasChildren"
					@node-click="handleSystemClick"
				>
					<!-- 自定义图标 -->
					<template #icon="{ node }">
						<LucideLayoutGrid class="h-4 w-4 text-purple-500" />
					</template>
					
					<!-- 自定义组件节点 -->
					<template #children="{ node }">
						<!-- 常规子节点渲染（递归） -->
						<abstract-tree
							v-if="node.children?.length"
							:items="node.children"
							:get-node-key="getKey"
							:get-node-label="getTitle"
							:has-children="hasChildren"
							@node-click="handleSystemClick"
						>
							<template #icon="{ node }">
								<LucideLayoutGrid class="h-4 w-4 text-purple-500" />
							</template>
						</abstract-tree>
						
						<!-- 组件节点渲染 -->
						<div v-if="getOriginalSystem(node).components?.length" class="space-y-1">
							<div 
								v-for="comp in getOriginalSystem(node).components || []" 
								:key="comp.id || comp.componentId"
								class="flex items-center gap-1 py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer ml-1 border-l border-l-muted-foreground/30"
								@click.stop="handleComponentClick(comp)"
							>
								<LucidePuzzle class="h-4 w-4 text-green-500" />
								<span class="truncate flex-1">
									{{ getComponentLabel(comp) }}
								</span>
							</div>
						</div>
					</template>
				</abstract-tree>
			</div>
			
			<!-- 规格书节点 -->
			<abstract-tree-node
				v-if="isTemplate(node) && specification"
				:node="specification"
				:has-children="() => !!(specification?.children?.length)"
				@click="handleSpecificationClick"
				@toggle="handleSpecificationToggle"
			>
				<template #icon>
					<LucideFileText class="h-4 w-4 text-green-500" />
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
							@select="handleSpecificationNodeSelect"
						/>
					</div>
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
	LucideFileText,
	LucideLayoutGrid,
	LucidePuzzle
} from 'lucide-vue-next'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import type { ZdPSystemWithComponents } from '~/components/design/template/types'
import { extendSystem, addComponentsToSystem, adaptSystemToTreeNode, getOriginalSystem } from '~/components/design/template/adapter'

const props = defineProps<{
	template: ZdTemplate
}>()

const emit = defineEmits<{
	'template-select': [template: ZdTemplate]
	'system-select': [system: ZdPSystem]
	'component-select': [componentId: number]
	'specification-select': [spec: ZdSpecification]
	'specification-node-select': [spec: ZdSpecification]
}>()

// 状态控制
const isSpecificationExpanded = ref(false)

// 存储获取的数据
const systemsData = ref<ZdPSystem[]>([])
const specification = ref<ZdSpecification | null>(null)
const components = ref<ZdTComponent[]>([])

// 实体API
const entityApis = useEntityApis()

// 类型检查
const isTemplate = (node: any): node is ZdTemplate => {
	return node && node.id === props.template.id
}

const isPSystem = (node: any): node is ZdPSystem => {
	return node && node.id && systemsData.value.some(s => s.id === node.id)
}

const isSpecification = (node: any): node is ZdSpecification => {
	return node && specification.value && node.id === specification.value.id
}

// 节点属性获取函数
const nodeHasChildren = (node: TreeNodeData): boolean => {
	if (isTemplate(node)) {
		return true // 模板始终可能有子节点（系统或规格书）
	}
	if (isPSystem(node)) {
		return !!(node.children && node.children.length) || hasComponents(node as ZdPSystem)
	}
	if (isSpecification(node)) {
		return !!(specification.value?.children && specification.value.children.length > 0)
	}
	return false
}

const hasComponents = (system: ZdPSystem): boolean => {
	return components.value.some(c => c.psystemId === system.id)
}

const getNodeKey = (node: TreeNodeData) => {
	if (isTemplate(node)) return `template-${node.id}`
	if (isPSystem(node)) return `system-${node.id}`
	if (isSpecification(node)) return `spec-${node.id}`
	return String(node.id)
}

const getNodeLabel = (node: TreeNodeData) => {
	return node.name || String(node.id)
}

// 系统树相关方法
const getKey = (item: TreeNodeData): string => {
	return String(item.id)
}

const getTitle = (item: TreeNodeData): string => {
	return item.name || item.label || String(item.id)
}

const hasChildren = (item: TreeNodeData): boolean => {
	// 检查常规子节点
	if (item.children && item.children.length > 0) {
		return true
	}
	
	// 检查组件子节点
	const system = getOriginalSystem(item)
	return !!(system.components && system.components.length > 0)
}

// 事件处理函数
const handleNodeClick = (node: TreeNodeData) => {
	if (isTemplate(node)) {
		emit('template-select', node)
	}
}

const handleSystemClick = (node: TreeNodeData) => {
	const original = getOriginalSystem(node)
	// 将扩展的系统类型转换为ZdPSystem类型
	emit('system-select', {
		...original,
		id: original.systemId || (original as any).id, // 确保id字段
		children: original.children as (ZdPSystem[] | null) // 类型强制转换
	})
}

const handleComponentClick = (component: any) => {
	if (component.componentId) {
		emit('component-select', component.componentId)
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

const handleSpecificationNodeSelect = (spec: ZdSpecification) => {
	emit('specification-node-select', spec)
}

// 获取组件标签
const getComponentLabel = (component: any) => {
	if (component.name) return component.name
	if (component.description) return component.description
	if (component.componentId) return `组件${component.componentId}`
	return `组件${component.id || ''}` 
}

// 修改适配系统列表的计算属性
const adaptedSystems = computed(() => {
	// 先转换系统，再添加组件数据
	const systemsWithType = systemsData.value.map(system => extendSystem(system))
	// 添加组件数据到各系统
	const systemsWithComponents = systemsWithType.map(system => 
		addComponentsToSystem(system, components.value)
	)
	// 适配为树节点数据
	return systemsWithComponents.map(system => adaptSystemToTreeNode(system))
})

// 初始化获取数据
const fetchData = async () => {
	try {
		// 获取模板系统数据
		const systemsResponse = await entityApis.template_psystem.getByTemplateId(props.template.id)
		systemsData.value = systemsResponse.list || []
		
		// 获取模板组件数据
		const componentsResponse = await entityApis.template_component.getByTemplateId(props.template.id)
		components.value = (componentsResponse.list || []).map(comp => {
			// 如果组件没有psystemId但有templateId或componentId，尝试使用它们
			if (!comp.psystemId && (comp.templateId || comp.componentId)) {
				return { ...comp, psystemId: comp.templateId || comp.componentId };
			}
			return comp;
		})
		
		// 如果模板有规格书ID，获取规格书数据
		if (props.template.specId) {
			await fetchSpecificationData(props.template.specId)
		}
	} catch (error) {
		console.error('获取模板数据失败:', error)
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

// 组件挂载时获取数据
onMounted(() => {
	fetchData()
})

// 当模板变化时重新获取数据
watch(() => props.template, (newTemplate) => {
	if (newTemplate?.id) {
		fetchData()
	}
}, { deep: true })
</script>

<style scoped>
/* 添加定制样式 */
:deep(.tree-node) {
  padding-left: 4px;
}

:deep(.ml-6) {
  margin-left: 1.25rem;
}
</style> 