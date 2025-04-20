<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ isEdit ? '编辑参数' : '添加参数' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ isEdit ? '修改参数信息' : '添加新的参数' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <form class="py-4 overflow-y-auto" @submit.prevent="onSubmit">
        <!-- 表单的主要部分 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <!-- 名称 -->
            <div class="grid gap-2">
              <label for="name" class="text-sm font-medium">参数名称</label>
              <shadcn-input id="name" v-model="formState.name" placeholder="请输入参数名称" />
            </div>
            
            <!-- 描述 -->
            <div class="grid gap-2">
              <label for="description" class="text-sm font-medium">描述</label>
              <shadcn-textarea id="description" v-model="formState.description" placeholder="请输入参数描述" />
            </div>
            
            <!-- 值 -->
            <div class="grid gap-2">
              <label for="value" class="text-sm font-medium">值</label>
              <shadcn-input id="value" v-model="formState.value" placeholder="请输入参数值" />
            </div>
            
            <!-- 数据类型 -->
            <div class="grid gap-2">
              <label for="dtype" class="text-sm font-medium">数据类型</label>
              <shadcn-input id="dtype" v-model="formState.dtype" placeholder="请输入数据类型" />
            </div>
            
            <!-- 选项设置 -->
            <div class="flex space-x-6 pt-2">
              <!-- 是否显示 -->
              <div class="flex items-center space-x-2">
                <shadcn-checkbox id="isShow" v-model:checked="formState.isShow" />
                <label for="isShow" class="text-sm font-medium">是否显示</label>
              </div>
              
              <!-- 是否只读 -->
              <div class="flex items-center space-x-2">
                <shadcn-checkbox id="isReadonly" v-model:checked="formState.isReadonly" />
                <label for="isReadonly" class="text-sm font-medium">是否只读</label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 按钮组 -->
        <div class="flex justify-end space-x-2 pt-6">
          <shadcn-button type="button" variant="outline" @click="closeDialog">
            取消
          </shadcn-button>
          <shadcn-button type="submit" :loading="isSubmitting">
            {{ isEdit ? '保存' : '创建' }}
          </shadcn-button>
        </div>
      </form>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import type { ZdParameter } from '~/models/entity/parameter'
import { ref, computed, watch } from 'vue'
import { object } from 'zod';

const props = defineProps<{
  open: boolean
  parameter?: ZdParameter
  nodeId?: string | number
  type?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', parameter: ZdParameter): void
}>()

// 表单状态
const formState = ref<ZdParameter>(props.parameter ? { ...props.parameter } : {} as ZdParameter)
const isSubmitting = ref(false)
const isEdit = computed(() => !!props.parameter)

// 当传入参数变化时更新表单
watch(() => props.parameter, (newVal) => {
  if (newVal) {
    formState.value = { ...newVal }
  } else {
    formState.value = {} as ZdParameter
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    // ... reset code
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const onSubmit = async () => {
  isSubmitting.value = true
  try {
    // 准备提交数据
    const submitData: ZdParameter = {
      ...formState.value,
      id: isEdit.value && props.parameter ? props.parameter.id : -1,
      objectId: toApiId(props.nodeId??0)??0,
      objectType: props.type || ''
    }
    
    // 触发提交事件
    emit('save', submitData)
    
    // 关闭对话框
    closeDialog()
  } catch (error) {
    console.error('提交参数失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const closeDialog = () => {
  setIsOpen(false)
}
</script> 