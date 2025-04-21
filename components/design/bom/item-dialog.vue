<template>
  <shadcn-dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <shadcn-dialog-content class="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>{{ isEditing ? '编辑物料项' : title }}</shadcn-dialog-title>
        <shadcn-dialog-description>
          {{ isEditing ? '编辑BOM物料项信息' : description }}
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      
      <div class="flex-1 overflow-hidden py-4">
        <template v-if="isEditing">
          <!-- 搜索框和按钮 -->
          <div class="flex items-center justify-between mb-4 space-x-2">
            <shadcn-input 
              v-model="searchValue" 
              placeholder="搜索物料" 
              class="flex-1"
              @keyup.enter="handleSearch"
            />
            <shadcn-button @click="handleSearch">搜索</shadcn-button>
          </div>

          <!-- 空状态提示 -->
          <div v-if="searchValue && !searchResult.length" class="text-center py-4 text-gray-500">
            未找到相关物料
          </div>

          <!-- 搜索物料结果展示 分页table -->
          <div v-if="searchResult.length > 0" class="relative h-[400px] overflow-auto border rounded-md">
            <shadcn-table class="w-full">
              <shadcn-table-header class="sticky top-0 bg-white z-10 border-b">
                <shadcn-table-row>
                  <shadcn-table-head class="w-[100px]">物料ID</shadcn-table-head>
                  <shadcn-table-head class="w-[200px]">物料名称</shadcn-table-head>
                  <shadcn-table-head class="w-[150px]">model</shadcn-table-head>
                  <shadcn-table-head class="w-[100px]">操作</shadcn-table-head>
                </shadcn-table-row>
              </shadcn-table-header>
              <shadcn-table-body>
                <shadcn-table-row v-for="item in searchResult" :key="item.itemId" class="hover:bg-gray-50">
                  <shadcn-table-cell class="w-[100px]">{{ item.itemId }}</shadcn-table-cell>
                  <shadcn-table-cell class="w-[200px]">{{ item.name }}</shadcn-table-cell>
                  <shadcn-table-cell class="w-[150px]">{{ item.model }}</shadcn-table-cell>
                  <shadcn-table-cell class="w-[100px]">
                    <shadcn-button variant="outline" size="sm" @click="handleSelect(item)">选择</shadcn-button>
                    <shadcn-button variant="outline" size="sm" @click="checkDetails(item)">查看</shadcn-button>
                  </shadcn-table-cell>
                </shadcn-table-row>
              </shadcn-table-body>
            </shadcn-table>
          </div>


          <!-- 编辑表单 -->
          <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
            
            <div class="flex gap-4">
              <div class="space-y-2 flex-1">
                <shadcn-label for="itemId">物料ID</shadcn-label>
                <shadcn-input id="itemId" v-model="form.itemId" />
              </div>
              <div class="space-y-2 flex-1">
                <shadcn-label for="itemName">物料名称</shadcn-label>
                <shadcn-input id="itemName" v-model="form.itemName" />
              </div>
              <div class="space-y-2 flex-1">
                <shadcn-label for="itemNumber">物料用量</shadcn-label>
                <shadcn-input id="itemNumber" v-model="form.itemNumber" />
              </div>
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
      </div>
    </shadcn-dialog-content>
  </shadcn-dialog>

  <!-- 物料详情弹窗 -->
  <shadcn-dialog :open="isDetailsOpen" @update:open="isDetailsOpen = $event">
    <shadcn-dialog-content class="sm:max-w-[500px]">
      <shadcn-dialog-header>
        <shadcn-dialog-title>物料详情</shadcn-dialog-title>
      </shadcn-dialog-header>
      
      <div class="py-4">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">物料ID</div>
              <div>{{ selectedItem?.itemId }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">物料名称</div>
              <div>{{ selectedItem?.name }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">型号</div>
              <div>{{ selectedItem?.model }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">编号</div>
              <div>{{ selectedItem?.number }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">订单价格</div>
              <div>¥{{ selectedItem?.orderPrice?.toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">ERP物料ID</div>
              <div>{{ selectedItem?.erpclsId }}</div>
            </div>
          </div>
          
          <div>
            <div class="text-sm text-gray-500">备注</div>
            <div>{{ selectedItem?.note }}</div>
          </div>
        </div>
      </div>

      <shadcn-dialog-footer>
        <shadcn-button @click="isDetailsOpen = false">关闭</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdBomChild } from '~/models/entity/bom'
import type { ZdItem } from '~/models/entity/item'
import { useEntityApis } from '~/composables/use-entity-apis'

/**
export interface ZdItem {
	itemId?: number
	name: string
	model?: string
	number?: string
	note?: string
	orderPrice: number
	erpcIsId: number
}
*/
// 模拟searchResult
const searchResult = ref<ZdItem[]>([])

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
  itemNumber: props.item?.itemNumber || 1,
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

const handleSelect = (item: ZdItem) => {
  if(item.itemId) {
    form.value.itemId = item.itemId
    form.value.itemName = item.name
    form.value.note = item.model
  }
}

const searchValue = ref('')
const handleSearch = async () => {
  // 调用api搜索物料
  // 搜索结果赋值给searchResult
  if(!searchValue.value) {
    return
  }
  console.log(searchValue.value)
   await useEntityApis().item.search(searchValue.value, {
    "page": {
      "current": "1",
      "size": "5"
    }
  }).then((res: ZdItem[]) => {
    searchResult.value = res
  })
}

// 监听dialog打开，清空搜索记录
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchValue.value = ''
    searchResult.value = []
  }
})

// 物料详情弹窗状态
const isDetailsOpen = ref(false)
const selectedItem = ref<ZdItem | null>(null)

// 查看物料详情
const checkDetails = (item: ZdItem) => {
  selectedItem.value = item
  isDetailsOpen.value = true
}
</script> 