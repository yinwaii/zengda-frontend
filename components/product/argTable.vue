<template>
	<el-table :data="tableData" stripe row-key="id">
		<el-table-column prop="id" label="顺序号" />
		<el-table-column prop="name" label="字段名称" />
		<el-table-column prop="type" label="字段类型" />
	</el-table>
</template>

<script lang="ts" setup>
import args from 'assets/data/args';

interface User {
	id: number
	name?: string
	type?: string
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