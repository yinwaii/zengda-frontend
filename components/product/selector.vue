<template>
	<el-descriptions title="产品信息" border>
		<template #extra>
			<el-text size="large">型号： </el-text>
			<el-cascader placeholder="直接输入编号可搜索" :options="options" filterable !show-all-levels />
			<el-button type="primary">确认</el-button>
		</template>
		<el-descriptions-item label="Username">kooriookami</el-descriptions-item>
		<el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
		<el-descriptions-item label="Place">Suzhou</el-descriptions-item>
		<el-descriptions-item label="Remarks">
			<el-tag size="small">School</el-tag>
		</el-descriptions-item>
		<el-descriptions-item label="Address">
			No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
		</el-descriptions-item>
	</el-descriptions>
</template>

<script lang="ts" setup>
import options from 'assets/data/product';
</script>

<style lang="scss" scoped>
</style>