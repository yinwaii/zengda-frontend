<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ ptype.name }}</h2>
            <p v-if="ptype.code" class="text-sm text-muted-foreground mt-1">代码: {{ ptype.code }}</p>
          </div>
          <div class="flex items-center gap-2">
            <shadcn-button @click="$emit('edit')">
              <LucideSettings class="mr-2 h-4 w-4" />
              编辑
            </shadcn-button>
          </div>
        </div>
      </shadcn-card-header>
      <shadcn-card-content>
        <template v-if="isEditing">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <shadcn-label for="name">名称</shadcn-label>
              <shadcn-input id="name" v-model="editForm.name" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="code">代码</shadcn-label>
              <shadcn-input id="code" v-model="editForm.code" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="model">型号</shadcn-label>
              <shadcn-input id="model" v-model="editForm.model" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="description">描述</shadcn-label>
              <shadcn-textarea id="description" v-model="editForm.description" />
            </div>
            <div class="flex items-center space-x-2 mb-4">
              <shadcn-checkbox id="isShow" v-model:checked="editForm.isShow" />
              <shadcn-label for="isShow" class="text-sm">显示</shadcn-label>
            </div>
            <div class="flex justify-end gap-2">
              <shadcn-button type="button" variant="outline" @click="$emit('cancel')">
                取消
              </shadcn-button>
              <shadcn-button type="submit">
                保存
              </shadcn-button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">ID</dt>
              <dd class="mt-1">{{ ptype.id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">型号</dt>
              <dd class="mt-1">{{ ptype.model || '暂无' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
              <dd class="mt-1">{{ ptype.isShow ? '是' : '否' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg" v-if="ptype.description">
              <dt class="text-sm font-medium text-muted-foreground">描述</dt>
              <dd class="mt-1 break-all text-sm">{{ ptype.description }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
              <dd class="mt-1">{{ formatDate(ptype.createdTime) || '暂无' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
              <dd class="mt-1">{{ formatDate(ptype.updatedTime) || '暂无' }}</dd>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <!-- 关联的模板 -->
    <shadcn-card v-if="relatedTemplates && relatedTemplates.length > 0">
      <shadcn-card-header>
        <shadcn-card-title>关联模板</shadcn-card-title>
        <shadcn-card-description>该产品类型相关的模板</shadcn-card-description>
      </shadcn-card-header>
      <shadcn-card-content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="template in relatedTemplates" 
            :key="template.id" 
            class="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
          >
            <h4 class="font-medium">{{ template.name }}</h4>
            <p v-if="template.description" class="text-sm text-muted-foreground mt-1">
              {{ template.description }}
            </p>
          </div>
        </div>
      </shadcn-card-content>
    </shadcn-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { LucideSettings } from 'lucide-vue-next'
import { toApiId } from '~/utils/idConverter'
import type { ZdPType } from '~/models/entity/ptype'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
  ptype: ZdPType
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'cancel'): void
  (e: 'save', data: ZdPType): void
}>()

// 编辑表单
const editForm = ref<ZdPType>({
  id: 0,
  name: '',
  code: '',
  model: '',
  description: '',
  isShow: true,
  createdTime: '',
  updatedTime: '',
  createdBy: '',
  updatedBy: ''
})

// 关联的模板
const relatedTemplates = ref<ZdTemplate[]>([])
const { template: templateApi } = useEntityApis()

// 初始化表单数据
watch(() => props.ptype, (newVal) => {
  if (newVal) {
    editForm.value = { ...newVal }
  }
}, { immediate: true })

// 加载关联的模板
const loadRelatedTemplates = async () => {
  try {
    if (!props.ptype?.id) return
    
    const response = await templateApi.getByPage(0, 100)
    const templates = response.content
    
    // 筛选出productTypeId匹配当前产品类型的模板
    relatedTemplates.value = templates.filter((template: any) => 
      template.productTypeId === toApiId(props.ptype.id)
    )
  } catch (error) {
    console.error('加载关联模板失败:', error)
  }
}

// 提交表单
const handleSubmit = () => {
  // 确保所需字段有值
  if (!editForm.value.name || !editForm.value.code || !editForm.value.model) {
    const { error } = useMessage()
    error('请填写必填字段')
    return
  }
  
  emit('save', { ...editForm.value })
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载数据
onMounted(() => {
  loadRelatedTemplates()
})
</script> 