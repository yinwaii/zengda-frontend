<template>
  <shadcn-dialog :open="open" @update:open="setIsOpen">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ project?.id ? '编辑项目' : '新建项目' }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ project?.id ? '修改项目信息' : '创建新的项目' }}
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
          <shadcn-label for="productTypeId" class="text-right">产品类型</shadcn-label>
          <shadcn-select v-model="form.productTypeId" class="col-span-3">
            <shadcn-select-trigger>
              <shadcn-select-value :placeholder="productTypes.length ? '选择产品类型' : '暂无产品类型'" />
            </shadcn-select-trigger>
            <shadcn-select-content>
              <shadcn-select-group>
                <shadcn-select-item v-for="type in productTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </shadcn-select-item>
              </shadcn-select-group>
            </shadcn-select-content>
          </shadcn-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="templateId" class="text-right">项目模板</shadcn-label>
          <shadcn-select v-model="form.templateId" class="col-span-3">
            <shadcn-select-trigger>
              <shadcn-select-value :placeholder="templates.length ? '选择项目模板' : '暂无项目模板'" />
            </shadcn-select-trigger>
            <shadcn-select-content>
              <shadcn-select-group>
                <shadcn-select-item v-for="template in templates" :key="template.id" :value="template.id">
                  {{ template.name }}
                </shadcn-select-item>
              </shadcn-select-group>
            </shadcn-select-content>
          </shadcn-select>
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit" @click="handleSubmit">保存</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ZdProject } from '~/models/entity/project'
import type { ZdTemplate } from '~/models/entity/template'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  open: boolean
  project?: ZdProject | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', project: ZdProject): void
}>()

const form = ref<ZdProject>(new ZdProject())
const templates = ref<ZdTemplate[]>([])
const productTypes = ref<any[]>([])
const entityApis = useEntityApis()

// 加载下拉框数据
onMounted(async () => {
  try {
    // 获取模板列表
    const templateResponse = await entityApis.template.getByPage(0, 1000)
    templates.value = templateResponse.content || []
    
    // 尝试获取产品类型
    try {
      const typeResponse = await entityApis.ptype.getAll()
      productTypes.value = typeResponse || []
    } catch (error) {
      console.warn('无法获取产品类型列表:', error)
      productTypes.value = []
    }
    
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})

// 监听项目变化，初始化表单
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = { ...newProject }
  } else {
    form.value = new ZdProject()
  }
}, { immediate: true })

// 监听对话框开关状态
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    form.value = new ZdProject()
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
    // 可以使用toast组件显示错误
    console.error('项目名称不能为空')
    return
  }
  
  emit('save', form.value)
  setIsOpen(false)
}
</script> 