<template>
  <shadcn-dialog :open="isOpen" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ template?.id ? '编辑项目模板' : '新建项目模板' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ template?.id ? '修改项目模板信息' : '创建新的项目模板' }}
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
          <shadcn-label for="isShow" class="text-right">是否显示</shadcn-label>
          <shadcn-checkbox id="isShow" v-model="form.isShow" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="isCustomized" class="text-right">是否定制</shadcn-label>
          <shadcn-checkbox id="isCustomized" v-model="form.isCustomized" class="col-span-3" />
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ZdTemplate } from '~/models/entity/template'
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  template?: ZdTemplate
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', template: ZdTemplate): void
}>()

const form = ref<ZdTemplate>(new ZdTemplate())

// 监听模板变化，初始化表单
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.value = { ...newTemplate }
  } else {
    form.value = new ZdTemplate()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.value = new ZdTemplate()
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