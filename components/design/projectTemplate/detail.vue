<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ projectTemplate.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ projectTemplate.description || '暂无描述' }}</p>
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
						<div class="space-y-2">
							<shadcn-label for="isPublic">是否公开</shadcn-label>
							<shadcn-checkbox id="isPublic" v-model="editForm.isPublic" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="version">版本</shadcn-label>
							<shadcn-input id="version" v-model="editForm.version" />
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
							<dd class="mt-1">{{ projectTemplate.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">版本</dt>
							<dd class="mt-1">{{ projectTemplate.version }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否公开</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="projectTemplate.isPublic ? 'default' : 'outline'">
									{{ projectTemplate.isPublic ? '是' : '否' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(projectTemplate.createdTime) || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(projectTemplate.updatedTime) || '暂无' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :parameters="parameters || []" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdParameter } from '~/models/entity/parameter'

// 定义项目模板类型，根据实际情况调整
interface ProjectTemplate {
  id?: number
  name: string
  description?: string
  isPublic: boolean
  version: string
  createdTime?: string
  updatedTime?: string
  createdBy?: string
  updatedBy?: string
}

const props = defineProps<{
	projectTemplate: ProjectTemplate
	isEditing: boolean
	parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	submit: [form: Partial<ProjectTemplate>]
}>()

const editForm = ref<Partial<ProjectTemplate>>({
	name: props.projectTemplate.name,
	description: props.projectTemplate.description,
	isPublic: props.projectTemplate.isPublic,
	version: props.projectTemplate.version
})

const handleSubmit = () => {
	emit('submit', editForm.value)
}
</script> 