<template>
	<div class="table">
		<el-table :data="$props.data" stripe :row-key="$props.rowKey" default-expand-all>
			<template v-for="(value, key) in $props.param">
				<el-table-column v-if="value?.isId === true" min-width="60px" fixed="left" align="right" :prop="key.toString()"
					:label="value?.name" />
				<el-table-column v-else align="left" :prop="key.toString()" :label="value?.name" />
			</template>
			<el-table-column v-if="$props.editable === true" fixed="right" min-width="120" align="center">
				<template #header>
					<span>操作</span>
					<el-button class="insert-button" size="small" @click="onInsert()">
						<el-icon>
							<Plus />
						</el-icon>
						<el-text>插入</el-text>
					</el-button>
				</template>
				<template #default="scope">
					<slot name="button" :row="scope.row"></slot>
					<el-button size="small" @click="onUpdate(scope.$index, scope.row)" :disabled="scope.row.type === 'submodule'">
						修改
					</el-button>
					<el-button size="small" type="danger" @click="onDelete(scope.$index, scope.row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<abstract-dialog v-model="dialogModel" :param="$props.param" @post-message="onSave" />
	</div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { Plus } from '@element-plus/icons-vue';

export interface ParamOptions {
	name: string
	isId?: boolean
	type?: string
	description?: string
	can_modify?: boolean
}

export type ParamSchema<T> = Partial<Record<keyof T, ParamOptions>>

const props = defineProps<{
	param: Partial<Record<keyof T, ParamOptions>>
	defaultValue: () => T
	data: T[]
	rowKey?: (row: T) => string
	editable?: boolean
}>()

const emit = defineEmits<{
	(e: 'update-row', row: T): void
	(e: 'delete-row', row: T): void
	(e: 'insert-row', row: T): void
}>()

const dialogModel = reactive({
	isVisible: false,
	message: 'insert',
	data: props.defaultValue() as Record<string, any>
})

const onInsert = () => {
	dialogModel.data = props.defaultValue()
	dialogModel.message = 'insert'
	dialogModel.isVisible = true
}

const onUpdate = (_: number, row: T) => {
	dialogModel.data = row
	dialogModel.message = 'update'
	dialogModel.isVisible = true
}

const onDelete = (_: number, row: T) => {
	dialogModel.message = 'delete'
	emit('delete-row', row)
}

const onSave = (message: string, data: any) => {
	if (message === 'insert') {
		emit('insert-row', data as T)
	} else if (message === 'update' && data) {
		emit('update-row', data as T)
	}
}

</script>

<style lang="scss" scoped>
.el-table {
	// width: 100%;
	margin-bottom: 20px;

	.insert-button {
		margin: 0 10px 0 10px;
	}
}
</style>