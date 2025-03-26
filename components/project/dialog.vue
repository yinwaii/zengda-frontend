<template>
  <shadcn-dialog :open="isOpen" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ project?.id ? '编辑项目' : '新建项目' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ project?.id ? '修改项目信息' : '创建新的项目' }}
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
          <shadcn-label for="productTypeId" class="text-right">产品类型</shadcn-label>
          <shadcn-input id="productTypeId" v-model="form.productTypeId" type="number" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="templateId" class="text-right">模板ID</shadcn-label>
          <shadcn-input id="templateId" v-model="form.templateId" type="number" class="col-span-3" />
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ZdProject } from '~/models/entity/project'
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  project?: ZdProject
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', project: ZdProject): void
}>()

const form = ref<ZdProject>(new ZdProject())

// 监听项目变化，初始化表单
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = { ...newProject }
  } else {
    form.value = new ZdProject()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.value = new ZdProject()
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:isOpen', value)
}

// 处理表单提交
const handleSubmit = () => {
  emit('submit', form.value)
  setIsOpen(false)
}
</script> 