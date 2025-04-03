<template>
    <div>   
        <div class="flex justify-between items-center mb-4">
            <h1>角色管理</h1>
            <Button @click="handleAdd">新增角色</Button>
        </div>
        <shadcn-table>
            <shadcn-table-header>
                <shadcn-table-row>
                    <shadcn-table-head>ID</shadcn-table-head>
                    <shadcn-table-head>角色名称</shadcn-table-head>
                    <shadcn-table-head>角色编码</shadcn-table-head>
                    <shadcn-table-head>状态</shadcn-table-head>
                    <shadcn-table-head>数据范围</shadcn-table-head>
                    <shadcn-table-head>备注</shadcn-table-head>
                    <shadcn-table-head>创建时间</shadcn-table-head>
                    <shadcn-table-head>操作</shadcn-table-head>
                </shadcn-table-row>
            </shadcn-table-header>
            <shadcn-table-body>
                <shadcn-table-row v-for="role in roleList" :key="role.roleId">
                    <shadcn-table-cell>{{ role.roleId }}</shadcn-table-cell>
                    <shadcn-table-cell>{{ role.roleName }}</shadcn-table-cell>
                    <shadcn-table-cell>{{ role.roleKey }}</shadcn-table-cell>
                    
                    <shadcn-table-cell>
                        <shadcn-badge :variant="role.status === '0' ? 'outline' : 'destructive'">
                            {{ role.status === '0' ? '正常' : '停用' }} 
                        </shadcn-badge>
                    </shadcn-table-cell>
                    <shadcn-table-cell>
                        {{ role.dataScope === '1' ? '全部数据权限' : 
                           role.dataScope === '2' ? '自定义数据权限' :
                           role.dataScope === '3' ? '本部门数据权限' : '本部门及以下数据权限' }}
                    </shadcn-table-cell>
                    <shadcn-table-cell>{{ role.remark }}</shadcn-table-cell>
                    <shadcn-table-cell>{{ role.createdTime }}</shadcn-table-cell>
                    <shadcn-table-cell>
                        <div class="items-center justify-center gap-2 space-x-2">
                            <Button variant="ghost" size="icon" @click="handleEdit(role)">
                                <Pencil1Icon class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" @click="handleDelete(role)">
                                <TrashIcon class="h-4 w-4" />
                            </Button>
                        </div>
                    </shadcn-table-cell>
                </shadcn-table-row>
            </shadcn-table-body>
        </shadcn-table>

        <RoleDialog
            v-model="showDialog"
            :edit-data="currentRole"
            @submit="handleSubmit"
        />

        <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                        确定要删除角色 "{{ deleteRole?.roleName }}" 吗？此操作不可恢复。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="confirmDelete">确定</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEntityApis } from '@/composables/use-entity-apis';
import { Role } from '@/models/entity/system';
import { Pencil1Icon, TrashIcon } from '@radix-icons/vue';
import RoleDialog from '@/components/role/role-dialog.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const { toast } = useToast();
const { role: roleApi } = useEntityApis();

const roleList = ref<Role[]>([]);
const showDialog = ref(false);
const currentRole = ref<Role>();
const showDeleteDialog = ref(false);
const deleteRole = ref<Role>();

interface RoleQueryParams {
    page: {
        current: number;
        size: number;
    }
    data: {}
}

const roleQueryParams = ref<RoleQueryParams>({
    page: { current: 1, size: 10 },
    data: {},
});

function search() {
    roleQueryParams.value.page.current = 1;
    roleQueryParams.value.page.size = 10;
    roleQueryParams.value.data = {};
    roleApi.getRolePage(roleQueryParams.value).then((res) => {
        const rolePageResult = res as SysPage<Role>;
        roleList.value = rolePageResult.records;
    });
}

function handleAdd() {
    currentRole.value = undefined;
    showDialog.value = true;
}

function handleEdit(role: Role) {
    currentRole.value = role;
    showDialog.value = true;
}

function handleDelete(role: Role) {
    deleteRole.value = role;
    showDeleteDialog.value = true;
}

async function confirmDelete() {
    if (!deleteRole.value?.roleId) return;
    
    try {
        // 先检查角色是否已被使用
        const checkResult = await roleApi.getCheckRole(deleteRole.value.roleId);
        if (checkResult) {
            toast({
                title: '删除失败',
                description: '该角色已被使用，无法删除',
                variant: 'destructive',
            });
            return;
        }
        
        // 删除角色
        await roleApi.deleteRole(deleteRole.value.roleId);
        toast({
            title: '删除成功',
            description: '角色已成功删除',
        });
        search();
    } catch (error) {
        console.error('删除角色失败:', error);
        toast({
            title: '删除失败',
            description: '删除角色时发生错误',
            variant: 'destructive',
        });
    } finally {
        showDeleteDialog.value = false;
    }
}

async function handleSubmit(role: Role) {
    try {
        if (role.roleId) {
            await roleApi.updateRole(role);
            toast({
                title: '更新成功',
                description: '角色信息已更新',
            });
        } else {
            await roleApi.addRole(role);
            toast({
                title: '创建成功',
                description: '新角色已创建',
            });
        }
        search();
    } catch (error) {
        console.error('保存角色失败:', error);
        toast({
            title: '保存失败',
            description: '保存角色时发生错误',
            variant: 'destructive',
        });
    }
}

onMounted(() => {
    search();
});
</script>



