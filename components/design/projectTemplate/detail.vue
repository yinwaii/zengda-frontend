<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ template.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ template.description || '暂无描述' }}</p>
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
							<shadcn-label for="isShow">是否显示</shadcn-label>
							<shadcn-checkbox id="isShow" v-model="editForm.isShow" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="isCustomized">是否定制</shadcn-label>
							<shadcn-checkbox id="isCustomized" v-model="editForm.isCustomized" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="productTypeId">产品类型ID</shadcn-label>
							<shadcn-input id="productTypeId" v-model="editForm.productTypeId" type="number" />
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
							<dd class="mt-1">{{ template.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">产品类型ID</dt>
							<dd class="mt-1">{{ template.productTypeId }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="template.isShow ? 'default' : 'outline'">
									{{ template.isShow ? '是' : '否' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否定制</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="template.isCustomized ? 'default' : 'outline'">
									{{ template.isCustomized ? '是' : '否' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(template.createdTime) || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(template.updatedTime) || '暂无' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="template.id || 0" />
	</div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdTemplate } from '~/models/entity/template'

const props = defineProps<{
	template: ZdTemplate
	isEditing: boolean
	parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdTemplate>]
}>()

const editForm = ref<Partial<ZdTemplate>>({
	name: props.template.name,
	description: props.template.description,
	isShow: props.template.isShow,
	isCustomized: props.template.isCustomized,
	productTypeId: props.template.productTypeId
})

const handleSubmit = (event: Event) => {
	// 阻止表单默认提交行为
	if (event) event.preventDefault()
	
	// 确保有原始ID
	const originalId = props.template.id
	
	// 创建更新对象，确保包含必要字段
	const updatedData = {
		...toRaw(props.template),
		...toRaw(editForm.value),
		id: originalId,
		originalId: originalId
	} as (Partial<ZdTemplate> & { originalId: number })
	
	// 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	console.log('发送修改后的模板数据:', plainData)
	emit('save', plainData)
}
</script> 