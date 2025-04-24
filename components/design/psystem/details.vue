<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ system?.name }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ system?.description || '暂无描述' }}</p>
          </div>
          <div class="flex items-center gap-2">
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
            <!-- <div class="space-y-2">
              <shadcn-label for="docsUrl">文档链接</shadcn-label>
              <shadcn-input id="docsUrl" v-model="docsUrlInput" />
            </div> -->
            <div class="space-y-2">
              <shadcn-label for="isShow">是否显示</shadcn-label>
              <shadcn-checkbox id="isShow" v-model="editForm.isShow" />
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
              <dd class="mt-1">{{ system?.id }}</dd>
            </div>
            <!-- <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">文档链接</dt>
              <dd class="mt-1">
                <a v-if="system?.docsUrl" :href="system.docsUrl" target="_blank" class="text-blue-500 hover:underline">
                  {{ system.docsUrl }}
                </a>
                <span v-else>无</span>
              </dd>
            </div> -->
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
              <dd class="mt-1">
                <shadcn-badge :variant="system?.isShow ? 'default' : 'outline'">
                  {{ system?.isShow ? '是' : '否' }}
                </shadcn-badge>
              </dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
              <dd class="mt-1">{{ formatDate(system?.createdTime) || '暂无' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
              <dd class="mt-1">{{ formatDate(system?.updatedTime) || '暂无' }}</dd>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <design-parameter-preview :nodeId="system?.id || 0" type="psystem" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdParameter } from '~/models/entity/parameter'

const props = defineProps<{
  system?: ZdPSystem | null
  isEditing: boolean
  parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
  edit: []
  cancel: []
  save: [form: {
    id?: number
    name?: string
    description?: string
    docsUrl: string | null
    isShow?: boolean
  }]
}>()

const editForm = ref<{
  name?: string
  description?: string
  docsUrl: string | null
  isShow?: boolean
}>({
  name: props.system?.name,
  description: props.system?.description,
  docsUrl: props.system?.docsUrl ?? null,
  isShow: props.system?.isShow
})

const docsUrlInput = computed({
  get: () => editForm.value.docsUrl || '',
  set: (value: string) => {
    editForm.value.docsUrl = value || null
  }
})

// 监听 props.system 变化，更新 editForm
watch(() => props.system, (newSystem) => {
  if (newSystem) {
    editForm.value = {
      name: newSystem.name,
      description: newSystem.description,
      docsUrl: newSystem.docsUrl ?? null,
      isShow: newSystem.isShow
    }
  }
}, { immediate: true })

const handleSubmit = (event: Event) => {
  // 阻止表单默认提交行为
  if (event) event.preventDefault()
  
  // 确保有原始ID
  const originalId = props.system?.id
  
  // 创建更新对象，确保包含必要字段，但不包含 isDeleted
  const updatedData = {
    id: originalId,
    name: editForm.value.name,
    description: editForm.value.description,
    docsUrl: editForm.value.docsUrl,
    isShow: editForm.value.isShow
  } as Partial<ZdPSystem>
  
  // 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
  const plainData = JSON.parse(JSON.stringify(updatedData))
  
  console.log('发送修改后的系统数据:', plainData)
  emit('save', plainData)
}
</script> 