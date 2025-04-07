<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">配置信息</h2>
            <p class="text-sm text-muted-foreground mt-1">项目: {{ configuration.project_id }}, 模板: {{ configuration.template_id }}</p>
          </div>
          <div class="flex items-center gap-2">
            <shadcn-button @click="$emit('edit')">
              <LucidePencil class="mr-2 h-4 w-4" />
              编辑
            </shadcn-button>
          </div>
        </div>
      </shadcn-card-header>
      <shadcn-card-content>
        <template v-if="isEditing">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <shadcn-label for="isShow">是否显示</shadcn-label>
              <shadcn-checkbox id="isShow" v-model:checked="editForm.isShow" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="valueConfig">值配置</shadcn-label>
              <shadcn-textarea id="valueConfig" v-model="editForm.valueConfig" rows="5" />
            </div>
            <div class="space-y-2">
              <shadcn-label for="componentConfig">组件配置</shadcn-label>
              <shadcn-textarea id="componentConfig" v-model="editForm.componentConfig" rows="5" />
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
              <dd class="mt-1">{{ configuration.id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">项目ID</dt>
              <dd class="mt-1">{{ configuration.project_id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">模板ID</dt>
              <dd class="mt-1">{{ configuration.template_id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
              <dd class="mt-1">
                <shadcn-badge :variant="configuration.isShow ? 'default' : 'outline'">
                  {{ configuration.isShow ? '是' : '否' }}
                </shadcn-badge>
              </dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg col-span-2">
              <dt class="text-sm font-medium text-muted-foreground">最后版本ID</dt>
              <dd class="mt-1">{{ configuration.lastVersionId }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg col-span-2">
              <dt class="text-sm font-medium text-muted-foreground">值配置</dt>
              <dd class="mt-1 whitespace-pre-wrap break-all text-xs">{{ configuration.valueConfig || '无配置' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg col-span-2">
              <dt class="text-sm font-medium text-muted-foreground">组件配置</dt>
              <dd class="mt-1 whitespace-pre-wrap break-all text-xs">{{ configuration.componentConfig || '无配置' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
              <dd class="mt-1">{{ formatDate(configuration.createdTime) || '暂无' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
              <dd class="mt-1">{{ formatDate(configuration.updatedTime) || '暂无' }}</dd>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdConfiguration } from '~/models/entity/configuration'

const props = defineProps<{
  configuration: ZdConfiguration
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'cancel'): void
  (e: 'save', data: ZdConfiguration): void
}>()

// 编辑表单
const editForm = ref<Partial<ZdConfiguration>>({
  isShow: props.configuration.isShow,
  valueConfig: props.configuration.valueConfig,
  componentConfig: props.configuration.componentConfig
})

// 监听配置变化
watch(() => props.configuration, (newConfig) => {
  editForm.value = {
    isShow: newConfig.isShow,
    valueConfig: newConfig.valueConfig,
    componentConfig: newConfig.componentConfig
  }
}, { immediate: true })

// 提交表单
const handleSubmit = () => {
  const updatedConfig: ZdConfiguration = {
    ...props.configuration,
    isShow: editForm.value.isShow !== undefined ? editForm.value.isShow : props.configuration.isShow,
    valueConfig: editForm.value.valueConfig || props.configuration.valueConfig,
    componentConfig: editForm.value.componentConfig || props.configuration.componentConfig
  }
  
  emit('save', updatedConfig)
}
</script> 