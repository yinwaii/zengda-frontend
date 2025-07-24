<template>
	<div class="w-full">
		<el-table :data="paramMapping.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe width="60">
			<el-table-column prop="specId" label="ID" width="60" />
			<el-table-column prop="specParamName" label="模板名称" />
			<el-table-column prop="parameterId" label="参数ID" width="70" />
			<el-table-column prop="param.name" label="参数名称" />
			<el-table-column prop="param.description" label="参数描述" />
			<el-table-column prop="param.value" label="参数默认值" width="80" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="onEditComponent(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeleteComponent(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="paramMapping.length" />
		</div>
		<specification-dialog v-model="dialogVisible" :search-str="searchStr" @submit="onSelectParam" />
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	specificationId: number
}>()
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const entityApis = useEntityApis()
const paramMapping = ref<ZdSpecTagMap[]>(await entityApis.paramMapping.getAll(props.specificationId))
const dialogVisible = ref<boolean>(false)
const selectedSpecMap = ref<ZdSpecTagMap>()	
const searchStr = ref<string>('')
const onSelectParam = async (paramId: number) => {
	dialogVisible.value = false
	console.log(paramId)
	if (selectedSpecMap.value) {
		selectedSpecMap.value.parameterId = paramId
		await entityApis.paramMapping.update(props.specificationId, selectedSpecMap.value)
	}
	paramMapping.value = await entityApis.paramMapping.getAll(props.specificationId)
}
const onRefresh = async () => {
	paramMapping.value = await entityApis.paramMapping.getAll(props.specificationId)
	console.log(paramMapping.value)
}
onMounted(async () => {
	await onRefresh()
})

const onEditComponent = (row: ZdSpecTagMap) => {
	searchStr.value = row.specParamName
	selectedSpecMap.value = row
	dialogVisible.value = true
}
const onDeleteComponent = async (row: ZdSpecTagMap) => {
	await entityApis.paramMapping.delete(row.specId, row.specParamName)
	paramMapping.value = await entityApis.paramMapping.getAll(props.specificationId)
}

</script>