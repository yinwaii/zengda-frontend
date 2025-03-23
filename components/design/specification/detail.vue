<template>
  <div class="space-y-6">
    <shadcn-card>
      <shadcn-card-header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ specification.name }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ specification.description || '暂无描述' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <shadcn-button v-if="specification.url" variant="outline" as-child>
              <a :href="specification.url" target="_blank">
                <LucideExternalLink class="mr-2 h-4 w-4" />
                查看规格
              </a>
            </shadcn-button>
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
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <shadcn-label for="name">名称</shadcn-label>
                <shadcn-input id="name" v-model="editForm.name" />
              </div>
              <div class="space-y-2">
                <shadcn-label for="fileTag">文件标签</shadcn-label>
                <shadcn-input id="fileTag" v-model="editForm.fileTag" />
              </div>
            </div>
            <div class="space-y-2">
              <shadcn-label for="url">URL</shadcn-label>
              <shadcn-input id="url" v-model="editFormUrl" />
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
              <dd class="mt-1">{{ specification.id }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">文件标签</dt>
              <dd class="mt-1">{{ specification.fileTag || '暂无标签' }}</dd>
            </div>
            <div class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">最新版本ID</dt>
              <dd class="mt-1">{{ specification.latestVersionId }}</dd>
            </div>
            <div class="col-span-2 space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">URL</dt>
              <dd class="mt-1">
                <a v-if="specification.url" :href="specification.url" target="_blank" class="text-blue-500 hover:underline">
                  {{ specification.url }}
                </a>
                <span v-else>暂无URL</span>
              </dd>
            </div>
            <div v-if="specification.hash" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">哈希值</dt>
              <dd class="mt-1">{{ specification.hash }}</dd>
            </div>
            <div v-if="specification.attributes" class="space-y-2 p-4 border rounded-lg">
              <dt class="text-sm font-medium text-muted-foreground">属性</dt>
              <dd class="mt-1">{{ specification.attributes }}</dd>
            </div>
          </div>
        </template>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">版本信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div v-if="specification.versionLink && specification.versionLink.length > 0">
          <div class="flex flex-col gap-2">
            <div v-for="version in specification.versionLink" :key="version.id" class="p-3 border rounded-lg">
              <div class="flex justify-between">
                <div>版本ID: {{ version.id }}</div>
                <div>{{ formatDate(version.createdTime) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-muted-foreground py-4">
          暂无版本信息
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">数据信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="Object.keys(specification.texts || {}).length > 0" class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">文本数据</dt>
            <dd class="mt-1">
              <div v-for="(value, key) in specification.texts" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </dd>
          </div>
          <div v-if="Object.keys(specification.bools || {}).length > 0" class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">布尔数据</dt>
            <dd class="mt-1">
              <div v-for="(value, key) in specification.bools" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span>{{ value ? '是' : '否' }}</span>
              </div>
            </dd>
          </div>
          <div v-if="Object.keys(specification.imgs || {}).length > 0" class="col-span-1 md:col-span-2 space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">图片数据</dt>
            <dd class="mt-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(value, key) in specification.imgs" :key="key" class="space-y-1">
                <div class="text-sm">{{ key }}</div>
                <img :src="value" :alt="key" class="w-full h-auto rounded-md border" />
              </div>
            </dd>
          </div>
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <shadcn-card>
      <shadcn-card-header>
        <shadcn-card-title class="text-xl font-semibold">系统信息</shadcn-card-title>
      </shadcn-card-header>
      <shadcn-card-content>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">创建人</dt>
            <dd class="mt-1">{{ specification.createdBy || '暂无创建人' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
            <dd class="mt-1">{{ formatDate(specification.createdTime) || '暂无创建时间' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">修改人</dt>
            <dd class="mt-1">{{ specification.updatedBy || '暂无修改人' }}</dd>
          </div>
          <div class="space-y-2 p-4 border rounded-lg">
            <dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
            <dd class="mt-1">{{ formatDate(specification.updatedTime) || '暂无修改时间' }}</dd>
          </div>
        </div>
      </shadcn-card-content>
    </shadcn-card>

    <shadcn-separator />

    <design-parameter-preview v-if="parameters && parameters.length > 0" :parameters="parameters" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucidePencil, LucideExternalLink } from 'lucide-vue-next'
import type { ZdSpecification } from '~/models/entity/specification'
import type { ZdParameter } from '~/models/entity/parameter'
import { formatDate } from '~/utils/date'

const props = defineProps<{
  specification: ZdSpecification
  isEditing: boolean
  parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
  edit: []
  cancel: []
  submit: [form: Partial<ZdSpecification>]
}>()

const editForm = ref<Partial<ZdSpecification>>({
  name: props.specification.name,
  fileTag: props.specification.fileTag,
  url: props.specification.url
})

const editFormUrl = computed({
  get: () => editForm.value.url || '',
  set: (value) => {
    editForm.value.url = value
  }
})

const handleSubmit = () => {
  emit('submit', editForm.value)
}
</script> 