import { type ColumnDef } from "@tanstack/vue-table";

export const TimeStampColumnVisibility = {
	createdBy: false,
	createdTime: false,
	updatedBy: false,
	updatedTime: false,
}

export function packHeader<T>(name: string) {
	return ({ column }: { column: ColumnDef<T> }) => <abstract-data-table-column-header column={column} title={name} />;
}

export function getColumns<T>(dataColumn: ColumnDef<T>[], basic?: boolean, timestamp?: boolean): ColumnDef<T>[] {
	if (basic) {
		dataColumn = [
			{ accessorKey: 'id', header: packHeader<ZdProject>('ID') },
			{ accessorKey: 'name', header: packHeader<ZdProject>('名称') },
			{ accessorKey: 'description', header: packHeader<ZdProject>('备注') },
			...dataColumn,
		]
	}
	if (timestamp) {
		dataColumn = [
			...dataColumn,
			{ accessorKey: 'createdBy', header: packHeader<ZdProject>('创建人') },
			{ accessorKey: 'createdTime', header: packHeader<ZdProject>('创建时间') },
			{ accessorKey: 'updatedBy', header: packHeader<ZdProject>('更新人') },
			{ accessorKey: 'updatedTime', header: packHeader<ZdProject>('更新时间') },
		]
	}
	return [
		{
			id: 'select',
			header: ({ table }) => (<shadcn-checkbox
				modelValue={table.getIsAllPageRowsSelected()}
				onUpdate:modelValue={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
				ariaLabel="Select all"
			/>),
			cell: ({ row }) => (<shadcn-checkbox
				modelValue={row.getIsSelected()}
				onUpdate:modelValue={(value: boolean) => row.toggleSelected(!!value)}
				ariaLabel="Select all"
			/>),
			enableSorting: false,
			enableHiding: false,
		},
		...dataColumn,
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				const payment = row.original
				return <div class="relative">
					<abstract-data-table-drop-down
						onExpand={row.toggleExpanded}
					/>
				</div>
			},
		},
	]
}