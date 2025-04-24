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
            
            <!-- 数据类型 -->
            <div class="grid gap-2">
              <label for="dtype" class="text-sm font-medium">数据类型</label>
              <shadcn-select v-model="formState.dtype">
                <shadcn-select-trigger>
                  <shadcn-select-value placeholder="请选择数据类型" />
                </shadcn-select-trigger>
                <shadcn-select-content>
                  <shadcn-select-group>
                    <shadcn-select-item v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </shadcn-select-item>
                  </shadcn-select-group>
                </shadcn-select-content>
              </shadcn-select>
            </div>

            <!-- 是否启用选项 -->
            <div class="flex items-center space-x-2">
              <shadcn-switch id="enableOptions" v-model:checked="enableOptions" />
              <label for="enableOptions" class="text-sm font-medium">启用选项</label>
            </div>
            
            <!-- 值 -->
            <div class="grid gap-2">
              <label for="value" class="text-sm font-medium">值</label>
              <shadcn-input id="value" v-model="formState.value" placeholder="请输入参数值" />
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

            <!-- 选项列表 -->
            <div v-if="enableOptions" class="space-y-4 mt-4">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-medium">选项列表</h3>
                <shadcn-button type="button" variant="outline" size="sm" @click="addOption">
                  <i class="i-lucide-plus mr-2" />添加选项
                </shadcn-button>
              </div>
              
              <div v-for="(option, index) in optionList" :key="index" class="flex space-x-2">
                <shadcn-input 
                  v-model="option.value" 
                  placeholder="选项值"
                  class="flex-1"
                  @change="updateArgList"
                />
                <shadcn-input 
                  v-model="option.label" 
                  placeholder="选项标签"
                  class="flex-1"
                  @change="updateArgList"
                />
                <shadcn-button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  @click="removeOption(index)"
                >
                  <i class="i-lucide-trash-2" />
                </shadcn-button>
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

// 数据类型选项
const dataTypeOptions = [
  { value: 'int', label: '整数' },
  { value: 'double', label: '小数' },
  { value: 'string', label: '文本' },
  { value: 'boolean', label: '是/否' },
  { value: 'expression', label: '公式' }
]

// 获取数据类型的显示标签
const getDataTypeLabel = (value: string) => {
  return dataTypeOptions.find(option => option.value === value)?.label || value
}

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

// 选项列表
const optionList = ref<Array<{value: string, label: string}>>([])

// 是否启用选项
const enableOptions = ref(false)

// 监听选项开关变化
watch(enableOptions, (newVal) => {
  if (newVal) {
    formState.value.showType = 'option'
    if (!formState.value.argList) {
      formState.value.argList = '[]'
    }
  } else {
    formState.value.showType = ''
    formState.value.argList = ''
  }
})

// 初始化时检查是否有选项
watch(() => props.parameter, (newVal) => {
  if (newVal) {
    enableOptions.value = newVal.showType === 'option'
    if (newVal.argList) {
      try {
        optionList.value = JSON.parse(newVal.argList)
      } catch (e) {
        optionList.value = []
      }
    }
  }
}, { immediate: true })

// 添加新选项
const addOption = () => {
  optionList.value.push({ value: '', label: '' })
}

// 删除选项
const removeOption = (index: number) => {
  optionList.value.splice(index, 1)
}

// 更新选项到formState
const updateArgList = () => {
  formState.value.argList = JSON.stringify(optionList.value)
}

// 修改提交处理
const onSubmit = async () => {
  isSubmitting.value = true
  try {
    // 如果启用了选项，更新argList
    if (enableOptions.value) {
      updateArgList()
    }
    
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