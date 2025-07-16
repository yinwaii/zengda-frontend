<template>
	<el-dialog v-model="dialogVisible" title="添加物料" width="80%">
		<div class="flex items-center gap-2">
			<el-input v-model="searchItemStr" @update:model-value="handleSearchItem" placeholder="请输入物料名称" />
			<el-button type="primary" @click="handleSearchItem">搜索</el-button>
		</div>
		<el-table :data="searchItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe :height="'50vh'"
			style="width: 100%">
			<el-table-column prop="number" label="物料编号" />
			<el-table-column prop="name" label="物料名称" />
			<el-table-column prop="model" label="物料描述" />
			<el-table-column prop="orderPrice" label="物料单价" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button type="primary" @click="onClick(scope.row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页居中显示 -->
		<div class="flex justify-center mt-4">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="searchItems.length" />
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits<{
	(e: 'result', value: ZdItem): void
}>()
const dialogVisible = defineModel<boolean>({ required: true })
const entityApis = useEntityApis()
const searchItemStr = ref('')
const searchItems = ref<ZdItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)

const handleSearchItem = async () => {
	if (!searchItemStr.value) {
		return
	}
	console.log(currentPage.value, pageSize.value)
	searchItems.value = await entityApis.item.search(searchItemStr.value, {
		"page": {
			"current": currentPage.value,
			"size": pageSize.value
		}
	})
}
const onClick = async (item: ZdItem) => {
	if (item.itemId) {
		emit('result', item)
	}
	dialogVisible.value = false
}
</script>