<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <Button @click="reload">刷新</Button>
        <Button variant="outline" @click="handleCreate">新建</Button>
      </div>
    </div>

    <shadcn-table>
      <shadcn-table-header>
        <shadcn-table-row>
          <shadcn-table-head class="w-[100px]">ID</shadcn-table-head>
          <shadcn-table-head class="w-[150px]">用户名</shadcn-table-head>
          <shadcn-table-head class="w-[150px]">昵称</shadcn-table-head>
          <shadcn-table-head class="w-[150px]">性别</shadcn-table-head>
          <shadcn-table-head class="w-[200px]">邮箱</shadcn-table-head>
          <shadcn-table-head class="w-[150px]">电话</shadcn-table-head>
          <shadcn-table-head class="w-[120px] text-center">操作</shadcn-table-head>
          
        </shadcn-table-row>
      </shadcn-table-header>
      <shadcn-table-body>
        <shadcn-table-row v-for="item in userList" :key="item.userId">
          <shadcn-table-cell>{{ item.userId }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.userName }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.nickName }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.sex === '0' ? '女' : '男' }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.email }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.phonenumber }}</shadcn-table-cell>
          <shadcn-table-cell class="text-center">
            <div class="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" @click="handleEdit(item)">
                <Pencil1Icon class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleDelete(item)">
                <TrashIcon class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleAssignRole(item)">
                <PersonIcon class="h-4 w-4" />
              </Button>
            </div>
          </shadcn-table-cell>
        </shadcn-table-row>
      </shadcn-table-body>
    </shadcn-table>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span>每页显示</span>
        <Select v-model="userQueryParams.page.size">
          <SelectTrigger class="w-[100px]">
            <SelectValue :placeholder="userQueryParams.page.size.toString()" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="10">10</SelectItem>
            <SelectItem :value="20">20</SelectItem>
            <SelectItem :value="50">50</SelectItem>
            <SelectItem :value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span>条</span>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          variant="outline" 
          :disabled="userQueryParams.page.current === 1"
          @click="userQueryParams.page.current--"
        >
          上一页
        </Button>
        <span>第 {{ userQueryParams.page.current }} 页 / 共 {{ Math.ceil(total / userQueryParams.page.size) }} 页</span>
        <Button 
          variant="outline"
          :disabled="!hasMore"
          @click="userQueryParams.page.current++"
        >
          下一页
        </Button>
      </div>
    </div>

    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除用户"{{ deletingUser?.userName }}"吗？此操作不可恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">
            取消
          </AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <UserDialog
      v-model="showDialog"
      :edit-data="editingUser"
      @submit="handleSubmit"
    />

    <AssignRoleDialog 
      v-model="showAssignRoleDialog"
      :user="assigningUser"
      @success="handleAssignRoleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useEntityApis } from '@/composables/use-entity-apis'
import { ref, computed } from 'vue'
import { Pencil1Icon, TrashIcon, PersonIcon } from '@radix-icons/vue'
import type { User } from '@/models/entity/user'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type { SysPage } from '@/models/entity'
import UserDialog from '@/components/user/user-dialog.vue'
import AssignRoleDialog from '@/components/user/assign-role-dialog.vue'

const { userinfo } = useEntityApis()
const { toast } = useToast()

const userList = ref<User[]>([])
const showDeleteDialog = ref(false)
const deletingUser = ref<User>()
const total = ref(0)
const showDialog = ref(false)
const editingUser = ref<User>()
const showAssignRoleDialog = ref(false)
const assigningUser = ref<User>()

const userQueryParams = ref({
  page: {
    current: 1,
    size: 10
  },
  data: {}
})

const hasMore = computed(() => {
  return userList.value.length < total.value
})

const reload = () => {
  userinfo.getUserPage(userQueryParams.value).then((res) => {
    const pageData = res as SysPage<User>
    userList.value = pageData.records
    total.value = pageData.total
  })
}

function handleCreate() {
  editingUser.value = undefined
  showDialog.value = true
}

function handleEdit(item: User) {
  editingUser.value = item
  showDialog.value = true
}

function handleDelete(item: User) {
  deletingUser.value = item
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!deletingUser.value?.userId) return
  
  try {
    await userinfo.deleteUser(deletingUser.value.userId)
    toast({
      title: "成功",
      description: "用户删除成功",
    })
    reload()
  } catch (error) {
    toast({
      title: "错误",
      description: "删除失败：" + (error as Error).message,
      variant: "destructive",
    })
  } finally {
    showDeleteDialog.value = false
    deletingUser.value = undefined
  }
}

async function handleSubmit(data: User) {
  try {
    if (editingUser.value) {
      await userinfo.updateUser(data)
      toast({
        title: "成功",
        description: "用户修改成功",
      })
    } else {
    
      await userinfo.addUser(data)
      toast({
        title: "成功",
        description: "用户创建成功",
      })
    }
    reload()
  } catch (error) {
    toast({
      title: "错误",
      description: "操作失败：" + (error as Error).message,
      variant: "destructive",
    })
  }
}

function handleAssignRole(item: User) {
  assigningUser.value = item
  showAssignRoleDialog.value = true
}

function handleAssignRoleSuccess() {
  reload()
}

// 监听页面大小变化
watch(() => userQueryParams.value.page.size, () => {
  userQueryParams.value.page.current = 1
  reload()
})

// 监听页码变化
watch(() => userQueryParams.value.page.current, () => {
  reload()
})

onMounted(() => {
  reload()
})
</script>