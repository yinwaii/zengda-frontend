<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ZdDept } from '@/models/entity/dept'
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
  editData?: ZdDept
  deptList: ZdDept[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: ZdDept]
}>()

const formData = ref<ZdDept>({
  deptName: '',
  parentId: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0'
})

const showAlertDialog = ref(false)
const alertMessage = ref('')

// 扁平化处理部门树
const flattenedDepts = computed(() => {
  const result: (ZdDept & { level: number })[] = []
  
  const flatten = (items: ZdDept[], level = 0) => {
    items.forEach(item => {
      result.push({ ...item, level })
      if (item.children?.length) {
        flatten(item.children, level + 1)
      }
    })
  }
  
  flatten(props.deptList)
  return result
})

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal) {
    formData.value = { 
      ...newVal,
      parentId: newVal.parentId ?? 0
    }
  } else {
    formData.value = {
      deptName: '',
      parentId: 0,
      leader: '',
      phone: '',
      email: '',
      status: '0'
    }
  }
}, { immediate: true })

const title = computed(() => props.editData ? '修改部门' : '新增部门')

function onSubmit() {
  // 验证部门名称
  if (!formData.value.deptName.trim()) {
    alertMessage.value = '部门名称不能为空'
    showAlertDialog.value = true
    return
  }

  // 验证负责人
  if (!formData.value.leader?.trim()) {
    alertMessage.value = '负责人不能为空'
    showAlertDialog.value = true
    return
  }

  // 验证联系电话
  if (!formData.value.phone?.trim()) {
    alertMessage.value = '联系电话不能为空'
    showAlertDialog.value = true
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (formData.value.email && !emailRegex.test(formData.value.email)) {
    alertMessage.value = '请输入正确的邮箱格式'
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
          <Label class="text-right" for="parentId">上级部门</Label>
          <Select v-model="formData.parentId" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="请选择上级部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="0">无</SelectItem>
              <SelectItem
                v-for="dept in flattenedDepts"
                :key="dept.deptId"
                :value="dept.deptId ?? 0"
                :disabled="editData?.deptId === dept.deptId"
              >
                <span :style="{ paddingLeft: `${dept.level * 16}px` }">
                  {{ dept.deptName }}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="deptName">部门名称</Label>
          <Input
            id="deptName"
            v-model="formData.deptName"
            class="col-span-3"
            placeholder="请输入部门名称"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="leader">负责人</Label>
          <Input
            id="leader"
            v-model="formData.leader"
            class="col-span-3"
            placeholder="请输入负责人"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="phone">联系电话</Label>
          <Input
            id="phone"
            v-model="formData.phone"
            class="col-span-3"
            placeholder="请输入联系电话"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="email">邮箱</Label>
          <Input
            id="email"
            v-model="formData.email"
            class="col-span-3"
            placeholder="请输入邮箱"
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