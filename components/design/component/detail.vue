<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ component.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ component.description || '暂无描述' }}</p>
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
								<shadcn-label for="price">价格</shadcn-label>
								<shadcn-input id="price" v-model="editForm.price" />
							</div>
						</div>
						<div class="space-y-2">
							<shadcn-label for="description">描述</shadcn-label>
							<shadcn-textarea id="description" v-model="editForm.description" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="value">数量</shadcn-label>
							<shadcn-input id="value" v-model="editForm.value" />
						</div>
						<div class="flex items-center space-x-2">
							<shadcn-checkbox id="isShow" v-model="editForm.isShow" />
							<shadcn-label for="isShow">是否显示</shadcn-label>
						</div>
						<div class="flex items-center space-x-2">
							<shadcn-checkbox id="isRequired" v-model="editForm.isRequired" />
							<shadcn-label for="isRequired">是否必须</shadcn-label>
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
							<dd class="mt-1">{{ component.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">价格</dt>
							<dd class="mt-1">{{ component.price || '暂无价格' }}</dd>
						</div>
						<div class="col-span-2 space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">描述</dt>
							<dd class="mt-1">{{ component.description || '暂无描述' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">数量</dt>
							<dd class="mt-1">{{ component.value || '暂无数量' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
							<dd class="mt-1">{{ component.isShow ? '是' : '否' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否必须</dt>
							<dd class="mt-1">{{ component.isRequired ? '是' : '否' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<shadcn-card>
			<shadcn-card-header>
				<shadcn-card-title class="text-xl font-semibold">组件信息</shadcn-card-title>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
						<dd class="mt-1">{{ component.createdBy || '暂无创建人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
						<dd class="mt-1">{{ formatDate(component.createdTime) || '暂无创建时间' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
						<dd class="mt-1">{{ component.updatedBy || '暂无修改人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
						<dd class="mt-1">{{ formatDate(component.updatedTime) || '暂无修改时间' }}</dd>
					</div>
				</div>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<parameter-preview :parameters="parameters" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { ZdComponent } from '~/models/entity/component'
import { ZdParameter } from '~/models/entity/parameter'
import { formatDate } from '~/utils/date'
import ParameterPreview from '~/components/design/parameter/preview.vue'

const props = defineProps<{
	component: ZdComponent
	isEditing: boolean
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	submit: [form: Partial<ZdComponent>]
}>()

const editForm = ref<Partial<ZdComponent>>({
	name: props.component.name,
	description: props.component.description,
	price: props.component.price,
	value: props.component.value,
	isShow: props.component.isShow,
	isRequired: props.component.isRequired
})

const handleSubmit = () => {
	emit('submit', editForm.value)
}
</script> 