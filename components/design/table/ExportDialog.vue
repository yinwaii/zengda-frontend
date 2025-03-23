<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ref } from 'vue'
import type { ExportOptions } from '@/utils/export'

const props = defineProps<{
  show: boolean
  columns: any[]
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'export', options: ExportOptions): void
}>()

const format = ref<'csv' | 'excel'>('excel')
const selectedColumns = ref<string[]>([])

// 初始化选中所有列
const initSelectedColumns = () => {
  selectedColumns.value = props.columns.map(col => col.key)
}

// 切换全选
const toggleAll = (checked: boolean) => {
  if (checked) {
    initSelectedColumns()
  } else {
    selectedColumns.value = []
  }
}

// 导出
const handleExport = () => {
  emit('export', {
    format: format.value,
    selectedColumns: selectedColumns.value
  })
}

// 关闭对话框
const handleClose = () => {
  emit('update:show', false)
  format.value = 'excel'
  initSelectedColumns()
}
</script>

<template>
  <Dialog :open="show" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>导出数据</DialogTitle>
        <DialogDescription>
          选择导出格式和要导出的列
        </DialogDescription>
      </DialogHeader>
      
      <div class="py-4">
        <div class="mb-4">
          <Label>导出格式</Label>
          <RadioGroup v-model="format" class="mt-2">
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label for="excel">Excel</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label for="csv">CSV</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <div class="flex items-center space-x-2 mb-2">
            <Checkbox 
              :checked="selectedColumns.length === columns.length"
              @update:checked="toggleAll"
            />
            <Label>选择列</Label>
          </div>
          <div class="space-y-2">
            <div v-for="col in columns" :key="col.key" class="flex items-center space-x-2">
              <Checkbox 
                :checked="selectedColumns.includes(col.key)"
                @update:checked="(checked: boolean) => {
                  if (checked) {
                    selectedColumns.push(col.key)
                  } else {
                    selectedColumns = selectedColumns.filter(k => k !== col.key)
                  }
                }"
              />
              <Label>{{ col.title }}</Label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">取消</Button>
        <Button @click="handleExport">导出</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template> 