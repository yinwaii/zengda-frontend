<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <button v-if="hasBom" class="p-1 hover:bg-accent rounded-sm" @click="isExpanded = !isExpanded">
        <LucideChevronRight :class="['h-4 w-4 transition-transform', { 'rotate-90': isExpanded }]" />
      </button>
      <div v-else class="w-6"></div>
      <div 
        class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
        @click="handleComponentSelect"
      >
        <LucidePuzzle class="h-4 w-4" />
        <span class="flex-1 truncate">{{ getComponentName() }}</span>
      </div>
    </div>
    
    <div v-if="hasBom && isExpanded" class="ml-6 space-y-1">
      <div class="flex items-center gap-1">
        <div class="w-6"></div>
        <div 
          class="flex items-center gap-1 flex-1 p-1 hover:bg-accent rounded-sm cursor-pointer"
          @click="handleBomSelect"
        >
          <LucideClipboardList class="h-4 w-4" />
          <span class="flex-1 truncate">物料清单(BOM)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucideChevronRight, LucidePuzzle, LucideClipboardList } from 'lucide-vue-next'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import type { ZdComponent } from '~/models/entity/component'

type ComponentWithBom = {
  id?: number
  componentId?: number
  name?: string
  description?: string
  bomId?: number
}

const props = defineProps<{
  component: ComponentWithBom
}>()

const emit = defineEmits<{
  select: [componentId: number]
  'bom-select': [bomId: number]
}>()

const isExpanded = ref(false)
const bomId = computed(() => props.component.bomId)
const hasBom = computed(() => !!bomId.value)

const getComponentName = () => {
  if (props.component.description) return props.component.description
  if (props.component.name) return props.component.name
  
  const id = props.component.componentId || props.component.id
  return `组件 ${id}`
}

const handleComponentSelect = () => {
  const id = props.component.componentId || props.component.id
  if (id) {
    emit('select', id)
  }
}

const handleBomSelect = () => {
  if (bomId.value) {
    emit('bom-select', bomId.value)
  }
}
</script> 