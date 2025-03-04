<template>
	<!-- <div class="abstract-table"> -->
		<el-table-column fixed="right" min-width="120" align="center">
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
		<Teleport to="body">
			<basic-dialog>
				<slot></slot>
			</basic-dialog>
		</Teleport>
	<!-- </div> -->
</template>

<script lang="ts" setup generic="T">
import { Plus } from '@element-plus/icons-vue';
import type { UnwrapRef } from 'vue';

// const props = defineProps<{
// 	scope: any
// }>()

const updateRow = inject<{(row: UnwrapRef<T>): void}>('update-row');
const deleteRow = inject<{(row: UnwrapRef<T>): void}>('delete-row');
const insertRow = inject<{(row: UnwrapRef<T>): void}>('insert-row');
const constructor = inject<{(): T}>('constructor');

const onClick = () => {
	if (dialogData.message === 'update' && updateRow) {
		updateRow(formData.value)
	}
	if (dialogData.message === 'insert' && insertRow) {
		insertRow(formData.value)
	}
}

const formData = ref(constructor?constructor():{} as T)
const isVisible = ref(false)

const onInsert = () => {
	dialogData.message = 'insert'
	formData.value = constructor?constructor():{} as T
	isVisible.value = true
}

const onUpdate = (_: number, row: UnwrapRef<T>) => {
	dialogData.message = 'update'
	formData.value = row
	isVisible.value = true
}

const onDelete = (_: number, row: UnwrapRef<T>) => {
	dialogData.message = 'delete'
	if (deleteRow)
		deleteRow(row)
}

const dialogData = reactive({
	isVisible,
	message: 'insert',
	onClick
})

provide('dialog-data', dialogData)
provide('form-data', formData.value)

</script>

<style lang="scss" scoped>
	.insert-button {
		margin: 0 10px 0 10px;
	}
</style>