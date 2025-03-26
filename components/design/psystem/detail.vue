<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ system.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ system.description || '暂无描述' }}</p>
					</div>
					<div class="flex items-center gap-2">
						<shadcn-button v-if="system.docsUrl" variant="outline" @click="showSpecificationEditor = true">
							<LucideFileText class="mr-2 h-4 w-4" />
							编辑规格
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

		<shadcn-separator />

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

		<shadcn-separator />

		<design-parameter-preview :parameters="parameters" />

		<!-- 规格书编辑器对话框 -->
		<shadcn-dialog v-model:open="showSpecificationEditor">
			<shadcn-dialog-content class="max-w-4xl">
				<shadcn-dialog-header>
					<shadcn-dialog-title>编辑规格书</shadcn-dialog-title>
					<shadcn-dialog-description>
						编辑系统规格书内容
					</shadcn-dialog-description>
				</shadcn-dialog-header>
				<div class="py-4">
					<design-specification-editor
						v-if="system.docsUrl"
						:spec-id="system.id"
						:file-tag="system.docsUrl"
						:name="system.name"
						:latest-version-id="1"
						@save="handleSpecificationSave"
					/>
				</div>
			</shadcn-dialog-content>
		</shadcn-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LucideFileText, LucidePencil } from 'lucide-vue-next'
import { ZdPSystem } from '~/models/entity/psystem'
import { ZdParameter } from '~/models/entity/parameter'
import { formatDate } from '~/utils/date'

const props = defineProps<{
	system: ZdPSystem
	isEditing: boolean
	parameters: ZdParameter[]
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

const showSpecificationEditor = ref(false)

const handleSubmit = () => {
	emit('submit', editForm.value)
}

const handleSpecificationSave = () => {
	showSpecificationEditor.value = false
}
</script> 