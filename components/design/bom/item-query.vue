<template>
  <shadcn-dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <shadcn-dialog-content class="sm:max-w-[700px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>物料详情</shadcn-dialog-title>
        <shadcn-dialog-description>
          查看物料ID为 {{ itemId }} 的详细信息
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <div class="py-4">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <LucideLoader class="h-8 w-8 animate-spin text-primary" />
          <span class="ml-2">加载中...</span>
        </div>
        
        <div v-else-if="error" class="py-4 text-center text-destructive">
          <p>{{ error }}</p>
        </div>
        
        <div v-else-if="item">
          <!-- 物料基本信息 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">物料ID</dt>
              <dd class="mt-1">{{ item.itemId }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">名称</dt>
              <dd class="mt-1">{{ item.name }}</dd>
            </div>
            <div v-if="item.model" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">型号</dt>
              <dd class="mt-1">{{ item.model }}</dd>
            </div>
            <div v-if="item.number" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">编号</dt>
              <dd class="mt-1">{{ item.number }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">订单价格</dt>
              <dd class="mt-1">{{ item.orderPrice }}</dd>
            </div>
            <div v-if="item.note" class="col-span-2 space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">备注</dt>
              <dd class="mt-1">{{ item.note }}</dd>
            </div>
          </div>
        </div>
        
        <div v-else class="py-4 text-center text-muted-foreground">
          <p>未找到相关物料信息</p>
        </div>
      </div>
      
      <shadcn-dialog-footer>
        <shadcn-button @click="$emit('update:isOpen', false)">关闭</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader as LucideLoader } from 'lucide-vue-next'
import type { ZdItem } from '~/models/entity/item'

const props = defineProps<{
  isOpen: boolean
  itemId: number
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const item = ref<ZdItem | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchItemData = async () => {
  if (!props.itemId) return
  
  loading.value = true
  error.value = null
  
  try {
    const entityApis = useEntityApis()
    const response = await entityApis.item.get(props.itemId.toString())
    item.value = response
  } catch (err) {
    console.error('获取物料信息失败:', err)
    error.value = '获取物料信息失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.itemId) {
    fetchItemData()
  }
}, { immediate: true })

watch(() => props.itemId, (newVal) => {
  if (props.isOpen && newVal) {
    fetchItemData()
  }
})
</script> 