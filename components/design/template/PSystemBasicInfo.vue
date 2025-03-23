<template>
	<shadcn-card>
		<shadcn-card-header>
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold">{{ system.name }}</h2>
					<p class="text-sm text-muted-foreground mt-1">{{ system.description || '暂无描述' }}</p>
				</div>
				<div class="flex items-center gap-2">
					<shadcn-button v-if="system.docsUrl" variant="outline" as-child>
						<a :href="system.docsUrl" target="_blank">
							<LucideFileText class="mr-2 h-4 w-4" />
							查看文档
						</a>
					</shadcn-button>
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
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<shadcn-label for="name">名称</shadcn-label>
							<shadcn-input id="name" v-model="editForm.name" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="parentId">父ID</shadcn-label>
							<shadcn-input id="parentId" v-model="editForm.parentId" type="number" disabled />
						</div>
					</div>
					<div class="space-y-2">
						<shadcn-label for="description">描述</shadcn-label>
						<shadcn-textarea id="description" v-model="editForm.description" />
					</div>
					<div class="space-y-2">
						<shadcn-label for="docsUrl">文档链接</shadcn-label>
						<shadcn-input id="docsUrl" v-model="editFormDocsUrl" />
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
						<dd class="mt-1">{{ system.id }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">父ID</dt>
						<dd class="mt-1">{{ system.parentId }}</dd>
					</div>
					<div class="col-span-2 space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">描述</dt>
						<dd class="mt-1">{{ system.description || '暂无描述' }}</dd>
					</div>
					<div class="col-span-2 space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">文档链接</dt>
						<dd class="mt-1">{{ system.docsUrl || '暂无文档' }}</dd>
					</div>
				</div>
			</template>
		</shadcn-card-content>
	</shadcn-card>
</template>

<script setup lang="ts">
import { ZdPSystem } from '~/models/entity/psystem'
import { LucideFileText, LucidePencil } from 'lucide-vue-next'

const props = defineProps<{
	system: ZdPSystem
	isEditing: boolean
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	submit: [form: Partial<ZdPSystem>]
}>()

const editForm = ref<Partial<ZdPSystem>>({
	name: props.system.name,
	description: props.system.description,
	docsUrl: props.system.docsUrl,
	parentId: props.system.parentId
})

const editFormDocsUrl = computed({
	get: () => editForm.value.docsUrl || '',
	set: (value) => {
		editForm.value.docsUrl = value
	}
})

const handleSubmit = () => {
	emit('submit', editForm.value)
}
</script> 