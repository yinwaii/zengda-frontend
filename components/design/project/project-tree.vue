<template>
  <div class="project-tree-container">
    <div class="flex justify-between items-center mb-2">
      <div class="font-medium">项目</div>
      <shadcn-button 
        variant="ghost" 
        size="icon" 
        class="h-8 w-8" 
        @click="refresh"
      >
        <LucideRefreshCw class="h-4 w-4" />
      </shadcn-button>
    </div>
    
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
            @select="selectProject"
            @template-select="handleTemplateSelect"
          />
          <design-project-actions 
            :project="project"
            @edit="() => editProject(project)"
            @delete="() => deleteProject(project)"
            @open-detail="() => openProjectDetail(project)"
          />
        </div>
      </div>
    </div>
    
    <!-- 项目对话框 -->
    <design-project-dialog
      v-model:open="showDialog"
      :project="currentProject"
      @save="saveProject"
    />
  </div>
</template>

<script setup lang="ts">
import { LucideRefreshCw, LucideLoader } from 'lucide-vue-next'

// 模拟message服务
const message = {
  error: (msg: string) => console.error(msg),
  success: (msg: string) => console.log(msg)
}

// 模拟API服务
const projectApi = {
  list: async () => {
    return { list: [] as ZdProject[] }
  },
  create: async (project: ZdProject) => {
    return { success: true }
  },
  update: async (project: ZdProject) => {
    return { success: true }
  },
  delete: async (id: number) => {
    return { success: true }
  }
}

const props = defineProps<{
  selectedProjectId?: number
}>()

const emit = defineEmits<{
  'select': [project: ZdProject]
  'template-select': [template: ZdTemplate]
}>()

// 状态变量
const projects = ref<ZdProject[]>([])
const loading = ref(false)
const showDialog = ref(false)
const currentProject = ref<ZdProject | null>(null)

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await projectApi.list()
    projects.value = res.list || []
  } catch (error) {
    console.error('获取项目列表失败:', error)
    message.error('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

// 刷新项目列表
const refresh = () => {
  fetchProjects()
}

// 选择项目
const selectProject = (project: ZdProject) => {
  emit('select', project)
}

// 处理模板选择
const handleTemplateSelect = (template: ZdTemplate) => {
  emit('template-select', template)
}

// 编辑项目
const editProject = (project: ZdProject) => {
  currentProject.value = project
  showDialog.value = true
}

// 新建项目
const createProject = () => {
  currentProject.value = null
  showDialog.value = true
}

// 保存项目
const saveProject = async (project: ZdProject) => {
  try {
    if (project.id) {
      await projectApi.update(project)
      message.success('项目更新成功')
    } else {
      await projectApi.create(project)
      message.success('项目创建成功')
    }
    refresh()
  } catch (error) {
    console.error('保存项目失败:', error)
    message.error('保存项目失败')
  }
}

// 删除项目
const deleteProject = async (project: ZdProject) => {
  if (!confirm(`确定要删除项目 "${project.name}" 吗？`)) return
  
  try {
    await projectApi.delete(project.id)
    message.success('项目删除成功')
    refresh()
  } catch (error) {
    console.error('删除项目失败:', error)
    message.error('删除项目失败')
  }
}

// 查看项目详情
const openProjectDetail = (project: ZdProject) => {
  // 实现查看项目详情的逻辑
  console.log('查看项目详情', project)
}

// 组件挂载时获取项目列表
onMounted(() => {
  fetchProjects()
})

// 确保选中项目在列表中可见
watch(() => props.selectedProjectId, (newId) => {
  if (newId && projects.value.length && !projects.value.some(p => p.id === newId)) {
    fetchProjects()
  }
})
</script> 