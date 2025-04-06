<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ref, watch } from 'vue'
import type { Menu } from '@/models/entity/system'

const props = defineProps<{
  menu: Menu
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', menu: Menu): void
}>()

const formData = ref<Menu>({...props.menu})

watch(() => props.open, (newVal) => {
  if (newVal) {
    formData.value = {...props.menu}
  }
})

const handleSave = () => {
  emit('save', formData.value)
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>编辑菜单</DialogTitle>
      </DialogHeader>
      <div class="grid grid-cols-2 gap-4 py-4">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="label">菜单名称</Label>
            <Input id="label" v-model="formData.label" />
          </div>
          <div class="grid gap-2">
            <Label for="name">链接地址</Label>
            <Input id="name" v-model="formData.name" />
          </div>
          <div class="grid gap-2">
            <Label for="url">组件路径</Label>
            <Input id="url" v-model="formData.url" />
          </div>
          <div class="grid gap-2">
            <Label for="icon">图标</Label>
            <Input id="icon" v-model="formData.icon" />
          </div>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="type">类型</Label>
            <Select v-model="formData.type">
              <SelectTrigger>
                <SelectValue :placeholder="formData.type === 0 ? '目录' : formData.type === 1 ? '菜单' : '按钮'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="0">目录</SelectItem>
                <SelectItem :value="1">菜单</SelectItem>
                <SelectItem :value="2">按钮</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="parentId">父菜单ID</Label>
            <Input id="parentId" v-model="formData.parentId" type="number" />
          </div>
          <div class="grid gap-2">
            <Label for="orderNum">排序</Label>
            <Input id="orderNum" v-model="formData.orderNum" type="number" />
          </div>
          <div class="grid gap-2">
            <Label for="remark">备注</Label>
            <Input id="remark" v-model="formData.remark" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">取消</Button>
        <Button @click="handleSave">保存</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template> 