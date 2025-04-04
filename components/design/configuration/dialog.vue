<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ configuration?.id ? '编辑配置' : '新建配置' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ configuration?.id ? '修改配置信息' : '创建新的配置' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="name" class="text-right">名称</shadcn-label>
          <shadcn-input id="name" v-model="form.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="description" class="text-right">描述</shadcn-label>
          <shadcn-input id="description" v-model="form.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="projectId" class="text-right">项目ID</shadcn-label>
          <shadcn-input id="projectId" v-model="form.projectId" type="number" class="col-span-3" />
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

const props = defineProps<{
  open: boolean
  configuration?: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', configuration: any): void
}>()

// 默认配置对象
const defaultConfiguration = () => ({
  id: undefined,
  name: '',
  description: '',
  projectId: undefined,
  createdTime: undefined,
  updatedTime: undefined
})

const form = ref(defaultConfiguration())

// 监听配置变化，初始化表单
watch(() => props.configuration, (newConfiguration) => {
  if (newConfiguration) {
    form.value = { ...newConfiguration }
  } else {
    form.value = defaultConfiguration()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = defaultConfiguration()
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const handleSubmit = () => {
  // 表单验证
  if (!form.value.name) {
    console.error('配置名称不能为空')
    return
  }
  
  emit('save', form.value)
  setIsOpen(false)
}
</script> 