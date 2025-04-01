<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEntityApis } from '@/composables/use-entity-apis'
import { CaretRightIcon, Pencil1Icon, TrashIcon } from '@radix-icons/vue'
import type { ZdDept } from '@/models/entity/dept'
import DeptDialog from '@/components/dept/dept-dialog.vue'
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
import { useToast } from '@/components/ui/toast/use-toast'

const { dept } = useEntityApis()
const { toast } = useToast()

const searchForm = ref({})
const deptList = ref<ZdDept[]>([])
const showDialog = ref(false)
const editingDept = ref<ZdDept>()
const showDeleteDialog = ref(false)
const deletingDept = ref<ZdDept>()

// 扁平化处理部门树
const flattenedDepts = computed(() => {
  const result: (ZdDept & { level: number })[] = []
  
  const flatten = (items: ZdDept[], level = 0) => {
    items.forEach(item => {
      result.push({ ...item, level })
      if (item.children?.length && item.open) {
        flatten(item.children, level + 1)
      }
    })
  }
  
  flatten(deptList.value)
  return result
})

// 切换部门展开状态
function toggleOpen(deptId: number) {
  const toggleDept = (items: ZdDept[]): boolean => {
    for (const item of items) {
      if (item.deptId === deptId) {
        item.open = !item.open
        return true
      }
      if (item.children?.length) {
        if (toggleDept(item.children)) {
          return true
        }
      }
    }
    return false
  }
  
  toggleDept(deptList.value)
}

function reload() {
  dept.getDeptList(searchForm.value).then((res) => {
    const initOpen = (items: ZdDept[]): ZdDept[] => {
      return items.map(item => ({
        ...item,
        open: true,
        children: item.children ? initOpen(item.children) : undefined
      }))
    }
    deptList.value = initOpen(res as Array<ZdDept>)
    console.log(res)
  })
}

function handleCreate() {
  editingDept.value = undefined
  showDialog.value = true
}

function handleEdit(item: ZdDept) {
  editingDept.value = item
  showDialog.value = true
}

async function handleSubmit(data: ZdDept) {
  try {
    if (editingDept.value) {
      await dept.updateDept({
        ...data,
        deptId: editingDept.value.deptId
      })
      toast({
        title: "成功",
        description: "部门修改成功",
      })
    } else {
      await dept.addDept(data)
      toast({
        title: "成功",
        description: "部门创建成功",
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

async function handleDelete(item: ZdDept) {
  deletingDept.value = item
  // 检查是否有子部门
  const hasChildren = await dept.getCheckDept(item.deptId!)
  if (hasChildren) {
    toast({
      title: "警告",
      description: "该部门下存在子部门，无法删除",
      variant: "destructive",
    })
    return
  }
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!deletingDept.value?.deptId) return
  
  try {
    await dept.deleteDept(deletingDept.value.deptId)
    toast({
      title: "成功",
      description: "部门删除成功",
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
    deletingDept.value = undefined
  }
}

onMounted(() => {
  reload()
})
</script>

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
          <shadcn-table-head class="w-[50px]"></shadcn-table-head>
          <shadcn-table-head class="w-[230px]">部门名称</shadcn-table-head>
          <shadcn-table-head class="w-[120px]">负责人</shadcn-table-head>
          <shadcn-table-head class="w-[150px]">联系电话</shadcn-table-head>
          <shadcn-table-head class="w-[200px]">邮箱</shadcn-table-head>
          <shadcn-table-head class="w-[200px]">地址</shadcn-table-head>
          <shadcn-table-head class="w-[100px] text-center">状态</shadcn-table-head>
          <shadcn-table-head class="w-[120px] text-center">操作</shadcn-table-head>
        </shadcn-table-row>
      </shadcn-table-header>
      <shadcn-table-body>
        <shadcn-table-row v-for="item in flattenedDepts" :key="item.deptId">
          <shadcn-table-cell class="w-[50px] p-0">
            <div class="flex items-center justify-center h-[40px]">
              <Button
                v-if="item.children?.length"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="toggleOpen(item.deptId!)"
              >
                <CaretRightIcon
                  :class="[
                    'h-4 w-4 transition-transform',
                    item.open ? 'rotate-90' : ''
                  ]"
                />
              </Button>
            </div>
          </shadcn-table-cell>
          <shadcn-table-cell>
            <div :style="{ paddingLeft: `${item.level * 24}px` }">
              {{ item.deptName }}
            </div>
          </shadcn-table-cell>
          <shadcn-table-cell>{{ item.leader }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.phone }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.email }}</shadcn-table-cell>
          <shadcn-table-cell>{{ item.address }}</shadcn-table-cell>
          <shadcn-table-cell class="text-center">
            <Badge :variant="item.status === '0' ? 'outline' : 'destructive'">
              {{ item.status === '0' ? '正常' : '停用' }}
            </Badge>
          </shadcn-table-cell>
          <shadcn-table-cell class="text-center">
            <div class="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" @click="handleEdit(item)">
                <Pencil1Icon class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="handleDelete(item)">
                <TrashIcon class="h-4 w-4" />
              </Button>
            </div>
          </shadcn-table-cell>
        </shadcn-table-row>
      </shadcn-table-body>
    </shadcn-table>

    <DeptDialog
      v-model="showDialog"
      :edit-data="editingDept"
      :dept-list="deptList"
      @submit="handleSubmit"
    />

    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除部门"{{ deletingDept?.deptName }}"吗？此操作不可恢复。
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
  </div>
</template>
