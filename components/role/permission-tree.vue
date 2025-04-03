<template>
    <div>
        <div v-for="menu in menus" :key="menu.menuId" class="space-y-2">
            <div 
                class="flex items-center space-x-2 cursor-pointer select-none" 
                @click="$emit('toggle', menu)"
            >
                <div class="flex items-center space-x-2 flex-1">
                    <ChevronRightIcon 
                        class="h-4 w-4 transition-transform" 
                        :class="{ 'rotate-90': !collapsedMenus.includes(menu.menuId) }"
                        v-if="menu.children && menu.children.length > 0"
                    />
                    <div v-else class="w-4"></div>
                    <Checkbox 
                        :model-value="isChecked(menu.menuId)"
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
                    @toggle="$emit('toggle', $event)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Menu } from '@/models/entity/system';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRightIcon } from '@radix-icons/vue';

const props = defineProps<{
    menus: Menu[];
    checkedList: number[];
    collapsedMenus: number[];
}>();

const emit = defineEmits<{
    (e: 'check', menu: Menu, checked: boolean): void;
    (e: 'toggle', menu: Menu): void;
}>();

const isChecked = (menuId: number) => props.checkedList.includes(menuId);

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

const handleCheck = (menu: Menu, checked: boolean) => {
    // 处理当前节点
    emit('check', menu, checked);
    
    // 如果选中，同时选中所有子节点
    if (checked && menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
            handleCheck(child, true);
        });
    }
};
</script> 