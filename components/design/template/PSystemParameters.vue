<template>
	<shadcn-card v-if="parameters.length > 0">
		<shadcn-card-header>
			<shadcn-card-title class="text-xl font-semibold">参数列表</shadcn-card-title>
		</shadcn-card-header>
		<shadcn-card-content>
			<AbstractDataTable
				:columns="columns"
				:data="parameters"
				:loading="false"
				:editable="true"
				@update="handleUpdate"
			/>
		</shadcn-card-content>
	</shadcn-card>
</template>

<script setup lang="ts">
// import AbstractDataTable from '~/components/abstract-data-table.vue'
import { ZdParameter } from '~/models/entity/parameter'

const props = defineProps<{
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	update: [param: ZdParameter]
}>()

const columns = [
	{
		accessorKey: 'name',
		header: '参数名',
		enableEditing: false
	},
	{
		accessorKey: 'description',
		header: '描述',
		enableEditing: true
	},
	{
		accessorKey: 'value',
		header: '值',
		enableEditing: true
	},
	{
		accessorKey: 'dtype',
		header: '类型',
		enableEditing: false
	}
]

const handleUpdate = (param: ZdParameter) => {
	emit('update', param)
}
</script> 