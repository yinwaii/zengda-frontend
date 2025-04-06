<template>
  <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>分配角色 - {{ user?.userName }}</DialogTitle>
      </DialogHeader>
      
      <div class="py-4">
        <shadcn-table>
          <shadcn-table-header>
            <shadcn-table-row>
              <shadcn-table-head class="w-[50px]"></shadcn-table-head>
              <shadcn-table-head>角色名称</shadcn-table-head>
              <shadcn-table-head>角色编码</shadcn-table-head>
              <shadcn-table-head>备注</shadcn-table-head>
            </shadcn-table-row>
          </shadcn-table-header>
          <shadcn-table-body>
            <shadcn-table-row v-for="role in roleList" :key="role.roleId">
              <shadcn-table-cell>
                <Checkbox 
                  :model-value="selectedRoles.includes(role.roleId)"
                  @update:model-value="(checked) => toggleRole(role.roleId)"
                />
              </shadcn-table-cell>
              <shadcn-table-cell>{{ role.roleName }}</shadcn-table-cell>
              <shadcn-table-cell>{{ role.roleKey }}</shadcn-table-cell>
              <shadcn-table-cell>{{ role.remark }}</shadcn-table-cell>
            </shadcn-table-row>
          </shadcn-table-body>
        </shadcn-table>

        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-2">
            <span>每页显示</span>
            <Select v-model="queryParams.page.size">
              <SelectTrigger class="w-[100px]">
                <SelectValue :placeholder="queryParams.page.size.toString()" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="10">10</SelectItem>
                <SelectItem :value="20">20</SelectItem>
                <SelectItem :value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>条</span>
          </div>
          <div class="flex items-center gap-2">
            <Button 
              variant="outline" 
              :disabled="queryParams.page.current === 1"
              @click="queryParams.page.current--"
            >
              上一页
            </Button>
            <span>第 {{ queryParams.page.current }} 页</span>
            <Button 
              variant="outline"
              :disabled="!hasMore"
              @click="queryParams.page.current++"
            >
              下一页
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="$emit('update:modelValue', false)">取消</Button>
        <Button @click="handleSubmit">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEntityApis } from '@/composables/use-entity-apis'
import { useToast } from '@/components/ui/toast/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Role } from '@/models/entity/system'
import type { User } from '@/models/entity/user'

const props = defineProps<{
  modelValue: boolean
  user?: User
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const { role: roleApi, userinfo } = useEntityApis()
const { toast } = useToast()

const roleList = ref<Role[]>([])
const selectedRoles = ref<number[]>([])
const total = ref(0)

const queryParams = ref({
  page: {
    current: 1,
    size: 10
  },
  data: {}
})

const hasMore = computed(() => {
  return roleList.value.length === queryParams.value.page.size
})

// 加载角色列表
async function loadRoles() {
  try {
    const res = await roleApi.getRolePage(queryParams.value) as SysPage<Role>
    roleList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
    toast({
      title: '错误',
      description: '获取角色列表失败',
      variant: 'destructive'
    })
  }
}

// 加载用户已分配的角色
async function loadUserRoles() {
  if (!props.user?.userId) return
  
  try {
    const res = await userinfo.getRoleIdByUserId(props.user.userId)
    // 确保返回的是数组
    selectedRoles.value = res as number[]
  } catch (error) {
    console.error('获取用户角色失败:', error)
    toast({
      title: '错误',
      description: '获取用户已分配角色失败',
      variant: 'destructive'
    })
  }
}

// 切换角色选择状态
function toggleRole(roleId: number) {
  const index = selectedRoles.value.indexOf(roleId)
  if (index === -1) {
    selectedRoles.value.push(roleId)
  } else {
    selectedRoles.value.splice(index, 1)
  }
}

// 提交分配
async function handleSubmit(event: Event) {
  // 防止表单默认提交行为
  if (event) event.preventDefault()
  
  if (!props.user?.userId) return

  // 没有分配任何权限, 直接关闭
  if (selectedRoles.value.length === 0) {
    toast({
      title: '提示',
      description: '请至少选择一个角色'
    })
    return
  }
  
  try {
    await userinfo.assignRoleSave({
      userId: props.user.userId,
      roleIds: selectedRoles.value
    })
    
    toast({
      title: '成功',
      description: '角色分配成功'
    })
    
    emit('success')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('分配角色失败:', error)
    toast({
      title: '错误',
      description: '角色分配失败',
      variant: 'destructive'
    })
  }
}

// 监听分页变化
watch(() => queryParams.value.page, () => {
  loadRoles()
}, { deep: true })

// 监听弹窗打开
watch(() => props.modelValue, async (val) => {
  if (val && props.user) {
    queryParams.value.page.current = 1
    // 先加载用户角色，再加载角色列表
    await loadUserRoles()
    await loadRoles()
  } else {
    // 关闭弹窗时清空选择
    selectedRoles.value = []
  }
})
</script> 