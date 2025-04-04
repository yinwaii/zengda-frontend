<template>
  <div class="project-configuration-detail">
    <div v-if="!configuration" class="py-4 text-center text-gray-500">
      <p>暂无配置数据</p>
    </div>
    
    <div v-else>
      <div class="mb-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ configuration.name }}</h3>
          <design-project-configuration-actions
            :configuration="configuration"
            @edit="$emit('edit', configuration)"
            @delete="$emit('delete', configuration)"
          />
        </div>
        
        <p class="text-sm text-gray-500 mt-1">{{ configuration.description }}</p>
      </div>
      
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 p-3 rounded-md">
          <dt class="text-sm text-gray-500">创建时间</dt>
          <dd>{{ formatDate(configuration.createdTime) }}</dd>
        </div>
        <div class="bg-gray-50 p-3 rounded-md">
          <dt class="text-sm text-gray-500">最后更新</dt>
          <dd>{{ formatDate(configuration.updatedTime) }}</dd>
        </div>
      </dl>
      
      <div class="mt-4">
        <shadcn-button size="sm" variant="outline" @click="$emit('load')">
          加载配置
        </shadcn-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucideLoader } from 'lucide-vue-next'
import type { ZdConfiguration } from '~/models/entity/configuration'

const props = defineProps<{
  configuration: ZdConfiguration
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', configuration: ZdConfiguration): void
  (e: 'delete', configuration: ZdConfiguration): void
  (e: 'load'): void
}>()

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString()
}
</script> 