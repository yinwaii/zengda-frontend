<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ component?.id ? '编辑组件' : '新建组件' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ component?.id ? '修改组件信息' : '创建新的组件' }}
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
          <shadcn-label for="isShow" class="text-right">是否显示</shadcn-label>
          <shadcn-checkbox id="isShow" v-model="form.isShow" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="isRequired" class="text-right">是否必须</shadcn-label>
          <shadcn-checkbox id="isRequired" v-model="form.isRequired" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="price" class="text-right">价格</shadcn-label>
          <shadcn-input id="price" v-model="form.price" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="value" class="text-right">数量</shadcn-label>
          <shadcn-input id="value" v-model="form.value" class="col-span-3" />
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
import type { ZdComponent } from '~/models/entity/component'

const props = defineProps<{
  open: boolean
  component?: ZdComponent | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', component: ZdComponent): void
}>()

const form = ref<ZdComponent>({} as ZdComponent)

// 监听组件变化，初始化表单
watch(() => props.component, (newComponent) => {
  if (newComponent) {
    form.value = { ...newComponent }
  } else {
    form.value = {} as ZdComponent
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = {} as ZdComponent
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const handleSubmit = (event: Event) => {
  // 防止表单默认提交行为
  if (event) event.preventDefault()
  
  // 表单验证
  if (!form.value.name) {
    console.error('组件名称不能为空')
    return
  }
  
  emit('save', form.value)
  setIsOpen(false)
}
</script> 