<template>
  <div class="project-content">
    <shadcn-tabs default-value="system">
      <shadcn-tabs-list class="mb-4">
        <shadcn-tabs-trigger value="system">系统组成</shadcn-tabs-trigger>
        <shadcn-tabs-trigger value="files">附件文件</shadcn-tabs-trigger>
        <shadcn-tabs-trigger value="specification">规格清单</shadcn-tabs-trigger>
      </shadcn-tabs-list>
      
      <shadcn-tabs-content value="system">
        <div v-if="loading" class="py-4 text-center text-gray-500">
          <LucideLoader class="h-4 w-4 animate-spin mx-auto mb-2" />
          加载中...
        </div>
        
        <div v-else-if="!system || system.length === 0" class="py-4 text-center text-gray-500">
          <p>暂无系统组成数据</p>
          <shadcn-button 
            variant="outline" 
            size="sm" 
            class="mt-2"
            @click="navigateToDesign"
          >
            前往设计
          </shadcn-button>
        </div>
        
        <div v-else>
          <design-template-tree-wrapper
            :items="system"
            @select="handleSystemSelect"
          />
        </div>
      </shadcn-tabs-content>
      
      <shadcn-tabs-content value="files">
        <div v-if="loading" class="py-4 text-center text-gray-500">
          <LucideLoader class="h-4 w-4 animate-spin mx-auto mb-2" />
          加载中...
        </div>
        
        <div v-else-if="!files || files.length === 0" class="py-4 text-center text-gray-500">
          <p>暂无附件文件</p>
          <shadcn-button 
            variant="outline" 
            size="sm" 
            class="mt-2"
            @click="uploadFile"
          >
            上传文件
          </shadcn-button>
        </div>
        
        <div v-else class="border rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上传时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="file in files" :key="file.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <LucideFile class="h-4 w-4 text-gray-400 mr-2" />
                    <span>{{ file.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatFileSize(file.size) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(file.uploadTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <shadcn-button variant="link" size="sm" @click="downloadFile(file)">
                    下载
                  </shadcn-button>
                  <shadcn-button variant="link" size="sm" class="text-red-500" @click="deleteFile(file)">
                    删除
                  </shadcn-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </shadcn-tabs-content>
      
      <shadcn-tabs-content value="specification">
        <div v-if="loading" class="py-4 text-center text-gray-500">
          <LucideLoader class="h-4 w-4 animate-spin mx-auto mb-2" />
          加载中...
        </div>
        
        <div v-else-if="!specification || specification.length === 0" class="py-4 text-center text-gray-500">
          <p>暂无规格清单</p>
          <shadcn-button 
            variant="outline" 
            size="sm" 
            class="mt-2"
            @click="generateSpecification"
          >
            生成规格清单
          </shadcn-button>
        </div>
        
        <div v-else>
          <!-- 规格清单内容展示 -->
          <div class="border rounded-md p-4">
            <h4 class="font-medium mb-2">项目规格清单</h4>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div class="flex flex-col">
                <dt class="text-sm text-gray-500">产品型号</dt>
                <dd>{{ specification.model || '未设置' }}</dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-sm text-gray-500">数量</dt>
                <dd>{{ specification.quantity || '未设置' }}台</dd>
              </div>
            </dl>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in specification.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ item.model }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ item.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="mt-4 flex justify-end">
              <shadcn-button 
                variant="outline" 
                size="sm" 
                class="mr-2"
                @click="exportSpecification"
              >
                导出清单
              </shadcn-button>
              <shadcn-button 
                variant="outline" 
                size="sm"
                @click="editSpecification"
              >
                编辑清单
              </shadcn-button>
            </div>
          </div>
        </div>
      </shadcn-tabs-content>
    </shadcn-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { LucideLoader, LucideFile } from 'lucide-vue-next'

const props = defineProps<{
  projectId?: number
}>()

// 消息服务模拟
const message = {
  error: (msg: string) => console.error(msg),
  success: (msg: string) => console.log(msg)
}

// 状态变量
const loading = ref(false)
const system = ref<any[]>([])
const files = ref<any[]>([])
const specification = ref<any>(null)
const activeTab = ref('system')

// 加载项目数据
const loadProjectData = async () => {
  if (!props.projectId) return
  
  loading.value = true
  try {
    // 加载项目系统组成数据
    await loadSystemData()
    
    // 加载项目附件文件
    await loadFilesData()
    
    // 加载项目规格清单
    await loadSpecificationData()
  } catch (error) {
    console.error('加载项目数据失败:', error)
    message.error('加载项目数据失败')
  } finally {
    loading.value = false
  }
}

// 加载系统组成数据
const loadSystemData = async () => {
  if (!props.projectId) return
  
  try {
    // 从API获取系统组成数据
    // const res = await projectApis.getProjectSystem(props.projectId)
    // system.value = res.data || []
    system.value = [] // 模拟空数据
  } catch (error) {
    console.error('加载系统组成数据失败:', error)
    system.value = []
  }
}

// 加载附件文件
const loadFilesData = async () => {
  if (!props.projectId) return
  
  try {
    // 从API获取附件文件数据
    // const res = await projectApis.getProjectFiles(props.projectId)
    // files.value = res.data || []
    files.value = [] // 模拟空数据
  } catch (error) {
    console.error('加载附件文件失败:', error)
    files.value = []
  }
}

// 加载规格清单
const loadSpecificationData = async () => {
  if (!props.projectId) return
  
  try {
    // 从API获取规格清单数据
    // const res = await projectApis.getProjectSpecification(props.projectId)
    // specification.value = res.data
    specification.value = null // 模拟空数据
  } catch (error) {
    console.error('加载规格清单失败:', error)
    specification.value = null
  }
}

// 处理系统组件选择
const handleSystemSelect = (systemItem: any) => {
  console.log('选择系统组件', systemItem)
}

// 导航到设计页面
const navigateToDesign = () => {
  if (!props.projectId) return
  console.log('导航到设计页面', props.projectId)
  // 实现导航逻辑
}

// 上传文件
const uploadFile = () => {
  if (!props.projectId) return
  console.log('上传文件', props.projectId)
  // 实现上传文件逻辑
}

// 下载文件
const downloadFile = (file: any) => {
  console.log('下载文件', file)
  // 实现下载文件逻辑
}

// 删除文件
const deleteFile = (file: any) => {
  console.log('删除文件', file)
  // 实现删除文件逻辑
}

// 生成规格清单
const generateSpecification = () => {
  if (!props.projectId) return
  console.log('生成规格清单', props.projectId)
  // 实现生成规格清单逻辑
}

// 编辑规格清单
const editSpecification = () => {
  if (!props.projectId || !specification.value) return
  console.log('编辑规格清单', props.projectId)
  // 实现编辑规格清单逻辑
}

// 导出规格清单
const exportSpecification = () => {
  if (!props.projectId || !specification.value) return
  console.log('导出规格清单', props.projectId)
  // 实现导出规格清单逻辑
}

// 格式化文件大小
const formatFileSize = (size?: number) => {
  if (!size) return '未知'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let fileSize = size
  let unitIndex = 0
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString()
}

// 监听项目ID变化，重新加载数据
watch(() => props.projectId, (newId) => {
  if (newId) {
    loadProjectData()
  } else {
    system.value = []
    files.value = []
    specification.value = null
  }
})

// 组件挂载时加载数据
onMounted(() => {
  if (props.projectId) {
    loadProjectData()
  }
})
</script> 