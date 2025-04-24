<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ specification.name }}</h2>
            <p v-if="specification.fileTag" class="text-sm text-muted-foreground mt-1">标签: {{ specification.fileTag }}</p>
          </div>
          <div class="flex items-center gap-2">
            <shadcn-button size="sm" @click="handleDownload" v-if="specification.url">
              <LucideDownload class="h-4 w-4" />
            </shadcn-button>
            <shadcn-button size="sm" @click="handleUpload" v-if="specification.id">
              <LucideUpload class="h-4 w-4" />
            </shadcn-button>
            <shadcn-button size="sm" @click="handleCopyTag" v-if="specification.fileTag">
              <LucideCopy class="h-4 w-4" />
            </shadcn-button>
            <shadcn-button size="sm" @click="$emit('edit')">
              <LucideSettings class="h-4 w-4" />
            </shadcn-button>
          </div>
        </div>
      </shadcn-card-header>
      <shadcn-card-content>
        <template v-if="isEditing">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <shadcn-label for="name">名称</shadcn-label>
              <shadcn-input id="name" v-model="editForm.name" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="fileTag">文件标签</shadcn-label>
              <shadcn-input id="fileTag" v-model="editForm.fileTag" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="url">URL</shadcn-label>
              <shadcn-input id="url" v-model="editForm.url" />
            </div>
            <div class="flex justify-end gap-2">
              <shadcn-button type="button" variant="outline" @click="$emit('cancel')">
                取消
              </shadcn-button>
              <shadcn-button type="submit">
                保存
              </shadcn-button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">ID</dt>
              <dd class="mt-1">{{ specification.id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">URL</dt>
              <dd class="mt-1">{{ specification.url || '暂无URL' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">最新版本ID</dt>
              <dd class="mt-1">{{ specification.latestVersionId }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg" v-if="specification.hash">
              <dt class="text-sm font-medium text-muted-foreground">哈希值</dt>
              <dd class="mt-1 break-all text-xs">{{ specification.hash }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
              <dd class="mt-1">{{ formatDate(specification.createdTime) || '暂无' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
              <dd class="mt-1">{{ formatDate(specification.updatedTime) || '暂无' }}</dd>
            </div>
          </div>
          
          <div v-if="specification.children && specification.children.length > 0" class="mt-8">
            <h3 class="text-lg font-medium mb-4">子规格</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="child in specification.children" 
                :key="child.id" 
                class="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <h4 class="font-medium">{{ child.name }}</h4>
                <p class="text-sm text-muted-foreground mt-1">
                  标签: {{ child.fileTag }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <design-parameter-preview :nodeId="specification.id" type="specification" />
    
    <!-- 上传对话框 -->
    <Dialog v-model:open="showUploadDialog">
      <DialogContent class="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader class="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 shadow-sm">
          <DialogTitle>上传文档</DialogTitle>
          <DialogDescription>
            请选择一个Word文档(.docx)上传
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4">
          <label class="block">
            <span class="sr-only">选择文件</span>
            <input 
              type="file" 
              accept=".docx" 
              class="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/80"
              @change="handleFileSelected"
            />
          </label>
          
          <div v-if="selectedFile" class="p-3 bg-muted rounded-md">
            <div class="flex items-center">
              <LucideFile class="h-6 w-6 mr-2 text-primary" />
              <span class="text-sm font-medium">{{ selectedFile.name }}</span>
              <span class="ml-auto text-xs text-muted-foreground">{{ formatFileSize(selectedFile.size) }}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <shadcn-button 
            type="button" 
            variant="outline" 
            @click="showUploadDialog = false"
            :disabled="isUploading"
          >
            取消
          </shadcn-button>
          <shadcn-button 
            type="button" 
            @click="handleUploadFile"
            :disabled="!selectedFile || isUploading"
          >
            <span v-if="isUploading" class="mr-2">
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            </span>
            上传
          </shadcn-button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucideSettings, LucideDownload, LucideUpload, LucideFile, LucideCopy } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdParameter } from '~/models/entity/parameter'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '~/components/ui/dialog'
import { useToast } from '~/components/ui/toast'

const props = defineProps<{
  specification: ZdSpecification
  isEditing: boolean
  parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
  edit: []
  cancel: []
  submit: [form: Partial<ZdSpecification>]
  download: [spec: ZdSpecification]
}>()

// 状态变量
const showUploadDialog = ref(false)
const isUploading = ref(false)
const selectedFile = ref<File | null>(null)
const entityApis = useEntityApis()
const { toast } = useToast()

const editForm = ref<Partial<ZdSpecification>>({
  name: props.specification.name,
  fileTag: props.specification.fileTag,
  url: props.specification.url
})

// 处理表单提交
const handleSubmit = () => {
  emit('submit', editForm.value)
}

// 处理文档下载
const handleDownload = async () => {
  if (!props.specification.url) return
  
  try {
    const blob = await entityApis.system.download(props.specification.url, {
      mode: 'no-cors'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.specification.name}_${new Date().toISOString().split('T')[0]}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: '下载成功',
      description: '文档已开始下载',
    })
  } catch (error) {
    console.error('下载文档失败:', error)
    toast({
      title: '下载失败',
      description: '无法下载文档，请稍后重试',
      variant: 'destructive',
    })
  }
}

// 处理打开上传对话框
const handleUpload = () => {
  selectedFile.value = null
  showUploadDialog.value = true
}

// 处理文件选择
const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}

// 处理文件上传
const handleUploadFile = async () => {
  if (!selectedFile.value || !props.specification.id) return
  
  isUploading.value = true
  
  try {
    // 准备元数据
    const specMeta = {
      id: props.specification.id,
      name: props.specification.name,
      fileTag: props.specification.fileTag || '',
      lastVersionId: props.specification.latestVersionId || 0
    }
    
    // 调用API上传文件
    await entityApis.specification.update(
      specMeta.fileTag, 
      selectedFile.value, 
      specMeta
    )
    
    // 关闭对话框并显示成功消息
    showUploadDialog.value = false
    toast({
      title: '上传成功',
      description: '文档已成功上传',
    })
  } catch (error) {
    console.error('上传文件失败:', error)
    toast({
      title: '上传失败',
      description: '无法上传文件，请稍后重试',
      variant: 'destructive',
    })
  } finally {
    isUploading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理复制标签
const handleCopyTag = async () => {
  if (!props.specification.fileTag) return
  
  try {
    await navigator.clipboard.writeText(`{{+${props.specification.fileTag}}}`)
    toast({
      title: '复制成功',
      description: '文件标签已复制到剪贴板',
    })
  } catch (error) {
    console.error('复制失败:', error)
    toast({
      title: '复制失败',
      description: '无法复制到剪贴板',
      variant: 'destructive',
    })
  }
}
</script> 