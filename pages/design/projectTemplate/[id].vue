<template>
	<div class="flex gap-4 p-4 h-full">
		<div class="w-1/4 border-r overflow-auto">
			<div class="space-y-1">
				<div class="flex items-center gap-1">
					<button class="p-1 hover:bg-accent rounded-sm" @click="toggleTemplateExpand">
						<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isTemplateExpanded }]" />
					</button>
					<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="handleTemplateSelect">
						<LucideBookTemplate class="h-4 w-4" />
						<span class="flex-1">{{ selectedTemplate?.name || '项目模板' }}</span>
					</div>
				</div>
			</div>
			<div v-if="isTemplateExpanded" class="ml-6 mt-1">
				<PSystemTree :items="treeData" @select="handleSelect" @component-select="handleComponentSelect" />
			</div>
		</div>
		<div class="flex-1 overflow-auto">
			<template v-if="selectedTemplate">
				<TemplateDetail
					:template="selectedTemplate"
					:is-editing="isEditing"
					@edit="isEditing = true"
					@cancel="isEditing = false"
					@submit="handleTemplateSubmit"
				/>
			</template>
			<template v-else-if="selectedPSystem">
				<div class="space-y-6">
					<PSystemBasicInfo
						:system="selectedPSystem"
						:is-editing="isEditing"
						@edit="isEditing = true"
						@cancel="isEditing = false"
						@submit="handleSubmit"
					/>

					<PSystemInfo :system="selectedPSystem" />

					<PSystemParameters
						:parameters="parameterDetails"
						@update="handleParameterUpdate"
					/>
				</div>
			</template>
			<template v-else-if="selectedComponent">
				<ComponentDetail
					:component="selectedComponent"
					:is-editing="isEditing"
					@edit="isEditing = true"
					@cancel="isEditing = false"
					@submit="handleComponentSubmit"
				/>
			</template>
			<div v-else class="flex items-center justify-center h-full text-muted-foreground">
				请从左侧选择一个项目模板、系统或组件
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import PSystemTree from '~/components/design/template/PSystemTree.vue'
import PSystemBasicInfo from '~/components/design/template/PSystemBasicInfo.vue'
import PSystemInfo from '~/components/design/template/PSystemInfo.vue'
import PSystemParameters from '~/components/design/template/PSystemParameters.vue'
import ComponentDetail from '~/components/design/template/ComponentDetail.vue'
import TemplateDetail from '~/components/design/template/TemplateDetail.vue'
import { ZdPSystem } from '~/models/entity/psystem'
import { ZdTComponent } from '~/models/entity/tcompoment'
import { ZdParameter } from '~/models/entity/parameter'
import { ZdComponent } from '~/models/entity/component'
import { ZdTemplate } from '~/models/entity/template'
import { useEntityApis } from '~/composables/use-entity-apis'
import { LucideBookTemplate, LucideChevronRight } from 'lucide-vue-next'

// 添加 keepalive 配置
definePageMeta({
	name: 'psystem-detail'
})

const { id } = useRoute().params
const templateId = Number(id)
const data = ref<ZdPSystem[]>([])
const components = ref<ZdTComponent[]>([])
const selectedPSystem = ref<ZdPSystem | null>(null)
const selectedComponent = ref<ZdComponent | null>(null)
const selectedTemplate = ref<ZdTemplate | null>(null)
const parameterDetails = ref<ZdParameter[]>([])
const isEditing = ref(false)
const isTemplateExpanded = ref(true)
const entityApis = useEntityApis()

// 计算选中系统的关联组件
const selectedComponents = computed(() => {
	if (!selectedPSystem.value) return []
	return components.value.filter(comp => comp.psystemId === selectedPSystem.value?.id)
})

// 将扁平列表转换为树形结构，并关联组件
const buildTree = (items: ZdPSystem[]): (ZdPSystem & { components?: ZdTComponent[] })[] => {
	return items.map(item => ({
		...item,
		children: item.children ? buildTree(item.children) : null,
		parameters: item.parameters ? [...item.parameters] : null,
		components: components.value.filter(comp => comp.psystemId === item.id)
	}))
}

// 计算树形数据
const treeData = computed(() => buildTree(data.value))

// 切换模板展开状态
const toggleTemplateExpand = () => {
	isTemplateExpanded.value = !isTemplateExpanded.value
}

// 处理模板选择
const handleTemplateSelect = async () => {
	try {
		const template = await entityApis.template.get(templateId)
		selectedTemplate.value = template
		selectedPSystem.value = null
		selectedComponent.value = null
		isEditing.value = false
	} catch (error) {
		console.error('获取模板详情失败:', error)
	}
}

// 处理系统选择
const handleSelect = async (system: ZdPSystem) => {
	selectedPSystem.value = system
	selectedComponent.value = null
	selectedTemplate.value = null
	isEditing.value = false
	
	// 获取参数列表
	try {
		const response = await entityApis.parameter.get(system.id, 'psystem')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取参数列表失败:', error)
		parameterDetails.value = []
	}
}

// 处理组件选择
const handleComponentSelect = async (componentId: number) => {
	try {
		const component = await entityApis.component.get(componentId)
		selectedComponent.value = component
		selectedPSystem.value = null
		selectedTemplate.value = null
		isEditing.value = false
	} catch (error) {
		console.error('获取组件详情失败:', error)
	}
}

// 处理模板表单提交
const handleTemplateSubmit = async (form: Partial<ZdTemplate>) => {
	if (!selectedTemplate.value) return
	
	try {
		const updatedTemplate = await entityApis.template.update({
			...selectedTemplate.value,
			...form
		})
		selectedTemplate.value = updatedTemplate
		isEditing.value = false
	} catch (error) {
		console.error('更新模板失败:', error)
	}
}

// 处理表单提交
const handleSubmit = async (form: Partial<ZdPSystem>) => {
	if (!selectedPSystem.value) return
	
	try {
		const updatedSystem = await entityApis.psystem.update({
			...selectedPSystem.value,
			...form
		})
		selectedPSystem.value = updatedSystem
		isEditing.value = false
		// 刷新列表
		await fetchData()
	} catch (error) {
		console.error('更新系统失败:', error)
	}
}

// 处理组件表单提交
const handleComponentSubmit = async (form: Partial<ZdComponent>) => {
	if (!selectedComponent.value) return
	
	try {
		const updatedComponent = await entityApis.component.update({
			...selectedComponent.value,
			...form
		})
		selectedComponent.value = updatedComponent
		isEditing.value = false
		// 刷新列表
		await fetchData()
	} catch (error) {
		console.error('更新组件失败:', error)
	}
}

// 处理参数更新
const handleParameterUpdate = async (updatedParam: ZdParameter) => {
	try {
		await entityApis.parameter.updateBatch([updatedParam])
		// 刷新参数列表
		if (selectedPSystem.value) {
			const response = await entityApis.parameter.get(selectedPSystem.value.id, 'psystem')
			parameterDetails.value = response || []
		}
	} catch (error) {
		console.error('更新参数失败:', error)
	}
}

// 获取数据
const fetchData = async () => {
	try {
		const [systemResponse, componentResponse] = await Promise.all([
			entityApis.template_psystem.getByTemplateId(templateId),
			entityApis.template_component.getByTemplateId(templateId)
		])
		data.value = systemResponse.list
		components.value = componentResponse.list
	} catch (error) {
		console.error('获取数据失败:', error)
	}
}

// 页面加载时，默认选择模板
onMounted(async () => {
	await fetchData()
	await handleTemplateSelect()
})
</script>