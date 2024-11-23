<template>
	<el-table :data="tableData" stripe row-key="id" default-expand-all>
		<el-table-column prop="id" label="顺序号" />
		<el-table-column prop="name" label="字段名称" />
		<el-table-column prop="label" label="字段描述" />
		<el-table-column prop="description" label="字段备注" />
		<el-table-column prop="unit" label="单位" />
	</el-table>
</template>

<script lang="ts" setup>
import args from 'assets/data/args';

interface User {
	id: number
	name?: string
	label?: string
	description?: string
	unit: string
	hasChildren?: boolean
	children?: User[]
}

const tableData: User[] = args;
</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;
}
</style>