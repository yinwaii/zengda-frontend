<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>分配权限</DialogTitle>
                <DialogDescription>
                    为角色 "{{ role?.roleName }}" 分配菜单权限
                </DialogDescription>
            </DialogHeader>
            <div class="py-4">
                <div v-if="loading" class="flex justify-center items-center h-64">
                    <UpdateIcon class="h-8 w-8 animate-spin" />
                </div>
                <div v-else class="space-y-2 max-h-[60vh] overflow-y-auto pr-4">
                    <div v-for="menu in menuList" :key="menu.menuId">
                        <div 
                            class="flex items-center space-x-2 cursor-pointer select-none" 
                            @click="toggleMenu(menu)"
                        >
                            <div class="flex items-center space-x-2 flex-1">
                                <ChevronRightIcon 
                                    class="h-4 w-4 transition-transform" 
                                    :class="{ 'rotate-90': !collapsedMenus.includes(menu.menuId) }"
                                    v-if="menu.children && menu.children.length > 0"
                                />
                                <div v-else class="w-4"></div>
                                <Checkbox 
                                    :model-value="checkedList.includes(menu.menuId)"
                                    @update:model-value="(value: boolean | 'indeterminate') => handleCheck(menu, value === true)"
                                    @click.stop
                                />
                                <span>{{ menu.label }}</span>
                            </div>
                        </div>
                        <div 
                            v-if="menu.children && menu.children.length > 0" 
                            v-show="!collapsedMenus.includes(menu.menuId)"
                            class="ml-6"
                        >
                            <PermissionTree 
                                :menus="menu.children" 
                                :checked-list="checkedList"
                                :collapsed-menus="collapsedMenus"
                                @check="handleCheck"
                                @toggle="toggleMenu"
                            />
                        </div>
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
import { ref, onMounted, watch } from 'vue';
import { Role, Menu } from '@/models/entity/system';
import { useEntityApis } from '@/composables/use-entity-apis';
import { UpdateIcon, ChevronRightIcon } from '@radix-icons/vue';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PermissionTree from './permission-tree.vue';
import { useToast } from '@/components/ui/toast/use-toast';

const props = defineProps<{
    modelValue: boolean;
    role?: Role;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const { role: roleApi } = useEntityApis();
const menuList = ref<Menu[]>([]);
const checkedList = ref<number[]>([]);
const loading = ref(false);
const { toast } = useToast();
const collapsedMenus = ref<number[]>([]);

const handleCheck = (menu: Menu, checked: boolean) => {
    // 处理当前节点
    if (checked) {
        if (!checkedList.value.includes(menu.menuId)) {
            checkedList.value.push(menu.menuId);
        }
    } else {
        checkedList.value = checkedList.value.filter(id => id !== menu.menuId);
    }

    // 获取所有子节点ID
    const getAllChildIds = (menu: Menu): number[] => {
        let ids: number[] = [];
        if (menu.children && menu.children.length > 0) {
            menu.children.forEach(child => {
                ids.push(child.menuId);
                ids = ids.concat(getAllChildIds(child));
            });
        }
        return ids;
    };

    // 如果选中，同时选中所有子节点
    if (checked && menu.children && menu.children.length > 0) {
        const childIds = getAllChildIds(menu);
        childIds.forEach(id => {
            if (!checkedList.value.includes(id)) {
                checkedList.value.push(id);
            }
        });
    }

    // 如果取消选中，同时取消选中所有子节点
    if (!checked && menu.children && menu.children.length > 0) {
        const childIds = getAllChildIds(menu);
        checkedList.value = checkedList.value.filter(id => !childIds.includes(id));
    }

    // 检查父节点是否需要选中
    const checkParent = (menu: Menu) => {
        if (menu.parentId) {
            const parent = findParent(menu.parentId, menuList.value);
            if (parent) {
                const allChildren = getAllChildIds(parent);
                // 只要有一个子节点被选中，父节点就应该被选中
                const hasSelectedChild = allChildren.some(id => checkedList.value.includes(id));
                if (hasSelectedChild && !checkedList.value.includes(parent.menuId)) {
                    checkedList.value.push(parent.menuId);
                } else if (!hasSelectedChild && checkedList.value.includes(parent.menuId)) {
                    checkedList.value = checkedList.value.filter(id => id !== parent.menuId);
                }
                checkParent(parent);
            }
        }
    };

    checkParent(menu);
};

// 查找父节点
const findParent = (parentId: number, menus: Menu[]): Menu | null => {
    for (const menu of menus) {
        if (menu.menuId === parentId) {
            return menu;
        }
        if (menu.children && menu.children.length > 0) {
            const found = findParent(parentId, menu.children);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

const toggleMenu = (menu: Menu) => {
    const index = collapsedMenus.value.indexOf(menu.menuId);
    if (index === -1) {
        collapsedMenus.value.push(menu.menuId);
    } else {
        collapsedMenus.value.splice(index, 1);
    }
};

const loadPermissionData = async () => {
    if (!props.role?.roleId) return;
    
    loading.value = true;
    collapsedMenus.value = []; // 重置折叠状态
    try {
        const result = await roleApi.getAssignMenuTree(props.role.roleId);
        menuList.value = result.menuList;
        checkedList.value = result.checkList;
    } catch (error) {
        console.error('加载权限数据失败:', error);
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async (event: Event) => {
    // 防止表单默认提交行为
    if (event) event.preventDefault()
    
    if (!props.role?.roleId) return;

    if (checkedList.value.length === 0) {
        toast({
            title: '提示',
            description: '请至少选择一个菜单',
        });
        return;
    }
    

    try {
        await roleApi.saveRoleAssign({
            roleId: props.role.roleId,
            list: checkedList.value
        });
        
        toast({
            title: '保存成功',
            description: '权限分配已更新',
        });
        
        emit('update:modelValue', false);
    } catch (error) {
        console.error('保存权限失败:', error);
        toast({
            title: '保存失败',
            description: '保存权限时发生错误',
            variant: 'destructive',
        });
    }
};

watch(() => props.modelValue, (newValue) => {
    if (newValue && props.role) {
        loadPermissionData();
    }
});
</script> 