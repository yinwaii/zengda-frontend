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
            <shadcn-button @click="handlePreview" v-if="specification.url">
              <LucideEye class="mr-2 h-4 w-4" />
              预览
            </shadcn-button>
            <shadcn-button @click="handleDownload" v-if="specification.url">
              <LucideDownload class="mr-2 h-4 w-4" />
              下载
            </shadcn-button>
            <shadcn-button @click="$emit('edit')">
              <LucidePencil class="mr-2 h-4 w-4" />
              编辑
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
          
          <div v-if="previewContent" class="mt-8">
            <h3 class="text-lg font-medium mb-4">文档预览</h3>
            <div class="border rounded-lg p-4 bg-white">
              <div v-html="previewContent" class="prose max-w-none"></div>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <design-parameter-preview :parameters="parameters || []" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucidePencil, LucideEye, LucideDownload } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdParameter } from '~/models/entity/parameter'

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

const previewContent = ref<string | null>(null)
const entityApis = useEntityApis()

const editForm = ref<Partial<ZdSpecification>>({
  name: props.specification.name,
  fileTag: props.specification.fileTag,
  url: props.specification.url
})

// 处理表单提交
const handleSubmit = () => {
  emit('submit', editForm.value)
}

// 处理文档预览
const handlePreview = async () => {
  if (!props.specification.url) return
  
  try {
    previewContent.value = '加载中...'
    const html = await entityApis.system.downloadAsHtml(props.specification.url)
    previewContent.value = html
  } catch (error) {
    console.error('预览文档失败:', error)
    previewContent.value = '预览文档失败，请尝试下载查看'
  }
}

// 处理文档下载
const handleDownload = () => {
  emit('download', props.specification)
}
</script> 