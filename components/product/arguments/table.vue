<template>
	<el-table :data="rootArgument.children" default-expand-all stripe row-key="id">
		<el-table-column label="字段名称" min-width="100" fixed="left">
			<template #default="scope">
				<el-input v-if="scope.row.isEditing" v-model="scope.row.name" style="width: 70%" />
				<el-text v-else>{{ scope.row.name }}</el-text>
			</template>
		</el-table-column>
		<el-table-column label="字段类型">
			<template #default="scope">
				<el-select v-if="scope.row.isEditing" v-model="scope.row.type" style="width: 70%">
					<el-option v-for="(item, index) in typeOptions" :key="index" :label="item" :value="item" />
				</el-select>
				<el-text v-else>{{ scope.row.type }}</el-text>
			</template>
		</el-table-column>
		<el-table-column label="默认值">
			<template #default="scope">
				<el-input v-if="scope.row.isEditing" v-model="scope.row.default" style="width: 70%" />
				<el-text v-else>{{ scope.row.default }}</el-text>
			</template>
		</el-table-column>
		<el-table-column label="是否可用">
			<template #default="scope">
				<el-switch :disabled="!scope.row.isEditing" v-model="scope.row.isEnabled" />
			</template>
		</el-table-column>
		<el-table-column label="是否可修改">
			<template #default="scope">
				<el-switch :disabled="!scope.row.isEditing" v-model="scope.row.isEditable" />
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="Operations" min-width="120">
			<template #default="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">
					{{ scope.row.isEditing === true ? '保存' : '修改' }}
				</el-button>
				<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
					删除
				</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts" setup>
import { type Argument, rootArgument, typeOptions } from 'assets/data/args'

const handleEdit = (_: number, row: Argument) => {
	row.isEditing = !(row.isEditing??false)
}
const handleDelete = (index: number, row: Argument) => {
	console.log(index, row)
}
</script>

<style lang="scss" scoped>
.el-table {
	width: 100%;
	margin-bottom: 20px;
}
</style>