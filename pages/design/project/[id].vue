<template>
	<div class="project-wrapper">
		<div class="flex gap-4 p-4 h-full">
			<div class="w-1/4 border-r overflow-auto">
				<div class="space-y-1">
					<div v-if="pageLoading" class="flex items-center justify-center py-10">
						<div class="animate-pulse flex space-x-4">
							<div class="rounded-full bg-accent-foreground/10 h-10 w-10"></div>
							<div class="flex-1 space-y-3 py-1">
								<div class="h-2 bg-accent-foreground/10 rounded"></div>
								<div class="space-y-1">
									<div class="h-2 bg-accent-foreground/10 rounded"></div>
								</div>
							</div>
						</div>
					</div>
					<design-project-tree
						v-else-if="selectedProject"
						:project="selectedProject"
						:selectedProjectId="projectId"
						@select="handleProjectSelect"
						@template-select="handleTemplateSelect"
						@system-select="handleSystemSelect"
						@component-select="handleComponentSelect"
						@bom-select="handleBOMSelect"
						@specification-select="handleSpecificationSelect"
						@specification-node-select="handleSpecificationNodeSelect"
					/>
					<div v-else class="p-4 text-center text-muted-foreground">
						加载项目失败，请刷新页面重试
					</div>
				</div>
			</div>
			<div class="flex-1 overflow-auto">
				<template v-if="showProjectDetail && selectedProject">
					<div class="space-y-6">
						<div class="flex justify-between items-center mb-4">
							<h2 class="text-xl font-bold">项目详情</h2>
							<div class="flex gap-2">
								<!-- 添加配置生成按钮 -->
								<shadcn-button variant="outline" @click="openConfigDialog">
									<lucide-settings class="mr-2 h-4 w-4" />
									生成配置
								</shadcn-button>
							</div>
						</div>
						
						<design-project-detail :project="selectedProject" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleProjectSubmit" :parameters="parameterDetails" />
						
						<!-- 项目配置详情 -->
						<div v-if="projectConfiguration">
							<project-configuration-detail 
								:configuration="projectConfiguration" 
								:is-editing="false" 
								@edit="openConfigDialog" 
								@load="handleLoadConfiguration"
							/>
						</div>
					</div>
				</template>
				<template v-else-if="selectedTemplate">
					<div class="space-y-6">
						<design-template-detail :template="selectedTemplate" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleTemplateSubmit" :parameters="parameterDetails" />
					</div>
				</template>
				<template v-else-if="selectedSystem">
					<div class="space-y-6">
						<design-psystem-detail :system="selectedSystem" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleSystemSubmit" :parameters="parameterDetails" />
					</div>
				</template>
				<template v-else-if="selectedComponent">
					<div class="space-y-6">
						<design-component-detail :component="selectedComponent" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleComponentSubmit" :parameters="parameterDetails" />
					</div>
				</template>
				<template v-else-if="selectedBom">
					<div class="space-y-6">
						<design-bom-detail :bom="selectedBom" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleBomSubmit" :parameters="parameterDetails" />
					</div>
				</template>
				<template v-else-if="selectedSpecification">
					<div class="space-y-6">
						<design-specification-detail :specification="selectedSpecification" :is-editing="isEditing" @edit="isEditing = true"
							@cancel="isEditing = false" @submit="handleSpecificationSubmit" :parameters="parameterDetails" />
					</div>
				</template>
				<div v-else class="flex items-center justify-center h-full text-muted-foreground">
					请从左侧选择项目或其子节点
				</div>
			</div>
		</div>
		
		<!-- 配置生成对话框 -->
		<project-configuration-dialog 
			:is-open="isConfigDialogOpen" 
			:project-id="projectId"
			@update:is-open="isConfigDialogOpen = $event"
			@submit="handleConfigSubmit"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdBom } from '~/models/entity/bom'
import type { ZdSpecification, ZdSpecificationMeta } from '~/models/entity/specification'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { ZdParameter } from '~/models/entity/parameter'
import { useEntityApis } from '~/composables/use-entity-apis'
import { Settings } from 'lucide-vue-next'

// 添加 keepalive 配置
definePageMeta({
	name: 'project-detail',
	// 禁用缓存，减少内存占用
	keepalive: false,
	// 禁用页面过渡动画
	pageTransition: false
})

const { id } = useRoute().params
const projectId = Number(id)
const selectedProject = ref<ZdProject | null>(null)
const selectedTemplate = ref<ZdTemplate | null>(null)
const selectedSystem = ref<ZdPSystem | null>(null)
const selectedComponent = ref<ZdComponent | null>(null)
const selectedBom = ref<ZdBom | null>(null)
const selectedSpecification = ref<ZdSpecification | null>(null)
const isEditing = ref(false)
const showProjectDetail = ref(false)
const parameterDetails = ref<ZdParameter[]>([])
const entityApis = useEntityApis()

// 添加页面初始加载状态
const pageLoading = ref(true)

// 配置对话框状态
const isConfigDialogOpen = ref(false)
const projectConfiguration = ref<ZdConfiguration | null>(null)

// 打开配置对话框
const openConfigDialog = () => {
	isConfigDialogOpen.value = true
}

// 处理配置提交
const handleConfigSubmit = (configuration: ZdConfiguration) => {
	// 更新配置状态
	projectConfiguration.value = configuration
	console.log('配置已保存:', configuration)
}

// 加载项目配置
const loadProjectConfiguration = async () => {
	if (!selectedProject.value || !selectedProject.value.templateId) return
	
	try {
		const config = await entityApis.configuration.getByTemplateId(
			selectedProject.value.templateId,
			projectId
		)
		if (config && config.id > 0) {
			projectConfiguration.value = config
		} else {
			projectConfiguration.value = null
		}
	} catch (error) {
		console.error('加载项目配置失败:', error)
		projectConfiguration.value = null
	}
}

// 处理加载配置
const handleLoadConfiguration = async () => {
	try {
		// 确保有配置可以加载
		if (!projectConfiguration.value) {
			return
		}
		
		// 解析参数配置
		const valueConfig = JSON.parse(projectConfiguration.value.valueConfig)
		const componentConfig = JSON.parse(projectConfiguration.value.componentConfig)
		
		// 应用项目参数配置
		if (valueConfig.project) {
			// 获取项目参数
			const projectParams = await entityApis.parameter.get(projectId, 'project')
			if (projectParams && projectParams.length) {
				// 更新参数值
				const updatedParams = projectParams.map(param => {
					if (valueConfig.project[param.name] !== undefined) {
						return {
							...param,
							value: valueConfig.project[param.name]
						}
					}
					return param
				})
				
				// 保存更新后的参数
				await entityApis.parameter.updateBatch(updatedParams)
			}
		}
		
		// 应用模板参数配置
		if (valueConfig.template && selectedProject.value?.templateId) {
			// 获取模板参数
			const templateParams = await entityApis.parameter.get(selectedProject.value.templateId, 'template')
			if (templateParams && templateParams.length) {
				// 更新参数值
				const updatedParams = templateParams.map(param => {
					if (valueConfig.template[param.name] !== undefined) {
						return {
							...param,
							value: valueConfig.template[param.name]
						}
					}
					return param
				})
				
				// 保存更新后的参数
				await entityApis.parameter.updateBatch(updatedParams)
			}
		}
		
		// 应用系统参数配置
		if (valueConfig.systems) {
			for (const [systemId, systemValues] of Object.entries(valueConfig.systems)) {
				// 获取系统参数
				const systemParams = await entityApis.parameter.get(Number(systemId), 'psystem')
				if (systemParams && systemParams.length) {
					// 更新参数值
					const updatedParams = systemParams.map(param => {
						// @ts-ignore - 类型问题
						if (systemValues[param.name] !== undefined) {
							return {
								...param,
								// @ts-ignore - 类型问题
								value: systemValues[param.name]
							}
						}
						return param
					})
					
					// 保存更新后的参数
					await entityApis.parameter.updateBatch(updatedParams)
				}
			}
		}
		
		// 显示成功消息
		alert('配置已成功加载')
		
		// 刷新当前视图的参数
		if (showProjectDetail.value) {
			const refreshedParams = await entityApis.parameter.get(projectId, 'project')
			parameterDetails.value = refreshedParams || []
		}
	} catch (error) {
		console.error('加载配置失败:', error)
		alert('加载配置失败，请查看控制台详情')
	}
}

// 重置所有选中状态，但保留项目对象，避免树形结构消失
const resetSelectedStates = () => {
	// 不重置selectedProject，保留树形结构
	// selectedProject.value = null
	selectedTemplate.value = null
	selectedSystem.value = null
	selectedComponent.value = null
	selectedBom.value = null
	selectedSpecification.value = null
	showProjectDetail.value = false
	isEditing.value = false
}

// 处理项目选择
const handleProjectSelect = async (project: ZdProject) => {
	try {
		// 首先重置其他状态，但保留树形结构
		resetSelectedStates()
		
		// 如果是传入的项目对象，且ID匹配，直接使用
		if (project && project.id === projectId) {
			// 检查是否是临时的加载对象
			if (project.name === '加载中...') {
				// 如果是加载中状态，从API获取完整数据
				const projectData = await entityApis.project.get(projectId)
				selectedProject.value = projectData
			} else {
				// 使用传入的现有项目对象
				selectedProject.value = project
			}
		} else {
			// 从API获取项目数据
			const projectData = await entityApis.project.get(projectId)
			selectedProject.value = projectData
		}
		
		// 显示项目详情
		showProjectDetail.value = true

		// 获取参数列表
		try {
			const response = await entityApis.parameter.get(projectId, 'project')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取参数列表失败:', error)
			parameterDetails.value = []
		}
		
		// 加载项目配置
		await loadProjectConfiguration()
	} catch (error) {
		console.error('获取项目详情失败:', error)
	}
}

// 处理模板选择
const handleTemplateSelect = async (template: ZdTemplate) => {
	resetSelectedStates()
	selectedTemplate.value = template
	
	// 获取参数列表
	try {
		const response = await entityApis.parameter.get(template.id, 'template')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取参数列表失败:', error)
		parameterDetails.value = []
	}
}

// 处理系统选择
const handleSystemSelect = async (system: ZdPSystem) => {
	resetSelectedStates() // 保留项目信息，只重置其他状态
	selectedSystem.value = system
	
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
		resetSelectedStates() // 保留项目信息，只重置其他状态
		selectedComponent.value = component
		
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

// 处理BOM选择
const handleBOMSelect = async (bomId: number) => {
	try {
		const bom = await entityApis.bom.get(bomId)
		resetSelectedStates() // 保留项目信息，只重置其他状态
		selectedBom.value = bom
		
		// 获取参数列表
		try {
			const response = await entityApis.parameter.get(bomId, 'bom')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取参数列表失败:', error)
			parameterDetails.value = []
		}
	} catch (error) {
		console.error('获取BOM详情失败:', error)
	}
}

// 处理规格书选择
const handleSpecificationSelect = async (spec: ZdSpecification) => {
	resetSelectedStates() // 保留项目信息，只重置其他状态
	selectedSpecification.value = spec
	
	// 获取参数列表
	try {
		const response = await entityApis.parameter.get(spec.id, 'specification')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取参数列表失败:', error)
		parameterDetails.value = []
	}
}

// 处理规格书节点选择
const handleSpecificationNodeSelect = async (spec: ZdSpecification) => {
	resetSelectedStates() // 保留项目信息，只重置其他状态
	selectedSpecification.value = spec
	
	// 获取参数列表
	try {
		const response = await entityApis.parameter.get(spec.id, 'specification')
		parameterDetails.value = response || []
	} catch (error) {
		console.error('获取规格书参数列表失败:', error)
		parameterDetails.value = []
	}
}

// 处理项目表单提交
const handleProjectSubmit = async (form: Partial<ZdProject>) => {
	if (!selectedProject.value) return
	
	try {
		const updatedProject = await entityApis.project.update({
			...selectedProject.value,
			...form
		})
		selectedProject.value = updatedProject
		isEditing.value = false
	} catch (error) {
		console.error('更新项目失败:', error)
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

// 处理系统表单提交
const handleSystemSubmit = async (form: Partial<ZdPSystem>) => {
	if (!selectedSystem.value) return
	
	try {
		const updatedSystem = await entityApis.psystem.update({
			...selectedSystem.value,
			...form
		})
		selectedSystem.value = updatedSystem
		isEditing.value = false
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
	} catch (error) {
		console.error('更新组件失败:', error)
	}
}

// 处理BOM表单提交
const handleBomSubmit = async (form: Partial<ZdBom>) => {
	if (!selectedBom.value) return
	
	try {
		const updatedBom = await entityApis.bom.update({
			...selectedBom.value,
			...form
		})
		selectedBom.value = updatedBom
		isEditing.value = false
	} catch (error) {
		console.error('更新BOM失败:', error)
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
		
		// 如果form中包含url，且以blob:开头，说明是本地编辑的文档内容
		if (form.url && form.url.startsWith('blob:')) {
			try {
				// 获取blob内容
				const response = await fetch(form.url)
				const htmlContent = await response.text()
				
				// 转换为文件对象
				const file = new File([htmlContent], `${specMeta.name}.html`, { type: 'text/html' })
				
				// 使用update方法上传规格书
				await entityApis.specification.update(
					specMeta.fileTag,
					file,
					specMeta
				)
			} catch (error) {
				console.error('处理规格书内容失败:', error)
			}
		} else {
			// 如果没有新内容，只更新元数据
			await entityApis.specification.update(
				specMeta.fileTag,
				null as any, // 这里应该传文件，但当前只是更新元数据
				specMeta
			)
		}
		
		isEditing.value = false
	} catch (error) {
		console.error('更新规格书失败:', error)
	}
}

// 页面加载时，加载项目数据
onMounted(async () => {
	try {
		// 设置页面加载状态
		pageLoading.value = true
		
		// 直接从API获取完整的项目数据
		const projectData = await entityApis.project.get(projectId)
		console.log('获取到项目数据:', projectData)
		
		// 设置项目并更新状态
		selectedProject.value = projectData
		showProjectDetail.value = true
		
		// 获取项目参数
		try {
			const response = await entityApis.parameter.get(projectId, 'project')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取参数列表失败:', error)
			parameterDetails.value = []
		}
		
		// 加载项目配置
		await loadProjectConfiguration()
	} catch (error) {
		console.error('获取项目数据失败:', error)
	} finally {
		// 无论成功失败，都关闭加载状态
		pageLoading.value = false
	}
})

// 监听配置对话框关闭
watch(() => isConfigDialogOpen.value, (isOpen) => {
	if (!isOpen) {
		// 对话框关闭后刷新配置
		loadProjectConfiguration()
	}
})
</script> 