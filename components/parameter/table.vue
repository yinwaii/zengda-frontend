<template>
	<div class="w-full">
		<div class="flex items-center gap-2">
			<el-button type="primary" @click="handleNew">新建参数</el-button>
		</div>
		<el-table v-if="parameter" stripe :data="parameter">
			<el-table-column prop="id" label="ID" width="50" />
			<el-table-column prop="name" label="参数名称" />
			<el-table-column prop="dtype" label="参数类型" />
			<el-table-column prop="value" label="参数值" />
			<el-table-column prop="description" label="参数描述" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<parameter-dialog v-model="parameterDialogVisible" :parameter="dialogParameter" @submit="handleSubmit" />
	</div>
</template>

<script setup lang="ts">

const props = defineProps<{
	objType: string,
	objId: number
}>()
const parameter = ref<ZdParameter[]>()
const entityApis = useEntityApis()
const parameterDialogVisible = ref(false)
const dialogParameter = ref<Partial<ZdParameter> | null>(null)
onMounted(async () => {
	await handleRefresh()
})

const handleRefresh = async () => {
	parameter.value = await entityApis.parameter.get(props.objId, props.objType)
}

const handleNew = () => {
	dialogParameter.value = null
	parameterDialogVisible.value = true
}

const handleEdit = (row: ZdParameter) => {
	dialogParameter.value = row
	parameterDialogVisible.value = true
}

const handleDelete = async (row: ZdParameter) => {
	ElMessageBox.confirm('确定删除该参数吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
	try {
		await entityApis.parameter.delete(row.id)
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
	})
}

const handleSubmit = async (parameter: Partial<ZdParameter>) => {
	try {
		if (dialogParameter.value === null) {
			parameter.objectId = props.objId
			parameter.objectType = props.objType
		await entityApis.parameter.create(parameter)
	} else {
		await entityApis.parameter.update(parameter)
		}
		await handleRefresh()
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}

</script>