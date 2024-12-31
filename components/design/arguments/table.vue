<template>
	<el-table :data="$props.arg.children" stripe :row-key="(row: ModuleParams) => row.name+row.id">
		<el-table-column prop="name" label="字段名称" min-width="100" fixed="left" />
		<el-table-column prop="type" label="字段类型" />
		<el-table-column prop="default_exp" label="默认值" />
		<el-table-column prop="description" label="备注" />
		<el-table-column prop="visible" label="是否可见" />
		<el-table-column fixed="right" label="Operations" min-width="120">
			<template #default="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.type === 'submodule'">
					修改
				</el-button>
				<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
					删除
				</el-button>
			</template>
		</el-table-column>
	</el-table>
	<el-button class="mt-4" style="width: 100%" @click="handleInsert">
		添加新参数
	</el-button>
	<design-arguments-modify-dialog v-model="isVisible" :arg="dialogParam" :module_id="10" />
</template>

<script lang="ts" setup>
import { renderToWebStream } from 'vue/server-renderer';

defineProps({
	arg: { type: Object as PropType<ModuleParams>, required: true }
});
const isVisible = ref(false);
const dialogParam = ref<ModuleParams>({ id: -1, name: '', type: '', default_exp: '', can_modify: true, visible: true });

const handleEdit = (_: number, row: ModuleParams) => {
	console.log(toRaw(row), typeof(row));
	dialogParam.value = row;
	isVisible.value = true;
}
const handleDelete = (index: number, row: ModuleParams) => {
	console.log(index, row)
}

const handleInsert = () => {
	// props.arg.children.push()
	dialogParam.value = { id: -1, name: '', type: '', default_exp: '', can_modify: true, visible: true };
	isVisible.value = true;
}
</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;
}
</style>