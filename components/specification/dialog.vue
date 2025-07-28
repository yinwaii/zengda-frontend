<template>
	<el-dialog v-model="dialogVisible" title="选择参数" width="800" :close-on-click-modal="true">
		<div class="w-full">
			<div class="flex justify-center">
				<el-input v-model="finalSearchStr" @change="onSearch" placeholder="搜索参数" />
				<el-button type="primary" @click="onSearch">搜索</el-button>
			</div>
			<el-table :data="searchParams.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe @row-click="onSelectParam">
				<el-table-column prop="id" label="ID" width="60" />
				<el-table-column prop="name" label="参数名称" />
				<el-table-column prop="objectType" label="对象类型" />
				<el-table-column prop="objectName" label="对象名称" />
				<el-table-column prop="objectId" label="对象ID" />
			</el-table>
			<div class="flex justify-center mt-4">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="searchParams.length" />
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="tsx">
const entityApis = useEntityApis()
const props = defineProps<{
	searchStr: string
}>()
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = defineModel<boolean>('dialogVisible')
const searchParams = ref<ZdSearchParam[]>([])
const finalSearchStr = ref<string>(props.searchStr)
const emit = defineEmits<{
	(e: 'submit', paramId: number): void
}>()
const onSearch = async () => {
	searchParams.value = await entityApis.searchParam.search(finalSearchStr.value)
}
const onSelectParam = (row: ZdSearchParam) => {
	dialogVisible.value = false
	console.log(row.id)
	emit('submit', row.id)
}
</script>