<template>
	<div class="abstract-tree">
		<div class="abstract-tree-menu">
			<el-button size="small" @click="onInsert"><el-icon>
					<Plus />
				</el-icon></el-button>
			<el-button size="small" @click="onDelete"><el-icon>
					<Minus />
				</el-icon></el-button>
			<el-button size="small" @click="onUpdate"><el-icon>
					<Edit />
				</el-icon></el-button>
		</div>
		<el-tree :data="data" ref="abstractTree" node-key="id" :props="{ label: 'name' }" default-expand-all
			:expand-on-click-node="false" :indent="8" @current-change="afterSelected" />
		<abstract-dialog v-model="dialogModel" :param="$props.param" @post-message="onSave" />
	</div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { Plus, Minus, Edit } from '@element-plus/icons-vue';

const props = defineProps<{
	param: Partial<Record<keyof T, ParamOptions>>
	defaultValue: () => T
	data: T[]
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

const abstractTree = useTemplateRef('abstractTree');
const afterSelected = inject<(node: T) => void>('afterSelectedTree', (node: T) => {})

const onInsert = async () => {
	const node = abstractTree.value?.getCurrentNode()
	if (node) {
		console.log(node.id)
	}
	dialogModel.data = props.defaultValue()
	dialogModel.message = 'insert'
	dialogModel.isVisible = true
}
const onDelete = async () => {
	const node = abstractTree.value?.getCurrentNode()
	if (node) {
		dialogModel.message = 'delete'
		emit('delete-row', node as T)
	}
}
const onUpdate = async () => {
	const node = abstractTree.value?.getCurrentNode()
	if (node) {
		dialogModel.data = node as T
		dialogModel.message = 'update'
		dialogModel.isVisible = true
	}
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
.abstract-tree {
	background-color: white;

	.abstract-tree-menu {
		text-align: right;
		padding: 0 10px 0 10px;
	}
}
</style>