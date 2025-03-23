<template>
	<div class="flex gap-4 p-4 h-full">
		<div class="w-1/4 border-r overflow-auto">
			<div class="space-y-1">
				<div class="flex items-center gap-1">
					<shadcn-button class="p-1 hover:bg-accent rounded-sm" @click="toggleProjectExpand">
						<lucide-chevron-right :class="['h-4 w-4 transition-transform', { 'rotate-90': isProjectExpanded }]" />
					</shadcn-button>
					<div class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer" @click="handleProjectSelect">
						<lucide-folder-open class="h-4 w-4" />
						<span class="flex-1">{{ selectedProject?.name || '项目' }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-auto">
			<template v-if="showProjectDetail && selectedProject">
				<div class="space-y-6">
					<design-project-detail :project="selectedProject" :is-editing="isEditing" @edit="isEditing = true"
						@cancel="isEditing = false" @submit="handleProjectSubmit" :parameters="parameterDetails" />

					<shadcn-separator />

					<design-parameter-preview :parameters="parameterDetails" />
				</div>
			</template>
			<div v-else class="flex items-center justify-center h-full text-muted-foreground">
				请从左侧选择一个项目
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ZdProject } from '~/models/entity/project'
import { useEntityApis } from '~/composables/use-entity-apis'

// 添加 keepalive 配置
definePageMeta({
	name: 'project-detail'
})

const { id } = useRoute().params
const projectId = Number(id)
const selectedProject = ref<ZdProject | null>(null)
const isEditing = ref(false)
const isProjectExpanded = ref(true)
const showProjectDetail = ref(false)
const parameterDetails = ref<ZdParameter[]>([])
const entityApis = useEntityApis()

// 切换项目展开状态
const toggleProjectExpand = () => {
	isProjectExpanded.value = !isProjectExpanded.value
}

// 处理项目选择
const handleProjectSelect = async () => {
	try {
		const project = await entityApis.project.get(projectId)
		selectedProject.value = project
		showProjectDetail.value = true
		isEditing.value = false

		// 获取参数列表
		try {
			const response = await entityApis.parameter.get(projectId, 'project')
			parameterDetails.value = response || []
		} catch (error) {
			console.error('获取参数列表失败:', error)
			parameterDetails.value = []
		}
	} catch (error) {
		console.error('获取项目详情失败:', error)
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

// 页面加载时，默认选择项目
onMounted(async () => {
	await handleProjectSelect()
})
</script> 