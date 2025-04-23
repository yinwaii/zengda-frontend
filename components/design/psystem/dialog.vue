<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px] max-h-[80vh]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ (system && system.id > 0) ? '编辑模块' : '新建模块' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ (system && system.id > 0) ? '修改模块信息' : '创建新的模块' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="overflow-y-auto max-h-[calc(80vh-8rem)]">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="name" class="text-right">名称</shadcn-label>
            <shadcn-input id="name" v-model="form.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="description" class="text-right">描述</shadcn-label>
            <shadcn-textarea id="description" v-model="form.description" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="parentId" class="text-right">父系统</shadcn-label>
            <shadcn-select v-model="form.parentId" class="col-span-3">
              <shadcn-select-trigger>
                <shadcn-select-value :placeholder="parentSystems.length ? '选择父系统' : '无父系统'" />
              </shadcn-select-trigger>
              <shadcn-select-content>
                <shadcn-select-group>
                  <shadcn-select-item :value="-1">无父系统</shadcn-select-item>
                  <shadcn-select-item 
                    v-for="parent in parentSystems" 
                    :key="parent.id" 
                    :value="parent.id"
                    :disabled="parent.id === form.id"
                  >
                    {{ parent.name }}
                  </shadcn-select-item>
                </shadcn-select-group>
              </shadcn-select-content>
            </shadcn-select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="docsUrl" class="text-right">文档链接</shadcn-label>
            <shadcn-input id="docsUrl" :value="form.docsUrl || ''" @update:model-value="form.docsUrl = typeof $event === 'number' ? String($event) : $event" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <shadcn-label for="isShow" class="text-right">是否可见</shadcn-label>
            <shadcn-checkbox id="isShow" v-model="form.isShow" class="col-span-3" />
          </div>
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { ZdPSystem } from '~/models/entity/psystem'

// 定义创建和更新时的数据类型
type CreatePSystemData = Omit<ZdPSystem, 'id' | 'isDeleted'>
type UpdatePSystemData = Omit<ZdPSystem, 'isDeleted'>

const props = defineProps<{
  open: boolean
  isEdit?: boolean
  system?: ZdPSystem | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', system: CreatePSystemData | UpdatePSystemData): void
}>()

const form = ref<ZdPSystem>({
  id: -1,
  name: '',
  description: '',
  parentId: -1,
  docsUrl: null,
  specId: null,
  isShow: true,
  isDeleted: false,
  children: null,
  parameters: null
} as ZdPSystem)
const parentSystems = ref<ZdPSystem[]>([])
const entityApis = useEntityApis()

// 加载可选的父系统列表
onMounted(async () => {
  try {
    const response = await entityApis.psystem.getAll(true)
    parentSystems.value = response || []
  } catch (error) {
    console.error('获取模块列表失败:', error)
    parentSystems.value = []
  }
})

// 监听系统变化，初始化表单
watch(() => props.system, (newSystem) => {
  // console.log('newSystem:', newSystem)
  if (newSystem) {
    form.value = { ...newSystem }
  } else {
    form.value = {} as ZdPSystem
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  console.log('isOpen:', isOpen)
  if (!isOpen) {
    form.value = {} as ZdPSystem
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
    console.error('系统名称不能为空')
    return
  }
  
  // 准备提交的数据
  const submitData = { ...form.value }
  
  // 如果是创建，不传入 id 和 isDeleted
  console.log('提交模块:', props.system)
  if (!props.isEdit) {
    const { id, isDeleted, ...createData } = submitData
    emit('save', createData as CreatePSystemData)
  } else {
    // 如果是编辑，不传入 isDeleted
    const { isDeleted, ...updateData } = submitData
    emit('save', updateData as UpdatePSystemData)
  }
  
  setIsOpen(false)
}
</script> 