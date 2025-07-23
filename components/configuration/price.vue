<template>
	<h1>总价格：{{ priceData?.totalPrice }}</h1>
	<el-table :data="priceData?.priceItems" style="width: 100%">
		<el-table-column prop="name" label="名称" />
		<el-table-column prop="quantity" label="数量" />
		<el-table-column prop="totalPrice" label="总价" />
		<el-table-column prop="remark" label="备注" />
	</el-table>
</template>
<script setup lang="ts">
const props = defineProps<{
	configId: number
}>()
const entityApis = useEntityApis()
const priceData = ref<ZdPrice>()
const onRefresh = async () => {
	priceData.value = await entityApis.price.get(props.configId)
}
watch(() => props.configId, async () => {
	await onRefresh()
})
onMounted(async () => {
	await onRefresh()
})
</script>