<template>
  <div class="space-y-2">
    <shadcn-label :for="id">{{ label }}</shadcn-label>
    <shadcn-select :id="id" v-model="modelValue" :disabled="disabled">
      <shadcn-select-trigger>
        <shadcn-select-value :placeholder="productTypes.length ? placeholder : '暂无产品类型'" />
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ZdPType } from '~/models/entity/ptype'
import { useEntityApis } from '~/composables/use-entity-apis'

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  id: 'productTypeId',
  label: '产品类型',
  placeholder: '选择产品类型',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const modelValue = defineModel<number>('modelValue', { required: true })
const productTypes = ref<ZdPType[]>([])
const entityApis = useEntityApis()

// 加载产品类型列表
const loadProductTypes = async () => {
  try {
    const response = await entityApis.ptype.getAll()
    productTypes.value = response || []
  } catch (error) {
    console.error('加载产品类型列表失败:', error)
    productTypes.value = []
  }
}

onMounted(() => {
  loadProductTypes()
})
</script> 