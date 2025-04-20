<template>
  <shadcn-dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <shadcn-dialog-content class="sm:max-w-[425px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>添加组件</shadcn-dialog-title>
        <shadcn-dialog-description>
          请选择一个组件或创建新的
        </shadcn-dialog-description>
      </shadcn-dialog-header>

      <div class="space-y-4 py-4">
        <div class="flex items-center gap-2">
          <shadcn-select v-model="selectedComponentId" class="flex-1">
            <shadcn-select-trigger>
              <shadcn-select-value placeholder="选择组件" />
            </shadcn-select-trigger>
            <shadcn-select-content>
              <shadcn-select-item v-for="component in components" :key="component.id" :value="component.id">
                {{ component.name }}
              </shadcn-select-item>
            </shadcn-select-content>
          </shadcn-select>
          <shadcn-button variant="outline" @click="openCreateDialog">
            <LucidePlus class="h-4 w-4 mr-1" />
            新建
          </shadcn-button>
        </div>
      </div>

      <shadcn-dialog-footer>
        <shadcn-button variant="outline" @click="$emit('update:modelValue', false)">
          取消
        </shadcn-button>
        <shadcn-button @click="handleSubmit" :disabled="!selectedComponentId">
          确定
        </shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>

  <!-- 组件创建对话框 -->
  <component-dialog
    :open="showCreateDialog"
    :component="component"
    @submit="handleComponentCreated"
  />
</template>

<script setup lang="ts">
import { LucidePlus } from 'lucide-vue-next'
import { ref, onMounted, inject } from 'vue'
import ComponentDialog from '~/components/design/component/dialog.vue'
import { useToast } from '~/components/ui/toast'

const props = defineProps<{
  templateId: number
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [componentId: number]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()
const refresh = inject('refresh') as () => Promise<void>

// 状态
const components = ref<ZdComponent[]>([])
const selectedComponentId = ref<number | null>(null)
const showCreateDialog = ref(false)
const component = ref<ZdComponent>()

// 加载组件列表
const loadComponents = async () => {
  try {
    const response = await entityApis.component.getAll()
    if (response) {
      components.value = response
    }
  } catch (error) {
    console.error('加载组件列表失败:', error)
    toast({
      title: '错误',
      description: '加载组件列表失败',
      variant: 'destructive'
    })
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  showCreateDialog.value = true
}

// 处理组件创建完成
const handleComponentCreated = async (newComponent: ZdComponent) => {
  component.value = newComponent
  await entityApis.template.create(component.value)
  // 重新加载组件列表
  await loadComponents()
  // 自动选择新创建的组件
  selectedComponentId.value = newComponent.id
  showCreateDialog.value = false
}

// 处理提交
const handleSubmit = async () => {
  if (selectedComponentId.value) {
    await entityApis.template_component.create(toApiId(props.templateId), selectedComponentId.value)
    emit('update:modelValue', false)
    // 调用refresh函数刷新树状结构
    await refresh()
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadComponents()
})
</script> 