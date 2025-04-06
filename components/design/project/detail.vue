<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ project.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ project.description || '暂无描述' }}</p>
					</div>
					<div class="flex items-center gap-2">
						<shadcn-button @click="$emit('edit')">
							<LucidePencil class="mr-2 h-4 w-4" />
							编辑
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<template v-if="isEditing">
					<form @submit.prevent="handleSubmit" class="space-y-4">
						<div class="space-y-2">
							<shadcn-label for="name">名称</shadcn-label>
							<shadcn-input id="name" v-model="editForm.name" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="description">描述</shadcn-label>
							<shadcn-textarea id="description" v-model="editForm.description" />
						</div>
						<div class="flex justify-end gap-2">
							<shadcn-button type="button" variant="outline" @click="$emit('cancel')">
								取消
							</shadcn-button>
							<shadcn-button type="submit">
								保存
							</shadcn-button>
						</div>
					</form>
				</template>
				<template v-else>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">ID</dt>
							<dd class="mt-1">{{ project.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
							<dd class="mt-1">{{ project.createdBy || '暂无创建人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(project.createdTime) || '暂无创建时间' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
							<dd class="mt-1">{{ project.updatedBy || '暂无修改人' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(project.updatedTime) || '暂无修改时间' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :parameters="parameters" />
	</div>
</template>

<script setup lang="ts">
import { LucidePencil } from 'lucide-vue-next'
import { toRaw, computed, ref } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdProject } from '~/models/entity/project'
import type { ZdParameter } from '~/models/entity/parameter'
import type { TreeNodeData } from '~/components/abstract/tree/types'

const props = defineProps<{
	project: ZdProject
	isEditing: boolean
	parameters: ZdParameter[]
	data?: TreeNodeData // 可选的树节点数据
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdProject>]
}>()

// 计算属性，处理项目数据
const project = computed(() => {
	// 优先使用直接传入的project
	return props.project || {}
})

const editForm = ref<Partial<ZdProject>>({
	name: project.value.name,
	description: project.value.description
})

const handleSubmit = (event: Event) => {
	// 阻止表单默认提交行为
	if (event) event.preventDefault()
	
	// 确保有原始ID
	const originalId = project.value.id
	
	// 创建更新对象，确保包含必要字段
	const updatedData = {
		...toRaw(project.value),
		...toRaw(editForm.value),
		id: originalId,
		originalId: originalId
	} as (Partial<ZdProject> & { originalId: number })
	
	// 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	console.log('发送修改后的项目数据:', plainData)
	emit('save', plainData)
}
</script> 