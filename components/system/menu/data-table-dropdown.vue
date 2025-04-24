<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Copy, Trash } from 'lucide-vue-next'
import { Menu } from "~/models/entity/system"
import MenuEditDialog from './menu-edit-dialog.vue'
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  menu: Menu,
  table: any
}>()

const editDialogOpen = ref(false)
const { toast } = useToast()

function copy(id: string) {
  copyToClipboard(id)
  // navigator.clipboard.writeText(id)
}

const handleSave = (updatedMenu: Menu) => {
  // Call the updateMenuItem function from the table's meta
  props.table.options.meta?.updateMenuItem(updatedMenu)
}
</script>

<template>
  <MenuEditDialog
    v-model:open="editDialogOpen"
    :menu="menu"
    @save="handleSave"
  />
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>操作</DropdownMenuLabel>
      <DropdownMenuItem @click="editDialogOpen = true">
        <Pencil class="mr-2 h-4 w-4" />
        <span>编辑</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="copy(menu.menuId.toString())">
        <Copy class="mr-2 h-4 w-4" />
        <span>复制ID</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-red-600">
        <Trash class="mr-2 h-4 w-4" />
        <span>删除</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
