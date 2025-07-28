<template>
	<bom-dialog v-model="dialogVisible" @result="handleAddItem" />
	<el-button type="primary" @click="dialogVisible = true">插入物料</el-button>
	<el-table stripe :data="bom?.items" title="BOM表">
		<el-table-column prop="itemId" label="物料编号" />
		<el-table-column prop="itemName" label="物料名称" />
		<el-table-column prop="itemNumber" label="物料数量">
			<template #default="scope">
				<el-input v-if="scope.row.modifying === true" v-model="scope.row.itemNumber" />
				<el-text v-else>{{ scope.row.itemNumber }}</el-text>
			</template>
		</el-table-column>
		<el-table-column label="操作">
			<template #default="scope">
				<el-button v-if="scope.row.modifying === true" type="primary"
					@click="scope.row.modifying = false; handleUpdateBom()">保存</el-button>
				<el-button v-else type="primary" @click="scope.row.modifying = true">修改</el-button>
				<el-button type="danger" @click="handleDeleteItem(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup lang="ts">
const props = defineProps<{
	bomId: number
}>()
const bom = ref<ZdBom>()
const entityApis = useEntityApis()
const dialogVisible = ref(false)

onMounted(async () => {
	await handleRefresh()
})

const handleRefresh = async () => {
	console.log(props.bomId)
	if (props.bomId)
		bom.value = await entityApis.bom.get(props.bomId)
}

const handleAddItem = async (item: ZdItem) => {
	try {
		if (bom.value && item.itemId) {
			const currItem = bom.value.items.find(curr => curr.itemId === item.itemId)
			if (currItem) {
			currItem.itemNumber += 1
		}
		else {
			bom.value.items.push({
				bomId: bom.value?.id,
				itemName: item.name,
				itemNumber: 1,
				itemId: item.itemId,
				...item
			})
		}
			await entityApis.bom.update(bom.value)
		}
	} catch (error) {
		ElMessage.error('操作失败')
	}
	ElMessage.success('操作成功')
}

const handleDeleteItem = async (item: ZdItem) => {
	ElMessageBox.confirm('确定删除该物料吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		try {
			if (bom.value && item.itemId) {
				bom.value.items = bom.value.items.filter(curr => curr.itemId !== item.itemId)
				await entityApis.bom.update(bom.value)
			}
		} catch (error) {
			ElMessage.error('操作失败')
		}
			ElMessage.success('操作成功')
	})
}
const handleUpdateBom = async () => {
	await entityApis.bom.update(bom.value)
}
</script>