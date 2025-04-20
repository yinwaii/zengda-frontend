<template>
  <shadcn-dialog :open="open" @update:open="handleUpdateOpen">
    <shadcn-dialog-content class="max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ isEdit ? '编辑组件' : '新建组件' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ isEdit ? '修改组件信息' : '创建一个新的组件' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="overflow-y-auto max-h-[calc(80vh-8rem)]">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <shadcn-label for="name">名称</shadcn-label>
            <shadcn-input id="name" v-model="form.name" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="description">描述</shadcn-label>
            <shadcn-textarea id="description" v-model="form.description" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="isShow">是否显示</shadcn-label>
            <shadcn-checkbox id="isShow" v-model="form.isShow" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="isRequired">是否必须</shadcn-label>
            <shadcn-checkbox id="isRequired" v-model="form.isRequired" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="price">价格计算公式/默认价格</shadcn-label>
            <shadcn-input id="price" v-model="form.price" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="compValue">价格</shadcn-label>
            <shadcn-input id="compValue" v-model="form.compValue" />
          </div>
        </form>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch, toRaw } from 'vue'
import type { ZdComponent } from '~/models/entity/component'
// import type { BasicProperty, TimeStamp } from '~/models/entity/types'

const props = defineProps<{
  open: boolean
  isEdit?: boolean
  data?: ZdComponent
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [form: Partial<ZdComponent>]
}>()

const form = ref<Partial<ZdComponent>>({
  name: '',
  description: '',
  isShow: true,
  isRequired: false,
  price: '',
  compValue: '',
  bomId: undefined
})

watch(() => props.data, (newData) => {
  if (newData) {
    form.value = {
      id: newData.id,
      name: newData.name,
      description: newData.description,
      isShow: newData.isShow,
      isRequired: newData.isRequired,
      price: newData.price || '',
      compValue: newData.compValue || '',
      bomId: newData.bomId
    }
  } else {
    form.value = {
      name: '',
      description: '',
      isShow: true,
      isRequired: false,
      price: '',
      compValue: '',
      bomId: undefined
    }
  }
}, { immediate: true })

const handleUpdateOpen = (value: boolean) => {
  emit('update:open', value)
}

const handleSubmit = (event: Event) => {
  if (event) event.preventDefault()
  
  // 获取表单数据
  const formData = toRaw(form.value)
  
  // 创建新对象，根据是否是编辑模式决定是否包含id
  const updatedData = {
    ...formData,
    // ...(props.isEdit ? { id: formData.id } : {})
  }
  
  // 使用 JSON 序列化再解析来创建普通对象的深拷贝，移除 Proxy
  const plainData = JSON.parse(JSON.stringify(updatedData))
  
  console.log('发送组件数据:', plainData)
  emit('save', plainData)
  emit('update:open', false)
}
</script> 