<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ specification?.id ? '编辑规格' : '新建规格' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ specification?.id ? '修改规格信息' : '创建新的规格' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="name" class="text-right">名称</shadcn-label>
          <shadcn-input id="name" v-model="form.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="fileTag" class="text-right">文件标签</shadcn-label>
          <shadcn-input id="fileTag" v-model="form.fileTag" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="url" class="text-right">URL</shadcn-label>
          <shadcn-input id="url" v-model="form.url" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4" v-if="isEditing && specification?.id">
          <shadcn-label for="latestVersionId" class="text-right">最新版本ID</shadcn-label>
          <shadcn-input id="latestVersionId" v-model="form.latestVersionId" type="number" class="col-span-3" disabled />
        </div>
        <div class="grid grid-cols-4 items-center gap-4" v-if="!isEditing">
          <shadcn-label for="file" class="text-right">规格文件</shadcn-label>
          <div class="col-span-3">
            <input 
              id="file" 
              type="file" 
              ref="fileInputRef"
              class="hidden" 
              @change="handleFileChange"
            />
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between border rounded-md p-2">
                <span class="truncate max-w-[260px]">
                  {{ selectedFile ? selectedFile.name : '未选择文件' }}
                </span>
                <shadcn-button type="button" variant="outline" size="sm" @click="triggerFileInput">
                  浏览...
                </shadcn-button>
              </div>
              <p class="text-xs text-muted-foreground">
                支持Word文档(docx)或PDF格式
              </p>
            </div>
          </div>
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdSpecification, ZdSpecificationMeta } from '~/models/entity/specification'

const props = defineProps<{
  open: boolean
  specification?: ZdSpecification | null
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', specification: ZdSpecification | ZdSpecificationMeta, file?: File): void
}>()

// 默认规格对象
const defaultSpecification = (): any => ({
  id: 0,
  name: '',
  fileTag: '',
  url: '',
  latestVersionId: 0,
  params: {},
  searchValue: '',
  children: [],
  texts: {},
  bools: {},
  imgs: {}
})

const form = ref<any>(defaultSpecification())
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const entityApis = useEntityApis()

// 监听规格变化，初始化表单
watch(() => props.specification, (newSpec) => {
  if (newSpec) {
    form.value = { 
      id: newSpec.id,
      name: newSpec.name,
      fileTag: newSpec.fileTag,
      url: newSpec.url,
      latestVersionId: newSpec.latestVersionId
    }
  } else {
    form.value = defaultSpecification()
    selectedFile.value = null
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = defaultSpecification()
    selectedFile.value = null
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理文件选择
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 文件变更处理
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}

// 处理表单提交
const handleSubmit = () => {
  // 表单验证
  if (!form.value.name) {
    console.error('规格名称不能为空')
    return
  }
  
  if (!props.isEditing && !selectedFile.value) {
    console.error('请选择一个规格文件')
    return
  }
  
  // 处理新建规格的情况
  if (!props.isEditing) {
    const specMeta: ZdSpecificationMeta = {
      name: form.value.name,
      fileTag: form.value.fileTag || selectedFile.value?.name || '',
      lastVersionId: 0
    }
    emit('save', specMeta, selectedFile.value || undefined)
  } else {
    // 处理编辑规格的情况
    emit('save', form.value)
  }
  
  setIsOpen(false)
}
</script> 