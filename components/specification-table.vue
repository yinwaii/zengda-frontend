<template>
	<div class="w-full">
		<el-table :data="paramMapping.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
			@row-click="onClick">
			<el-table-column prop="specId" label="ID" width="60" />
			<el-table-column prop="parameterId" label="参数ID" />
			<el-table-column prop="specParamName" label="模板名称" />
			<el-table-column label="操作">
				<!-- <template #default="scope">
					<el-button type="primary" @click="onEditComponent(scope.row)">编辑</el-button>
					<el-button type="danger" @click="onDeleteComponent(scope.row)">删除</el-button>
				</template> -->
			</el-table-column>
		</el-table>
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="paramMapping.length" />
		</div>
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
const onRefresh = async () => {
	paramMapping.value = await entityApis.paramMapping.getAll(props.specificationId)
}
onMounted(async () => {
	await onRefresh()
})

const onClick = (row: ZdSpecTagMap) => {
	console.log(row)
}
</script>