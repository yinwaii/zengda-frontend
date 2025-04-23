<template>
  <shadcn-dialog :open="open" @update:open="$emit('update:open', $event)">
    <shadcn-dialog-content class="max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ isEdit ? '编辑模板' : isClone ? '克隆模板' : '创建模板' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ isEdit ? '修改模板信息' : isClone ? '基于现有模板创建新模板' : '创建新的模板' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <shadcn-label for="name">名称</shadcn-label>
            <shadcn-input id="name" v-model="form.name" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="description">描述</shadcn-label>
            <shadcn-textarea id="description" v-model="form.description" />
          </div>
          <product-type-select v-model="form.productTypeId" />
          <div class="space-y-2">
            <shadcn-label for="isShow">是否显示</shadcn-label>
            <shadcn-switch id="isShow" v-model="form.isShow" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="isCustomized">是否定制</shadcn-label>
            <shadcn-switch id="isCustomized" v-model="form.isCustomized" />
          </div>
        </div>
        <shadcn-dialog-footer>
          <shadcn-button type="submit">{{ isEdit ? '保存' : isClone ? '克隆' : '创建' }}</shadcn-button>
        </shadcn-dialog-footer>
      </form>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdTemplate } from '~/models/entity/template'
import ProductTypeSelect from '~/components/design/product-type-select.vue'

const props = defineProps<{
  open: boolean
  template?: ZdTemplate
  // isEdit?: boolean
  isClone?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: Omit<ZdTemplate, 'id' | 'isDeleted'>): void
}>()

const isEdit = computed(() => !!props.template && !props.isClone)
const isClone = computed(() => !!props.isClone)

const form = ref({
  name: '',
  description: '',
  productTypeId: 0,
  isShow: true,
  isCustomized: false
})

watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.value = {
      name: props.isClone ? `${newTemplate.name} (克隆)` : newTemplate.name,
      description: newTemplate.description ?? '',
      productTypeId: newTemplate.productTypeId,
      isShow: newTemplate.isShow,
      isCustomized: newTemplate.isCustomized
    }
  } else {
    form.value = {
      name: '',
      description: '',
      productTypeId: 0,
      isShow: true,
      isCustomized: false
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  const newTemplate = {
    ...form.value
  }
  const plainData = JSON.parse(JSON.stringify(newTemplate))
  emit('save', plainData)
}
</script> 