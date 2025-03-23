<template>
	<div class="flex gap-4 p-4 h-full">
		<div class="w-1/4 border-r overflow-auto">
			<div class="space-y-1">
				<div class="flex items-center gap-1">
					<button class="p-1 hover:bg-accent rounded-sm" @click="toggleTemplateExpand">
						<lucide-chevron-right :class="['h-4 w-4 transition-transform', { 'rotate-90': isTemplateExpanded }]" />
					</button>
					<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
						@click="handleTemplateSelect">
						<lucide-book-template class="h-4 w-4" />
						<span class="flex-1">{{ selectedTemplate?.name }}</span>
					</div>
				</div>
			</div>
			<div v-if="isTemplateExpanded" class="ml-6 mt-1">
				<design-template-tree 
					:items="treeData" 
					@select="handleSelect" 
					@component-select="handleComponentSelect" 
				/>
				
				<!-- 规格书项 -->
				<div v-if="selectedTemplate?.specId && specificationData" class="space-y-1 mt-2">
					<div class="flex items-center gap-1">
						<button class="p-1 hover:bg-accent rounded-sm" @click="isSpecificationExpanded = !isSpecificationExpanded">
							<lucide-chevron-right :class="['h-4 w-4 transition-transform', { 'rotate-90': isSpecificationExpanded }]" />
						</button>
						<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="handleRootSpecificationSelect">
							<lucide-file-text class="h-4 w-4" />
							<span class="flex-1">规格书</span>
						</div>
					</div>
					
					<div v-if="isSpecificationExpanded" class="ml-6 space-y-1">
						<div v-for="(child, index) in specificationData.children" :key="index" class="space-y-1">
							<design-specification-node 
								:spec="child" 
								@select="handleSpecificationNodeSelect" 
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-auto">
			<template v-if="showTemplateDetail && selectedTemplate">
				<div class="space-y-6">
					<design-template-detail :template="selectedTemplate" :is-editing="isEditing" @edit="isEditing = true"
						@cancel="isEditing = false" @submit="handleTemplateSubmit" :parameters="parameterDetails" />
				</div>
			</template>
			<template v-else-if="selectedPSystem">
				<div class="space-y-6">
					<design-psystem-detail :system="selectedPSystem" :is-editing="isEditing" @edit="isEditing = true"
						@cancel="isEditing = false" @submit="handleSubmit" :parameters="parameterDetails" />
				</div>
			</template>
			<template v-else-if="selectedComponent">
				<div class="space-y-6">
					<design-component-detail :component="selectedComponent" :is-editing="isEditing" @edit="isEditing = true"
						@cancel="isEditing = false" @submit="handleComponentSubmit" :parameters="parameterDetails" />
				</div>
			</template>
			<template v-else-if="selectedSpecification">
				<div class="space-y-6">
					<design-specification-detail :specification="selectedSpecification" :is-editing="isEditing" @edit="isEditing = true"
						@cancel="isEditing = false" @submit="handleSpecificationSubmit" :parameters="parameterDetails" />
				</div>
			</template>
			<div v-else class="flex items-center justify-center h-full text-muted-foreground">
				请从左侧选择一个项目模板、系统、组件或规格书
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { LucideBookTemplate, LucideChevronRight, LucideFileText } from 'lucide-vue-next'
import type { ZdSpecification } from '~/models/entity/specification'

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
const template = ref<ZdTemplate | null>(null)
const parameterDetails = ref<ZdParameter[]>([])
const isEditing = ref(false)
const isTemplateExpanded = ref(true)
const entityApis = useEntityApis()
const showTemplateDetail = ref(false)

// 规格书相关状态
const specificationData = ref<ZdSpecification | null>(null)
const selectedSpecification = ref<ZdSpecification | null>(null)
const isSpecificationExpanded = ref(true)

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

// 获取数据
const fetchData = async () => {
	try {
		const [systemResponse, componentResponse, templateResponse] = await Promise.all([
			entityApis.template_psystem.getByTemplateId(templateId),
			entityApis.template_component.getByTemplateId(templateId),
			entityApis.template.get(templateId)
		])
		data.value = systemResponse.list
		components.value = componentResponse.list
		selectedTemplate.value = templateResponse
		template.value = templateResponse
		
		// 如果模板有规格书ID，获取规格书数据
		if (templateResponse.specId) {
			await fetchSpecificationData(templateResponse.specId)
		}
	} catch (error) {
		console.error('获取数据失败:', error)
	}
}

// 获取规格书数据
const fetchSpecificationData = async (specId: number) => {
	try {
		const response = await entityApis.specification.getAll(specId)
		specificationData.value = response
	} catch (error) {
		console.error('获取规格书数据失败:', error)
	}
}

// 处理模板选择
const handleTemplateSelect = async () => {
	selectedPSystem.value = null
	selectedComponent.value = null
	selectedSpecification.value = null
	showTemplateDetail.value = true
	isEditing.value = false

	// 获取参数列表
	try {
		const response = await entityApis.parameter.get(templateId, 'template')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取参数列表失败:', error)
		parameterDetails.value = []
	}
}

// 处理系统选择
const handleSelect = async (system: ZdPSystem) => {
	selectedPSystem.value = system
	selectedComponent.value = null
	selectedSpecification.value = null
	showTemplateDetail.value = false
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
		selectedSpecification.value = null
		showTemplateDetail.value = false
		isEditing.value = false

		// 获取参数列表
		try {
			const response = await entityApis.parameter.get(componentId, 'component')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取参数列表失败:', error)
			parameterDetails.value = []
		}
	} catch (error) {
		console.error('获取组件详情失败:', error)
	}
}

// 处理根规格书选择
const handleRootSpecificationSelect = async () => {
	if (specificationData.value) {
		selectedSpecification.value = specificationData.value
		selectedPSystem.value = null
		selectedComponent.value = null
		showTemplateDetail.value = false
		isEditing.value = false
		
		// 获取规格书参数列表
		try {
			const response = await entityApis.parameter.get(specificationData.value.id, 'specification')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取规格书参数列表失败:', error)
			parameterDetails.value = []
		}
	}
}

// 处理规格书节点选择
const handleSpecificationNodeSelect = async (spec: ZdSpecification) => {
	selectedSpecification.value = spec
	selectedPSystem.value = null
	selectedComponent.value = null
	showTemplateDetail.value = false
	isEditing.value = false
	
	// 获取规格书参数列表
	try {
		const response = await entityApis.parameter.get(spec.id, 'specification')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取规格书参数列表失败:', error)
		parameterDetails.value = []
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
		
		// 如果规格书ID更新了，需要重新获取规格书数据
		if (form.specId !== selectedTemplate.value.specId) {
			if (form.specId) {
				await fetchSpecificationData(form.specId)
			} else {
				specificationData.value = null
			}
		}
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

// 处理规格书表单提交
const handleSpecificationSubmit = async (form: Partial<ZdSpecification>) => {
	if (!selectedSpecification.value) return
	
	try {
		// 创建规格书元数据对象
		const specMeta: ZdSpecificationMeta = {
			name: form.name || selectedSpecification.value.name,
			fileTag: form.fileTag || selectedSpecification.value.fileTag,
			lastVersionId: selectedSpecification.value.latestVersionId
		}
		
		// 使用update方法更新规格书
		await entityApis.specification.update(
			specMeta.fileTag,
			null as any, // 这里应该传文件，但当前只是更新元数据
			specMeta
		)
		
		// 刷新规格书数据
		if (selectedTemplate.value?.specId) {
			await fetchSpecificationData(selectedTemplate.value.specId)
		}
		
		isEditing.value = false
	} catch (error) {
		console.error('更新规格书失败:', error)
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

// 页面加载时，默认选择模板
onMounted(async () => {
	await fetchData()
})
</script>