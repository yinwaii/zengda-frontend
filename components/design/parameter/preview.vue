<template>
	<shadcn-card>
		<shadcn-card-header>
			<shadcn-card-title>参数列表</shadcn-card-title>
		</shadcn-card-header>
		<shadcn-card-content>
			<shadcn-table v-if="parameters.length > 0">
				<shadcn-table-header>
					<shadcn-table-row>
						<shadcn-table-head>参数名</shadcn-table-head>
						<shadcn-table-head>描述</shadcn-table-head>
						<shadcn-table-head>值</shadcn-table-head>
						<shadcn-table-head>类型</shadcn-table-head>
					</shadcn-table-row>
				</shadcn-table-header>
				<shadcn-table-body>
					<shadcn-table-row v-for="param in parameters" :key="param.id">
						<shadcn-table-cell>{{ param.name }}</shadcn-table-cell>
						<shadcn-table-cell>{{ param.description || '-' }}</shadcn-table-cell>
						<shadcn-table-cell>{{ param.value }}</shadcn-table-cell>
						<shadcn-table-cell>{{ param.dtype || '-' }}</shadcn-table-cell>
					</shadcn-table-row>
				</shadcn-table-body>
			</shadcn-table>
			<div v-else class="text-center text-muted-foreground py-4">
				暂无参数
			</div>
		</shadcn-card-content>
	</shadcn-card>
</template>

<script setup lang="ts">
import { ZdParameter } from '~/models/entity/parameter'

defineProps<{
	parameters: ZdParameter[]
}>()
</script> 