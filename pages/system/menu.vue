<template>
    <div>
        <h1>菜单管理</h1>
    </div>

    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEntityApis } from '@/composables/use-entity-apis';
import { Menu } from '@/models/entity/system';
import { useToast } from '@/components/ui/toast/use-toast';

const { menu: menuApi } = useEntityApis();
const menuList = ref<Menu[]>([]);
const showDialog = ref(false);
const currentMenu = ref<Menu>();
const showDeleteDialog = ref(false);
const deleteMenu = ref<Menu>();

function search(){
    menuList.value = [];
    menuApi.getMenuList().then((res) => {
        menuList.value = res as Menu[];
    });
}    

onMounted(() => {
    search();
});

</script>

