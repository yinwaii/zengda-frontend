<template>
	<el-dialog v-model="centerDialogVisible" title="修改" width="500" align-center center>
		<el-form label-position="left" label-width="80px">
			<el-form-item label="参数名">
				<el-input v-model="arg.name" />
			</el-form-item>
			<el-form-item label="参数类型">
				<el-select v-model="arg.type" placeholder="请选择参数类型">
					<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="默认值">
				<el-input v-model="arg.default_exp" />
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="arg.description" />
			</el-form-item>
			<el-form-item label="是否可修改">
				<el-switch v-model="arg.can_modify" />
			</el-form-item>
			<el-form-item label="是否可用">
				<el-switch v-model="arg.visible" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="onSave">保存</el-button>
				<el-button @click="centerDialogVisible = false">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
const centerDialogVisible = defineModel<boolean>()
const props = defineProps({
	arg: { type: Object as PropType<ModuleParams>, required: true },
	module_id: { type: Number, required: true }
})
const typeOptions = [
	{ value: 'string', label: '字符串' },
	{ value: 'number', label: '数字' },
	{ value: 'enum', label: '枚举' },
	{ value: 'boolean', label: '布尔' },
	{ value: 'file', label: '文件' },
	{ value: 'pair', label: '键值对' },
]
const api = useApi();
const onSave = () => {
	centerDialogVisible.value = false;
	console.log(props.arg);
	if (props.arg.id === -1)
		api.arguments.insert(props.arg);
	else
		api.arguments.patch(props.arg.id, props.arg);
}
</script>