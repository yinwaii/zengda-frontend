<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { User } from '@/models/entity/user'
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
  editData?: User
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: User]
}>()

const formData = ref<User>({
  userId: 0,
  deptId: 0,
  userName: '',
  nickName: '',
  userType: '',
  phonenumber: '',
  email: '',
  sex: '0',
  avatar: '',
  password: '',
  status: '0',
  isAdmin: 0,
  remark: ''
})

const showAlertDialog = ref(false)
const alertMessage = ref('')

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal }
  } else {
    formData.value = {
      userId: 0,
      deptId: 0,
      userName: '',
      nickName: '',
      userType: '',
      phonenumber: '',
      email: '',
      sex: '0',
      avatar: '',
      password: '',
      status: '0',
      isAdmin: 0,
      remark: ''
    }
  }
}, { immediate: true })

const title = computed(() => props.editData ? '修改用户' : '新增用户')

function onSubmit() {
  // 验证用户名（仅在新建时验证）
  if (!props.editData && !formData.value.userName.trim()) {
    alertMessage.value = '用户名不能为空'
    showAlertDialog.value = true
    return
  }

  // // 验证昵称
  // if (!formData.value.nickName.trim()) {
  //   alertMessage.value = '昵称不能为空'
  //   showAlertDialog.value = true
  //   return
  // }

  // // 验证手机号
  // if (!formData.value.phonenumber?.trim()) {
  //   alertMessage.value = '手机号不能为空'
  //   showAlertDialog.value = true
  //   return
  // }

  // // 验证手机号格式
  // const phoneRegex = /^1[3-9]\d{9}$/
  // if (!phoneRegex.test(formData.value.phonenumber)) {
  //   alertMessage.value = '请输入正确的手机号格式'
  //   showAlertDialog.value = true
  //   return
  // }

  // // 验证邮箱格式
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // if (formData.value.email && !emailRegex.test(formData.value.email)) {
  //   alertMessage.value = '请输入正确的邮箱格式'
  //   showAlertDialog.value = true
  //   return
  // }

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
          <Label class="text-right" for="userName">用户名</Label>
          <Input
            id="userName"
            v-model="formData.userName"
            class="col-span-3"
            :disabled="!!editData"
            :placeholder="editData ? '用户名不可修改' : '请输入用户名'"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="password">密码</Label>
          <Input
            id="password"
            v-model="formData.password"
            type="password"
            class="col-span-3"
            placeholder="请输入密码"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="nickName">昵称</Label>
          <Input
            id="nickName"
            v-model="formData.nickName"
            class="col-span-3"
            placeholder="请输入昵称"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="sex">性别</Label>
          <Select v-model="formData.sex" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="请选择性别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">女</SelectItem>
              <SelectItem value="1">男</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="phonenumber">手机号</Label>
          <Input
            id="phonenumber"
            v-model="formData.phonenumber"
            class="col-span-3"
            placeholder="请输入手机号"
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