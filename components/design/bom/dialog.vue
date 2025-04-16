<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px] max-h-[80vh]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ bom?.id ? '编辑BOM' : '新建BOM' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ bom?.id ? '修改BOM信息' : '创建新的BOM' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="overflow-y-auto max-h-[calc(80vh-8rem)]">
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="number" class="text-right">编号</shadcn-label>
              <shadcn-input id="number" v-model="form.number" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="version" class="text-right">版本</shadcn-label>
              <shadcn-input id="version" v-model="form.version" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="componentId" class="text-right">组件ID</shadcn-label>
              <shadcn-input id="componentId" v-model="form.componentId" type="number" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <shadcn-label for="note" class="text-right">备注</shadcn-label>
              <shadcn-textarea id="note" v-model="form.note" class="col-span-3" />
            </div>
          </div>
          <shadcn-dialog-footer>
            <shadcn-button type="submit">保存</shadcn-button>
          </shadcn-dialog-footer>
        </form>
      </div>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdBom } from '~/models/entity/bom'

// 定义创建和更新时的数据类型
type CreateBomData = Omit<ZdBom, 'id' | 'isDeleted'>
type UpdateBomData = Omit<ZdBom, 'isDeleted'>

const props = defineProps<{
  open: boolean
  bom?: ZdBom | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', bom: CreateBomData | UpdateBomData): void
}>()

// 默认BOM对象
const defaultBom = (): ZdBom => ({
  id: 0,
  number: '',
  version: '',
  componentId: 0,
  tcomponentId: 0,
  interId: 0,
  parentId: 0,
  lastVersionId: '',
  note: '',
  params: {},
  searchValue: '',
  price: 0,
  isDeleted: false,
  items: []
})

const form = ref<ZdBom>(defaultBom())

// 监听BOM变化，初始化表单
watch(() => props.bom, (newBom) => {
  if (newBom) {
    form.value = { ...newBom }
  } else {
    form.value = defaultBom()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = defaultBom()
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const handleSubmit = () => {
  // 表单验证
  if (!form.value.number || !form.value.version) {
    console.error('编号和版本不能为空')
    return
  }
  
  // 准备提交的数据
  const submitData = { ...form.value }
  
  // 如果是创建，不传入 id 和 isDeleted
  if (!props.bom?.id) {
    const { id, isDeleted, ...createData } = submitData
    emit('save', createData as CreateBomData)
  } else {
    // 如果是编辑，不传入 isDeleted
    const { isDeleted, ...updateData } = submitData
    emit('save', updateData as UpdateBomData)
  }
  
  setIsOpen(false)
}
</script> 