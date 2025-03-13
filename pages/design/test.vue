<script setup lang="tsx">
import { type ColumnDef } from "@tanstack/vue-table"
import { AbstractDataTableDropDown, ShadcnButton, ShadcnCheckbox, LucideArrowUpDown } from '#components'

interface Payment {
	id: string
	amount: number
	status: 'pending' | 'processing' | 'success' | 'failed'
	email: string
}

const payments: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	},
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	}, {
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	}, {
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	}, {
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	}, {
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	}, {
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	},
	// ...
]

const columns: ColumnDef<Payment>[] = [
	{
		id: 'select',
		header: ({ table }) => h(ShadcnCheckbox, {
			'modelValue': table.getIsAllPageRowsSelected(),
			'onUpdate:modelValue': (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
			'ariaLabel': 'Select all',
		}),
		cell: ({ row }) => h(ShadcnCheckbox, {
			'modelValue': row.getIsSelected(),
			'onUpdate:modelValue': (value: boolean | "indeterminate") => row.toggleSelected(!!value),
			'ariaLabel': 'Select row',
		}),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => <abstract-data-table-column-header column={column} title="Email" />,
		// cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
	},
	{
		accessorKey: 'amount',
		header: () => <div class="text-right">Amount</div>,
		// cell: ({ row }) => {
		// 	const amount = Number.parseFloat(row.getValue('amount'))
		// 	const formatted = new Intl.NumberFormat('en-US', {
		// 		style: 'currency',
		// 		currency: 'USD',
		// 	}).format(amount)

		// 	return h('div', { class: 'text-right font-medium' }, formatted)
		// },
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original

			return h('div', { class: 'relative' }, h(AbstractDataTableDropDown, {
				payment,
				onExpand: row.toggleExpanded,
			}))
		},
	},
]

const data = ref<Payment[]>([])

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return payments
}

onMounted(async () => {
	data.value = await getData()
})
</script>

<template>
	<div class="container py-10 mx-auto">
		<abstract-data-table :columns="columns" :data="data" />
	</div>
</template>