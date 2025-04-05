<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ (system && system.id > 0) ? '编辑产品系统' : '新建产品系统' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ (system && system.id > 0) ? '修改产品系统信息' : '创建新的产品系统' }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
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
          <shadcn-label for="isDeleted" class="text-right">已删除</shadcn-label>
          <shadcn-checkbox id="isDeleted" v-model="form.isDeleted" class="col-span-3" />
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
import { ZdPSystem } from '~/models/entity/psystem'

const props = defineProps<{
  open: boolean
  system?: ZdPSystem | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', system: ZdPSystem): void
}>()

const form = ref<ZdPSystem>(new ZdPSystem())
const parentSystems = ref<ZdPSystem[]>([])
const entityApis = useEntityApis()

// 加载可选的父系统列表
onMounted(async () => {
  try {
    const response = await entityApis.psystem.getAll(true)
    parentSystems.value = response || []
  } catch (error) {
    console.error('获取产品系统列表失败:', error)
    parentSystems.value = []
  }
})

// 监听系统变化，初始化表单
watch(() => props.system, (newSystem) => {
  if (newSystem) {
    form.value = { ...newSystem }
  } else {
    form.value = new ZdPSystem()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = new ZdPSystem()
  }
})

// 设置对话框开关状态
const setIsOpen = (value: boolean) => {
  emit('update:open', value)
}

// 处理表单提交
const handleSubmit = () => {
  // 表单验证
  if (!form.value.name) {
    console.error('系统名称不能为空')
    return
  }
  
  emit('save', form.value)
  setIsOpen(false)
}
</script> 