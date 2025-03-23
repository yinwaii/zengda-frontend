<template>
	<shadcn-card>
		<shadcn-card-header>
			<shadcn-card-title class="text-xl font-semibold">系统信息</shadcn-card-title>
		</shadcn-card-header>
		<shadcn-card-content>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2 p-4 border rounded-lg">
					<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
					<dd class="mt-1">{{ system.createdBy || '暂无创建人' }}</dd>
				</div>
				<div class="space-y-2 p-4 border rounded-lg">
					<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
					<dd class="mt-1">{{ formatDate(system.createdTime) || '暂无创建时间' }}</dd>
				</div>
				<div class="space-y-2 p-4 border rounded-lg">
					<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
					<dd class="mt-1">{{ system.updatedBy || '暂无修改人' }}</dd>
				</div>
				<div class="space-y-2 p-4 border rounded-lg">
					<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
					<dd class="mt-1">{{ formatDate(system.updatedTime) || '暂无修改时间' }}</dd>
				</div>
			</div>
		</shadcn-card-content>
	</shadcn-card>
</template>

<script setup lang="ts">
import { ZdPSystem } from '~/models/entity/psystem'
import { formatDate } from '~/utils/date'

defineProps<{
	system: ZdPSystem
}>()
</script> 