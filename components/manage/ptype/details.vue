<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">{{ ptype.name }}</h2>
      <div class="flex space-x-2">
        <shadcn-button variant="outline" @click="handleReset">
          <lucide-undo-2 class="mr-2 h-4 w-4" />
          重置
        </shadcn-button>
        <shadcn-button @click="handleSave" :disabled="!isDirty">
          <lucide-save class="mr-2 h-4 w-4" />
          保存
        </shadcn-button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- 基本信息 -->
      <shadcn-card>
        <shadcn-card-header>
          <shadcn-card-title>基本信息</shadcn-card-title>
          <shadcn-card-description>产品类型的基本属性和信息</shadcn-card-description>
        </shadcn-card-header>
        <shadcn-card-content>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">ID</label>
                <shadcn-input v-model="form.id" disabled />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">是否显示</label>
                <shadcn-input :value="form.isShow ? '是' : '否'" disabled />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">名称 *</label>
              <shadcn-input v-model="form.name" placeholder="请输入产品类型名称" />
              <p v-if="!form.name" class="text-xs text-red-500">名称不能为空</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">代码 *</label>
                <shadcn-input v-model="form.code" placeholder="请输入产品类型代码" />
                <p v-if="!form.code" class="text-xs text-red-500">代码不能为空</p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">型号 *</label>
                <shadcn-input v-model="form.model" placeholder="请输入产品类型型号" />
                <p v-if="!form.model" class="text-xs text-red-500">型号不能为空</p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">描述</label>
              <shadcn-textarea v-model="form.description" placeholder="请输入产品类型描述" />
            </div>

            <div class="flex items-center space-x-2">
              <shadcn-checkbox id="isShow" v-model:checked="form.isShow" />
              <label for="isShow" class="text-sm font-medium">显示</label>
            </div>
          </div>
        </shadcn-card-content>
      </shadcn-card>

      <!-- 创建和更新信息 -->
      <shadcn-card>
        <shadcn-card-header>
          <shadcn-card-title>系统信息</shadcn-card-title>
          <shadcn-card-description>创建和更新记录</shadcn-card-description>
        </shadcn-card-header>
        <shadcn-card-content>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">创建时间</label>
                <shadcn-input :value="formatDate(form.createdTime)" disabled />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">创建人</label>
                <shadcn-input v-model="form.createdBy" disabled />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">更新时间</label>
                <shadcn-input :value="formatDate(form.updatedTime)" disabled />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">更新人</label>
                <shadcn-input v-model="form.updatedBy" disabled />
              </div>
            </div>
          </div>
        </shadcn-card-content>
      </shadcn-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ZdPType } from '~/models/entity/ptype'

const props = defineProps<{
  ptype: ZdPType
}>()

const emit = defineEmits<{
  (e: 'update', ptype: ZdPType): void
}>()

// 表单数据
const form = ref<ZdPType>({
  id: 0,
  name: '',
  code: '',
  model: '',
  description: '',
  isShow: true
})

// 原始数据，用于重置
const original = ref<ZdPType | null>(null)

// 初始化表单数据
watch(
  () => props.ptype,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
      original.value = { ...newVal }
    }
  },
  { immediate: true }
)

// 判断表单是否被修改
const isDirty = computed(() => {
  if (!original.value) return false

  return (
    form.value.name !== original.value.name ||
    form.value.code !== original.value.code ||
    form.value.model !== original.value.model ||
    form.value.description !== original.value.description ||
    form.value.isShow !== original.value.isShow
  )
})

// 判断表单是否有效
const isValid = computed(() => {
  return !!(form.value.name && form.value.code && form.value.model)
})

// 重置表单
const handleReset = () => {
  if (original.value) {
    form.value = { ...original.value }
  }
}

// 保存表单
const handleSave = () => {
  if (!isValid.value) {
    alert('请填写所有必填字段')
    return
  }

  emit('update', { ...form.value })
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script> 