<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ specification.name }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ specification.description || '暂无描述' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <shadcn-button v-if="specification.url" variant="outline" @click="showEditor = true">
              <LucidePencil class="mr-2 h-4 w-4" />
              编辑规格
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
              <shadcn-label for="description">描述</shadcn-label>
              <shadcn-textarea id="description" v-model="editForm.description" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <shadcn-label>内容</shadcn-label>
                <div class="flex gap-2">
                  <shadcn-button type="button" variant="outline" size="sm" @click="handleImportDocx">
                    <LucideFileUp class="mr-2 h-4 w-4" />
                    导入DOCX
                  </shadcn-button>
                  <shadcn-button type="button" variant="outline" size="sm" @click="handleExportDocx">
                    <LucideFileDown class="mr-2 h-4 w-4" />
                    导出DOCX
                  </shadcn-button>
                </div>
              </div>
              <design-editor-tiny-editor
                :model-value="editForm.content || ''"
                @update:model-value="(value) => editForm.content = value"
                :disabled="false"
                @change="handleContentChange"
              />
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
              <dt class="text-sm font-medium text-muted-foreground">文件标签</dt>
              <dd class="mt-1">{{ specification.fileTag || '暂无标签' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">最新版本ID</dt>
              <dd class="mt-1">{{ specification.latestVersionId }}</dd>
            </div>
            <div class="col-span-2 space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">URL</dt>
              <dd class="mt-1">
                <a v-if="specification.url" :href="specification.url" target="_blank" class="text-blue-500 hover:underline">
                  {{ specification.url }}
                </a>
                <span v-else>暂无URL</span>
              </dd>
            </div>
            <div v-if="specification.hash" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">哈希值</dt>
              <dd class="mt-1">{{ specification.hash }}</dd>
            </div>
            <div v-if="specification.attributes" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">属性</dt>
              <dd class="mt-1">{{ specification.attributes }}</dd>
            </div>
            <div class="col-span-2 space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">描述</dt>
              <dd class="mt-1">{{ specification.description || '暂无描述' }}</dd>
            </div>
            <div class="col-span-2 space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">内容</dt>
              <dd class="mt-1" v-html="specification.content"></dd>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">版本信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div v-if="specification.versionLink && specification.versionLink.length > 0">
          <div class="flex flex-col gap-2">
            <div v-for="version in specification.versionLink" :key="version.id" class="p-3 border rounded-lg">
              <div class="flex justify-between">
                <div>版本ID: {{ version.id }}</div>
                <div>{{ formatDate(version.createdTime) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-muted-foreground py-4">
          暂无版本信息
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">数据信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="Object.keys(specification.texts || {}).length > 0" class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">文本数据</dt>
            <dd class="mt-1">
              <div v-for="(value, key) in specification.texts" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </dd>
          </div>
          <div v-if="Object.keys(specification.bools || {}).length > 0" class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">布尔数据</dt>
            <dd class="mt-1">
              <div v-for="(value, key) in specification.bools" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span>{{ value ? '是' : '否' }}</span>
              </div>
            </dd>
          </div>
          <div v-if="Object.keys(specification.imgs || {}).length > 0" class="col-span-1 md:col-span-2 space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">图片数据</dt>
            <dd class="mt-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(value, key) in specification.imgs" :key="key" class="space-y-1">
                <div class="text-sm">{{ key }}</div>
                <img :src="value" :alt="key" class="w-full h-auto rounded-md border" />
              </div>
            </dd>
          </div>
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">系统信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">创建人</dt>
            <dd class="mt-1">{{ specification.createdBy || '暂无创建人' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
            <dd class="mt-1">{{ formatDate(specification.createdTime) || '暂无创建时间' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">修改人</dt>
            <dd class="mt-1">{{ specification.updatedBy || '暂无修改人' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
            <dd class="mt-1">{{ formatDate(specification.updatedTime) || '暂无修改时间' }}</dd>
          </div>
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <design-parameter-preview v-if="parameters && parameters.length > 0" :parameters="parameters" />

    <!-- 规格书编辑器对话框 -->
    <shadcn-dialog v-model:open="showEditor">
      <shadcn-dialog-content class="max-w-5xl editor-dialog-content">
        <shadcn-dialog-header>
          <shadcn-dialog-title>编辑规格书</shadcn-dialog-title>
          <shadcn-dialog-description>
            编辑规格书内容，支持富文本编辑
          </shadcn-dialog-description>
        </shadcn-dialog-header>
        <div class="py-2 h-full">
          <design-specification-editor
            :spec-id="specification.id"
            :file-tag="specification.fileTag"
            :name="specification.name"
            :latest-version-id="specification.latestVersionId"
            @save="handleEditorSave"
          />
        </div>
      </shadcn-dialog-content>
    </shadcn-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucidePencil, LucideExternalLink, LucideFileUp, LucideFileDown } from 'lucide-vue-next'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdParameter } from '~/models/entity/parameter'
import { formatDate } from '~/utils/date'
import { docxToHtml, htmlToDocx } from '~/utils/document'
import TinyEditor from '~/components/design/editor/TinyEditor.vue'
import DesignSpecificationEditor from '~/components/design/specification/editor.vue'

const props = defineProps<{
  specification: ZdSpecification
  isEditing: boolean
  parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
  edit: []
  cancel: []
  submit: [form: Partial<ZdSpecification>]
}>()

const editForm = ref<Partial<ZdSpecification>>({
  name: props.specification.name,
  description: props.specification.description,
  content: props.specification.content || ''
})

const showEditor = ref(false)

// 处理 DOCX 导入
const handleImportDocx = async () => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.docx'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const html = await docxToHtml(file)
        editForm.value.content = html
      }
    }
    input.click()
  } catch (error) {
    console.error('导入 DOCX 失败:', error)
  }
}

// 处理 DOCX 导出
const handleExportDocx = async () => {
  try {
    if (!editForm.value.content) return
    
    const file = await htmlToDocx(editForm.value.content, `${props.specification.name}.docx`)
    
    // 创建下载链接
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出 DOCX 失败:', error)
  }
}

const handleContentChange = (content: string) => {
  editForm.value.content = content
}

const handleSubmit = () => {
  emit('submit', editForm.value)
}

// 处理编辑器保存
const handleEditorSave = async () => {
  showEditor.value = false
  // 刷新规格书数据
  emit('submit', {
    ...props.specification,
    content: editForm.value.content
  })
}
</script>

<style scoped>
:deep(.editor-dialog-content) {
  height: 85vh;
  max-height: 85vh;
  width: 90vw;
  max-width: 1400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.shadcn-dialog-content) {
  padding: 1rem;
}

:deep(.shadcn-dialog-header) {
  padding: 0;
  margin-bottom: 0.5rem;
}
</style> 