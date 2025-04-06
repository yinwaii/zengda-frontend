<template>
  <shadcn-dialog v-model:open="open">
    <shadcn-dialog-content class="sm:max-w-[525px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ ptype?.id ? '编辑产品类型' : '新建产品类型' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ ptype?.id ? '修改产品类型信息' : '添加产品类型' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="py-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">名称</label>
              <shadcn-input id="name" v-model="form.name" placeholder="请输入产品类型名称" required />
            </div>
            <div class="space-y-2">
              <label for="code" class="text-sm font-medium">代码</label>
              <shadcn-input id="code" v-model="form.code" placeholder="请输入产品类型代码" required />
            </div>
          </div>

          <div class="space-y-2">
            <label for="model" class="text-sm font-medium">型号</label>
            <shadcn-input id="model" v-model="form.model" placeholder="请输入产品类型型号" required />
          </div>

          <div class="space-y-2">
            <label for="description" class="text-sm font-medium">描述</label>
            <shadcn-textarea id="description" v-model="form.description" placeholder="请输入产品类型描述" />
          </div>

          <div class="flex items-center space-x-2">
            <shadcn-checkbox id="isShow" v-model:checked="form.isShow" />
            <label for="isShow" class="text-sm font-medium">显示</label>
          </div>
        </form>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button variant="outline" @click="open = false">取消</shadcn-button>
        <shadcn-button @click="handleSubmit">确认</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdPType } from '~/models/entity/ptype'

const props = defineProps<{
  open: boolean
  ptype?: ZdPType
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', ptype: ZdPType): void
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

// 监听dialog开关状态
watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.ptype) {
      // 编辑模式，复制现有数据
      form.value = { ...props.ptype }
    } else if (newVal) {
      // 新建模式，重置表单
      form.value = {
        id: 0,
        name: '',
        code: '',
        model: '',
        description: '',
        isShow: true
      }
    }
  }
)

// 提交表单
const handleSubmit = () => {
  // 验证表单
  if (!form.value.name || !form.value.code || !form.value.model) {
    alert('请填写必填字段')
    return
  }

  // 提交数据
  emit('save', { ...form.value })
  
  // 关闭对话框
  emit('update:open', false)
}

// 快捷访问
const open = defineModel<boolean>('open')
</script> 