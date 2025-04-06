<template>
  <shadcn-dialog v-model:open="isOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ template?.id ? '编辑模板' : '新建模板' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ template?.id ? '修改模板信息' : '创建新的模板' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <form @submit.prevent="handleSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="name" class="text-right">名称</shadcn-label>
            <shadcn-input id="name" v-model="form.name" class="col-span-3" required />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="description" class="text-right">描述</shadcn-label>
            <shadcn-textarea id="description" v-model="form.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="isShow" class="text-right">是否显示</shadcn-label>
          <shadcn-checkbox id="isShow" v-model="form.isShow" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="isCustomized" class="text-right">是否定制</shadcn-label>
          <shadcn-checkbox id="isCustomized" v-model="form.isCustomized" class="col-span-3" />
        </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="productTypeId" class="text-right">产品类型ID</shadcn-label>
            <shadcn-input id="productTypeId" v-model="form.productTypeId" type="number" class="col-span-3" required />
          </div>
      </div>
      <shadcn-dialog-footer>
          <shadcn-button type="submit">保存</shadcn-button>
      </shadcn-dialog-footer>
      </form>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
  open: boolean
  template?: ZdTemplate | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [template: ZdTemplate]
}>()

const form = ref<Partial<ZdTemplate>>({
  name: '',
  description: '',
  isShow: true,
  isCustomized: false,
  productTypeId: 1
})

// 监听模板变化，初始化表单
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.value = {
      name: newTemplate.name,
      description: newTemplate.description,
      isShow: newTemplate.isShow,
      isCustomized: newTemplate.isCustomized,
      productTypeId: newTemplate.productTypeId
    }
  } else {
    form.value = {
      name: '',
      description: '',
      isShow: true,
      isCustomized: false,
      productTypeId: 1
    }
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    // 关闭对话框时不重置表单，避免刷新已编辑的值
    return
  }
})

// 内部状态，同步props.open
const isOpen = ref(props.open)
watch(() => props.open, (newVal) => {
  isOpen.value = newVal
})
watch(() => isOpen.value, (newVal) => {
  emit('update:open', newVal)
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  isOpen.value = value
}

// 处理表单提交
const handleSubmit = (event: Event) => {
  // 阻止表单默认提交行为
  if (event) event.preventDefault()
  
  // 表单验证
  if (!form.value.name) {
    console.error('模板名称不能为空')
    return
  }
  
  // 创建新的模板对象
  const newTemplate: ZdTemplate = {
    ...form.value,
    id: props.template?.id || 0
  } as ZdTemplate
  
  // 触发保存事件
  emit('save', newTemplate)
  
  // 关闭对话框
  setIsOpen(false)
}
</script> 