<template>
	<div class="space-y-1">
		<div class="flex items-center gap-1">
			<button v-if="hasChildren" class="p-1 hover:bg-accent rounded-sm" @click="toggleExpand">
				<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isExpanded }]" />
			</button>
			<div v-else class="w-6"></div>
			<div
				class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
				:class="{ 'bg-accent': isSelected }"
				@click="$emit('select', project)"
			>
				<LucideFolder class="h-4 w-4" />
				<span class="flex-1 truncate">{{ project.name }}</span>
			</div>
		</div>
		
		<div v-if="isExpanded" class="ml-6 space-y-1">
			<!-- 模板节点 -->
			<div v-if="template" class="space-y-1">
				<div class="flex items-center gap-1">
					<button v-if="hasTemplateChildren" class="p-1 hover:bg-accent rounded-sm" @click="toggleTemplateExpand">
						<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isTemplateExpanded }]" />
					</button>
					<div v-else class="w-6"></div>
					<div
						class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
						@click="$emit('template-select', template)"
					>
						<LucideBookTemplate class="h-4 w-4" />
						<span class="flex-1 truncate">{{ template.name }}</span>
					</div>
				</div>
				
				<!-- 模板子树 -->
				<div v-if="isTemplateExpanded && templateSystems.length > 0" class="ml-6 space-y-1">
					<design-template-tree 
						:items="templateSystems" 
						@select="$emit('system-select', $event)"
						@component-select="$emit('component-select', $event)"
						@bom-select="$emit('bom-select', $event)"
					/>
				</div>
				
				<!-- 规格书节点 -->
				<div v-if="isTemplateExpanded && specification" class="ml-6 space-y-1 mt-2">
					<div class="flex items-center gap-1">
						<button v-if="specificationHasChildren" class="p-1 hover:bg-accent rounded-sm" @click="toggleSpecificationExpand">
							<LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isSpecificationExpanded }]" />
						</button>
						<div v-else class="w-6"></div>
						<div 
							class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
							@click="$emit('specification-select', specification)"
						>
							<LucideFileText class="h-4 w-4" />
							<span class="flex-1 truncate">规格书</span>
						</div>
					</div>
					
					<div v-if="isSpecificationExpanded && specification.children" class="ml-6 space-y-1">
						<div v-for="(child, index) in specification.children" :key="index" class="space-y-1">
							<design-specification-node 
								:spec="child" 
								@select="$emit('specification-node-select', $event)"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
	LucideChevronRight, 
	LucideFolder, 
	LucideBookTemplate, 
	LucideFileText 
} from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdSpecification } from '~/models/entity/specification'

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

// 计算是否选中
const isSelected = computed(() => props.selectedProjectId === props.project.id)

// 计算是否有子节点
const hasChildren = computed(() => props.project.templateId != null)
const hasTemplateChildren = computed(() => templateSystems.value.length > 0 || !!specification.value)
const specificationHasChildren = computed(() => specification.value?.children && specification.value.children.length > 0)

// 实体API
const entityApis = useEntityApis()

// 切换展开状态
const toggleExpand = () => {
	isExpanded.value = !isExpanded.value
	if (isExpanded.value && !template.value && props.project.templateId) {
		fetchTemplateData()
	}
}

const toggleTemplateExpand = () => {
	isTemplateExpanded.value = !isTemplateExpanded.value
	if (isTemplateExpanded.value && templateSystems.value.length === 0 && template.value) {
		fetchTemplateSystems()
	}
}

const toggleSpecificationExpand = () => {
	isSpecificationExpanded.value = !isSpecificationExpanded.value
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

// 如果有selectedProjectId匹配当前项目，则自动展开
watch(() => props.selectedProjectId, (newId) => {
	if (newId === props.project.id && !isExpanded.value) {
		toggleExpand()
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