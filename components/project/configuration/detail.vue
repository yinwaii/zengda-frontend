<template>
  <div class="space-y-4">
    <div class="border rounded-md p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-medium">配置详情</h3>
        <div class="flex items-center gap-2">
          <shadcn-button variant="outline" size="sm" @click="$emit('edit')" v-if="!isEditing">
            <lucide-pencil class="h-4 w-4 mr-2" />
            编辑
          </shadcn-button>
          <shadcn-button variant="outline" size="sm" @click="loadConfiguration" v-if="!isEditing">
            <lucide-download class="h-4 w-4 mr-2" />
            加载配置
          </shadcn-button>
          <shadcn-button variant="outline" size="sm" @click="openViewDialog">
            <lucide-eye class="h-4 w-4 mr-2" />
            查看配置
          </shadcn-button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">名称:</span>
            <span>{{ configuration.name }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">描述:</span>
            <span>{{ configuration.description || '无' }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">项目ID:</span>
            <span>{{ configuration.project_id }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">模板ID:</span>
            <span>{{ configuration.template_id }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">是否显示:</span>
            <span>{{ configuration.isShow ? '是' : '否' }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">最后版本:</span>
            <span>{{ configuration.lastVersionId }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">创建时间:</span>
            <span>{{ configuration.createdTime || '未知' }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-muted-foreground w-24">更新时间:</span>
            <span>{{ configuration.updatedTime || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 配置详情对话框 -->
  <shadcn-dialog :open="isViewDialogOpen" @update:open="isViewDialogOpen = $event">
    <shadcn-dialog-content class="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>配置详情</shadcn-dialog-title>
        <shadcn-dialog-description>
          查看配置的详细内容
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <div class="grid grid-cols-1 gap-6 py-4 overflow-y-auto max-h-[60vh]">
        <!-- 标签栏 -->
        <shadcn-tabs defaultValue="parameterConfig" class="w-full">
          <shadcn-tabs-list class="grid w-full grid-cols-2">
            <shadcn-tabs-trigger value="parameterConfig">参数配置</shadcn-tabs-trigger>
            <shadcn-tabs-trigger value="componentConfig">组件配置</shadcn-tabs-trigger>
          </shadcn-tabs-list>
          
          <!-- 参数配置面板 -->
          <shadcn-tabs-content value="parameterConfig" class="p-4 border rounded-md mt-2">
            <div v-if="!parsedValueConfig" class="text-center py-4">
              无参数配置数据
            </div>
            <div v-else>
              <shadcn-accordion type="single" collapsible>
                <!-- 项目参数 -->
                <shadcn-accordion-item value="projectParams" v-if="parsedValueConfig.project && Object.keys(parsedValueConfig.project).length > 0">
                  <shadcn-accordion-trigger>项目参数</shadcn-accordion-trigger>
                  <shadcn-accordion-content>
                    <pre class="p-4 rounded-md bg-muted text-sm overflow-auto">{{ JSON.stringify(parsedValueConfig.project, null, 2) }}</pre>
                  </shadcn-accordion-content>
                </shadcn-accordion-item>
                
                <!-- 模板参数 -->
                <shadcn-accordion-item value="templateParams" v-if="parsedValueConfig.template && Object.keys(parsedValueConfig.template).length > 0">
                  <shadcn-accordion-trigger>模板参数</shadcn-accordion-trigger>
                  <shadcn-accordion-content>
                    <pre class="p-4 rounded-md bg-muted text-sm overflow-auto">{{ JSON.stringify(parsedValueConfig.template, null, 2) }}</pre>
                  </shadcn-accordion-content>
                </shadcn-accordion-item>
                
                <!-- 系统参数 -->
                <shadcn-accordion-item value="systemParams" v-if="parsedValueConfig.systems && Object.keys(parsedValueConfig.systems).length > 0">
                  <shadcn-accordion-trigger>系统参数</shadcn-accordion-trigger>
                  <shadcn-accordion-content>
                    <pre class="p-4 rounded-md bg-muted text-sm overflow-auto">{{ JSON.stringify(parsedValueConfig.systems, null, 2) }}</pre>
                  </shadcn-accordion-content>
                </shadcn-accordion-item>
              </shadcn-accordion>
            </div>
          </shadcn-tabs-content>
          
          <!-- 组件配置面板 -->
          <shadcn-tabs-content value="componentConfig" class="p-4 border rounded-md mt-2">
            <div v-if="!parsedComponentConfig" class="text-center py-4">
              无组件配置数据
            </div>
            <div v-else>
              <div class="space-y-4">
                <div v-for="(config, id) in parsedComponentConfig" :key="id" class="border p-4 rounded-md">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium">组件ID: {{ id }}</h3>
                    <div class="flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-muted-foreground">状态:</span>
                        <span :class="config.enabled ? 'text-green-500' : 'text-red-500'">
                          {{ config.enabled ? '启用' : '禁用' }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-muted-foreground">数量:</span>
                        <span>{{ config.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </shadcn-tabs-content>
        </shadcn-tabs>
      </div>
      
      <shadcn-dialog-footer>
        <shadcn-button @click="isViewDialogOpen = false">关闭</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ZdConfiguration } from '~/models/entity/configuration'
import { Pencil, Download, Eye } from 'lucide-vue-next'

const props = defineProps<{
  configuration: ZdConfiguration
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'load'): void
}>()

const isViewDialogOpen = ref(false)

const parsedValueConfig = computed(() => {
  try {
    return JSON.parse(props.configuration.valueConfig)
  } catch (error) {
    console.error('解析valueConfig失败:', error)
    return null
  }
})

const parsedComponentConfig = computed(() => {
  try {
    return JSON.parse(props.configuration.componentConfig)
  } catch (error) {
    console.error('解析componentConfig失败:', error)
    return null
  }
})

// 打开查看配置对话框
const openViewDialog = () => {
  isViewDialogOpen.value = true
}

// 加载配置
const loadConfiguration = () => {
  emit('load')
}
</script> 