import { h } from 'vue'
import type {ColumnDef} from "@tanstack/vue-table";
import DropdownAction  from "./data-table-dropdown.vue"
import { Menu } from '@/models/entity/system'
import { ChevronRight } from 'lucide-vue-next'

export const columns: ColumnDef<Menu>[] = [
    {
        id: 'expand',
        header: () => null,
        cell: ({ row, table }) => {
            const hasChildren = row.original.children && row.original.children.length > 0
            const level = (row.original as any)._level || 0
            const menuId = row.original.menuId.toString()
            
            return h('div', {
                class: 'flex items-center w-[40px]'
            }, [
                hasChildren && h('button', {
                    class: 'p-2 hover:bg-gray-100 rounded',
                    onClick: () => (table as any).options.meta?.toggleRowExpansion(menuId)
                }, [
                    h(ChevronRight, {
                        class: ['w-4 h-4 transition-transform', {
                            'rotate-90': (table as any).options.meta?.expandedRows[menuId]
                        }]
                    })
                ])
            ])
        }
    },
    {
        accessorKey: 'label',
        header: () => h('div', { class: 'text-left w-[120px]' }, '菜单名称'),
        cell: ({row}) => {
            const level = (row.original as any)._level || 0
            const hasChildren = row.original.children && row.original.children.length > 0
            return h('div', { 
                class: ['text-left font-medium w-[120px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('label'))
        }
    },
    {
        accessorKey: 'name',
        header: () => h('div', { class: 'text-left w-[120px]' }, '链接地址'),
        cell: ({ row }) =>{
            const level = (row.original as any)._level || 0
            return h('div', {
                class: ['text-left font-medium w-[120px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('name'))
        }
    },
    {
        accessorKey: 'url',
        header: () => h('div', { class: 'text-left w-[120px]' }, '组件路径'),
        cell: ({ row }) => {
            const level = (row.original as any)._level || 0
            return h('div', {
                class: ['text-left font-medium w-[120px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('url'))
        }
    },
    {
        accessorKey: 'parentName',
        header: () => h('div', { class: 'text-left w-[120px]' }, '父菜单'),
        cell: ({ row }) => {
            const level = (row.original as any)._level || 0
            return h('div', {
                class: ['text-left font-medium w-[120px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('parentName'))
        }
    },
    // {
    //     accessorKey: 'orderNum',
    //     header: () => h('div', { class: 'text-left w-[80px]' }, '排序'),
    //     cell: ({ row }) => {
    //         const level = (row.original as any)._level || 0
    //         return h('div', {
    //             class: ['text-left font-medium w-[80px]', {
    //                 'text-gray-600': level > 0
    //             }]
    //         }, row.getValue('orderNum'))
    //     }
    // },
    {
        accessorKey: 'type',
        header: () => h('div', { class: 'text-left w-[80px]' }, '类型'),
        cell: ({ row }) => {
            const type = row.getValue('type') as number
            const level = (row.original as any)._level || 0
            const typeMap: Record<number, string> = {
                0: '目录',
                1: '菜单',
                2: '按钮'
            }
            const typeColorMap: Record<number, string> = {
                0: 'bg-blue-100 text-blue-800',
                1: 'bg-green-100 text-green-800',
                2: 'bg-gray-100 text-gray-800'
            }
            return h('div', { 
                class: ['text-left font-medium w-[80px]', {
                    'text-gray-600': level > 0
                }]
            }, [
                h('span', { 
                    class: `px-2 py-1 text-xs rounded-full ${typeColorMap[type] || 'bg-gray-100 text-gray-800'}`
                }, typeMap[type] || "未知")
            ])
        }
    },
    {
        accessorKey: 'icon',
        header: () => h('div', { class: 'text-left w-[80px]' }, '图标'),
        cell: ({ row }) => {
            const level = (row.original as any)._level || 0
            return h('div', {
                class: ['text-left font-medium w-[80px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('icon'))
        }
    },
    {
        accessorKey: 'remark',
        header: () => h('div', { class: 'text-left w-[120px]' }, '备注'),
        cell: ({ row }) => {
            const level = (row.original as any)._level || 0
            return h('div', {
                class: ['text-left font-medium w-[120px] truncate', {
                    'text-gray-600': level > 0
                }]
            }, row.getValue('remark'))
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row, table }) => {
            const menu = row.original
            return h('div', { class: 'relative w-[80px]' }, [
                h(DropdownAction, { menu, table })
            ])
        }
    }
]

