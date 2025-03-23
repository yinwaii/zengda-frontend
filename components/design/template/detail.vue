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
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<shadcn-label for="name">名称</shadcn-label>
								<shadcn-input id="name" v-model="editForm.name" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="productTypeId">产品类型ID</shadcn-label>
								<shadcn-input id="productTypeId" v-model="editForm.productTypeId" type="number" />
							</div>
						</div>
						<div class="space-y-2">
							<shadcn-label for="description">描述</shadcn-label>
							<shadcn-textarea id="description" v-model="editForm.description" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="specId">规格书ID</shadcn-label>
							<shadcn-input id="specId" v-model="editForm.specId" type="number" />
						</div>
						<div class="flex items-center space-x-2">
							<shadcn-checkbox id="isShow" v-model="editForm.isShow" />
							<shadcn-label for="isShow">是否显示</shadcn-label>
						</div>
						<div class="flex items-center space-x-2">
							<shadcn-checkbox id="isCustomized" v-model="editForm.isCustomized" />
							<shadcn-label for="isCustomized">是否定制</shadcn-label>
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
							<dt class="text-sm font-medium text-muted-foreground">产品类型名称</dt>
							<dd class="mt-1">{{ template.productTypeName || '暂无名称' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">规格书ID</dt>
							<dd class="mt-1">{{ template.specId || '暂无规格书' }}</dd>
						</div>
						<div class="col-span-2 space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">描述</dt>
							<dd class="mt-1">{{ template.description || '暂无描述' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
							<dd class="mt-1">{{ template.isShow ? '是' : '否' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否定制</dt>
							<dd class="mt-1">{{ template.isCustomized ? '是' : '否' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<shadcn-card>
			<shadcn-card-header>
				<shadcn-card-title class="text-xl font-semibold">模板信息</shadcn-card-title>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
						<dd class="mt-1">{{ template.createdBy || '暂无创建人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
						<dd class="mt-1">{{ formatDate(template.createdTime) || '暂无创建时间' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
						<dd class="mt-1">{{ template.updatedBy || '暂无修改人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
						<dd class="mt-1">{{ formatDate(template.updatedTime) || '暂无修改时间' }}</dd>
					</div>
				</div>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :parameters="parameters" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
// import { ZdTemplate } from '~/models/entity/template'
// import { ZdParameter } from '~/models/entity/parameter'
// import { formatDate } from '~/utils/date'

const props = defineProps<{
	template: ZdTemplate
	isEditing: boolean
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	submit: [form: Partial<ZdTemplate>]
}>()

const editForm = ref<Partial<ZdTemplate>>({
	name: props.template.name,
	description: props.template.description,
	productTypeId: props.template.productTypeId,
	isShow: props.template.isShow,
	isCustomized: props.template.isCustomized,
	specId: props.template.specId
})

const handleSubmit = () => {
	emit('submit', editForm.value)
}
</script> 