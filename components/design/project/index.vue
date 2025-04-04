<template>
  <div class="project-panel">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">项目管理</h2>
      <shadcn-button @click="createProject">
        <LucidePlus class="h-4 w-4 mr-2" />
        新建项目
      </shadcn-button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 项目树列表 -->
      <div class="col-span-1 border rounded-md p-4">
        <div v-if="loading" class="py-4 text-center text-gray-500">
          <LucideLoader class="h-4 w-4 animate-spin mx-auto mb-2" />
          加载中...
        </div>
        <div v-else-if="projects.length === 0" class="py-4 text-center text-gray-500">
          暂无项目
        </div>
        <div v-else class="space-y-2">
          <div v-for="project in projects" :key="project.id" class="rounded border border-gray-200">
            <div class="flex justify-between items-center p-2">
              <design-project-tree-base
                :project="project"
                :selected-project-id="selectedProjectId"
                @select="handleProjectSelect"
                @template-select="handleTemplateSelect"
              />
              <design-project-actions 
                :project="project"
                @edit="(project: ZdProject) => editProject(project)"
                @delete="(project: ZdProject) => handleProjectDelete(project)"
                @open-detail="(project: ZdProject) => openProjectDetail(project)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 项目详情 -->
      <div v-if="selectedProject" class="col-span-1 md:col-span-2 border rounded-md p-4">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-medium">{{ selectedProject.name }}</h3>
            <p class="text-gray-500 text-sm mt-1">{{ selectedProject.description || '暂无描述' }}</p>
          </div>
          <design-project-actions
            :project="selectedProject"
            @edit="(project: ZdProject) => editProject(project)"
            @delete="(project: ZdProject) => handleProjectDelete(project)"
            @open-detail="(project: ZdProject) => openProjectDetail(project)"
          />
        </div>
        
        <div class="mt-6">
          <h4 class="font-medium mb-2">项目信息</h4>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div class="flex flex-col">
              <dt class="text-sm text-gray-500">创建时间</dt>
              <dd>{{ formatDate(selectedProject.createdTime) }}</dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm text-gray-500">最后更新</dt>
              <dd>{{ formatDate(selectedProject.updatedTime) }}</dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm text-gray-500">产品类型</dt>
              <dd>{{ getProductTypeName(selectedProject.productTypeId) }}</dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm text-gray-500">使用模板</dt>
              <dd>{{ getTemplateName(selectedProject.templateId) }}</dd>
            </div>
          </dl>
        </div>
        
        <!-- 项目内容区域 -->
        <div class="mt-6">
          <h4 class="font-medium mb-2">项目内容</h4>
          <design-project-content :project-id="selectedProject.id" />
        </div>
      </div>
      
      <div v-else class="col-span-1 md:col-span-2 border rounded-md p-8 text-center text-gray-500">
        请从左侧选择一个项目
      </div>
    </div>
    
    <!-- 项目对话框 -->
    <design-project-dialog
      v-model:open="showDialog"
      :project="editingProject"
      @save="saveProject"
    />
  </div>
</template>

<script setup lang="ts">
import { LucidePlus, LucideLoader } from 'lucide-vue-next'
import type { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'

// 状态变量
const selectedProjectId = ref<number | undefined>(undefined)
const selectedProject = ref<ZdProject | null>(null)
const showDialog = ref(false)
const editingProject = ref<ZdProject | null>(null)
const templates = ref<ZdTemplate[]>([])
const productTypes = ref<any[]>([])
const projects = ref<ZdProject[]>([])
const loading = ref(false)

// 模拟API服务
const projectApi = {
  list: async () => {
    return { list: [] as ZdProject[] }
  }
}

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await projectApi.list()
    projects.value = res.list || []
  } catch (error) {
    console.error('获取项目列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取项目列表
onMounted(() => {
  fetchProjects()
})

// 处理项目选择
const handleProjectSelect = (project: ZdProject) => {
  selectedProjectId.value = project.id
  selectedProject.value = project
}

// 处理模板选择
const handleTemplateSelect = (template: ZdTemplate) => {
  console.log('选择模板', template)
}

// 创建新项目
const createProject = () => {
  editingProject.value = null
  showDialog.value = true
}

// 编辑项目
const editProject = (project: ZdProject) => {
  editingProject.value = project
  showDialog.value = true
}

// 保存项目
const saveProject = (project: ZdProject) => {
  showDialog.value = false
  
  // 如果是当前选中的项目，更新选中的项目
  if (selectedProjectId.value === project.id) {
    selectedProject.value = project
  }
}

// 处理项目删除
const handleProjectDelete = (project: ZdProject) => {
  // 如果删除的是当前选中的项目，清空选中状态
  if (selectedProjectId.value === project.id) {
    selectedProjectId.value = undefined
    selectedProject.value = null
  }
}

// 查看项目详情
const openProjectDetail = (project: ZdProject) => {
  // 实现查看项目详情的逻辑
  console.log('查看项目详情', project)
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString()
}

// 获取产品类型名称
const getProductTypeName = (id?: number) => {
  if (!id) return '未知'
  const type = productTypes.value.find(t => t.id === id)
  return type ? type.name : '未知'
}

// 获取模板名称
const getTemplateName = (id?: number) => {
  if (!id) return '未知'
  const template = templates.value.find(t => t.id === id)
  return template ? template.name : '未知'
}
</script> 