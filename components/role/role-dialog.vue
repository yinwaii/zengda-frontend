<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Role } from '@/models/entity/system'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
  modelValue: boolean
  editData?: Role
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: Role]
}>()

const formData = ref<Role>({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  status: '0',
  roleSort: 0,
  dataScope: undefined,
  remark: '',
  deptCheckStrictly: 0,
  menuCheckStrictly: 0
})

const showAlertDialog = ref(false)
const alertMessage = ref('')

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal }
  } else {
    formData.value = {
      roleId: undefined,
      roleName: '',
      roleKey: '',
      status: '0',
      roleSort: 0,
      dataScope: undefined,
      remark: '',
      deptCheckStrictly: 0,
      menuCheckStrictly: 0
    }
  }
}, { immediate: true })

const title = computed(() => props.editData ? '修改角色' : '新增角色')

function onSubmit() {
  // 验证角色名称
  if (!formData.value.roleName.trim()) {
    alertMessage.value = '角色名称不能为空'
    showAlertDialog.value = true
    return
  }

  // 验证角色编码
  if (!formData.value.roleKey.trim()) {
    alertMessage.value = '角色编码不能为空'
    showAlertDialog.value = true
    return
  }

  emit('submit', formData.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="roleName">角色名称</Label>
          <Input
            id="roleName"
            v-model="formData.roleName"
            class="col-span-3"
            placeholder="请输入角色名称"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="roleKey">角色编码</Label>
          <Input
            id="roleKey"
            v-model="formData.roleKey"
            class="col-span-3"
            placeholder="请输入角色编码"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="status">状态</Label>
          <Select v-model="formData.status" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="请选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">正常</SelectItem>
              <SelectItem value="1">停用</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="dataScope">数据范围</Label>
          <Select v-model="formData.dataScope" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="请选择数据范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">全部数据权限</SelectItem>
              <SelectItem value="2">自定义数据权限</SelectItem>
              <SelectItem value="3">本部门数据权限</SelectItem>
              <SelectItem value="4">本部门及以下数据权限</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="remark">备注</Label>
          <Input
            id="remark"
            v-model="formData.remark"
            class="col-span-3"
            placeholder="请输入备注"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <Button variant="outline" @click="emit('update:modelValue', false)">
          取消
        </Button>
        <Button @click="onSubmit">
          确定
        </Button>
      </div>
    </DialogContent>
  </Dialog>

  <AlertDialog :open="showAlertDialog" @update:open="showAlertDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>警告</AlertDialogTitle>
        <AlertDialogDescription>
          {{ alertMessage }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction @click="showAlertDialog = false">
          确定
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template> 