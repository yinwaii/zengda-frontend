<template>
  <shadcn-dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ isEditing ? '编辑物料项' : title }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ isEditing ? '编辑BOM物料项信息' : description }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <template v-if="isEditing">
        <!-- 编辑表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
          <div class="space-y-2">
            <shadcn-label for="itemId">物料ID</shadcn-label>
            <shadcn-input id="itemId" v-model="form.itemId" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="itemName">物料名称</shadcn-label>
            <shadcn-input id="itemName" v-model="form.itemName" />
          </div>
          <div class="space-y-2">
            <shadcn-label for="note">备注</shadcn-label>
            <shadcn-textarea id="note" v-model="form.note" />
          </div>
          
          <shadcn-dialog-footer>
            <shadcn-button type="button" variant="outline" @click="$emit('update:isOpen', false)">
              取消
            </shadcn-button>
            <shadcn-button type="submit">保存</shadcn-button>
          </shadcn-dialog-footer>
        </form>
      </template>
      
      <template v-else>
        <!-- 内容显示区域 -->
        <div class="py-4">
          <slot></slot>
        </div>
        
        <shadcn-dialog-footer>
          <shadcn-button @click="$emit('update:isOpen', false)">关闭</shadcn-button>
        </shadcn-dialog-footer>
      </template>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ZdBomChild } from '~/models/entity/bom'

const props = defineProps<{
  isOpen: boolean
  isEditing?: boolean
  item?: ZdBomChild
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [item: ZdBomChild]
}>()

const form = ref<ZdBomChild>({
  bomId: props.item?.bomId || 0,
  itemId: props.item?.itemId || 0,
  itemName: props.item?.itemName || '',
  note: props.item?.note || ''
})

watch(() => props.item, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', form.value)
  emit('update:isOpen', false)
}
</script> 