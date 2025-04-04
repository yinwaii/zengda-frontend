<template>
  <shadcn-dialog :open="open" @update:open="$emit('update:open', $event)">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ template?.id ? '编辑' : '新建' }}模板</shadcn-dialog-title>
        <shadcn-dialog-description>
          填写项目模板信息
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="py-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <shadcn-label for="name">名称</shadcn-label>
            <shadcn-input id="name" v-model="form.name" placeholder="输入模板名称" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="description">描述</shadcn-label>
            <shadcn-textarea id="description" v-model="form.description" placeholder="输入模板描述" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="productTypeId">产品类型</shadcn-label>
            <shadcn-input id="productTypeId" type="number" v-model="form.productTypeId" placeholder="输入产品类型ID" />
          </div>
          <div class="flex items-center space-x-2">
            <shadcn-checkbox id="isCustomized" v-model="form.isCustomized" />
            <shadcn-label for="isCustomized">定制模板</shadcn-label>
          </div>
          <div class="flex items-center space-x-2">
            <shadcn-checkbox id="isShow" v-model="form.isShow" />
            <shadcn-label for="isShow">显示模板</shadcn-label>
          </div>
        </form>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="button" variant="outline" @click="$emit('update:open', false)">
          取消
        </shadcn-button>
        <shadcn-button type="button" @click="handleSubmit">
          保存
        </shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
  open: boolean,
  template?: ZdTemplate
}>()

const emit = defineEmits<{
  'update:open': [value: boolean],
  'save': [template: ZdTemplate]
}>()

// 表单数据
const form = ref<Partial<ZdTemplate>>({
  name: '',
  description: '',
  productTypeId: 0,
  isCustomized: false,
  isShow: true
})

// 监听模板变化，更新表单
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.value = { ...newTemplate }
  } else {
    // 新建模板时重置表单
    form.value = {
      name: '',
      description: '',
      productTypeId: 0,
      isCustomized: false,
      isShow: true
    }
  }
}, { immediate: true })

// 提交表单
const handleSubmit = () => {
  // 构建完整的模板对象
  const templateData: ZdTemplate = {
    id: props.template?.id || 0,
    name: form.value.name || '',
    description: form.value.description || '',
    productTypeId: form.value.productTypeId || 0,
    isCustomized: form.value.isCustomized || false,
    isShow: form.value.isShow || false,
    createdTime: props.template?.createdTime,
    updatedTime: props.template?.updatedTime,
    createdBy: props.template?.createdBy,
    updatedBy: props.template?.updatedBy
  }

  // 提交保存
  emit('save', templateData)
  // 关闭对话框
  emit('update:open', false)
}
</script> 