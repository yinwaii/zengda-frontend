<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ref, computed, watch } from 'vue'
import type { Menu } from '@/models/entity/system'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const emit = defineEmits<{
  (e: 'update:data', value: TData[]): void
}>()

// Track expanded rows
const expandedRows = ref<Record<string, boolean>>({})

// Flatten menu data with level information
interface FlatMenuItem extends Menu {
  _level: number
  _parentId?: string
}

const flattenedData = computed(() => {
  const result: FlatMenuItem[] = []

  function flatten(items: Menu[], level: number = 0, parentId?: string) {
    items.forEach(item => {
      const flatItem = {
        ...item,
        _level: level,
        _parentId: parentId
      }
      result.push(flatItem)

      // If row is expanded and has children, add them to the flattened data
      if (expandedRows.value[item.menuId.toString()] && item.children?.length) {
        flatten(item.children, level + 1, item.menuId.toString())
      }
    })
  }

  flatten(props.data as Menu[])
  return result
})

// Toggle row expansion
const toggleRowExpansion = (rowId: string) => {
  expandedRows.value[rowId] = !expandedRows.value[rowId]
}

// Update menu item
const updateMenuItem = (updatedMenu: Menu) => {
  const newData = [...props.data] as Menu[]
  function updateInTree(items: Menu[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].menuId === updatedMenu.menuId) {
        items[i] = { ...items[i], ...updatedMenu }
        return true
      }
    }
    return false
  }

  updateInTree(newData)
  emit('update:data', newData as TData[])
}

const table = useVueTable({
  get data() { return flattenedData.value as TData[] },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  meta: {
    expandedRows,
    toggleRowExpansion,
    updateMenuItem
  }
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>

<style scoped>
.ml-8 {
  margin-left: 2rem;
}
</style>
