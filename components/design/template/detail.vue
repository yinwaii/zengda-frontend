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
							<shadcn-label for="productTypeId">产品类型</shadcn-label>
							<shadcn-select v-model="editForm.productTypeId">
								<shadcn-select-trigger>
									<shadcn-select-value :placeholder="productTypes.length ? '选择产品类型' : '暂无产品类型'" />
								</shadcn-select-trigger>
								<shadcn-select-content>
									<shadcn-select-group>
										<shadcn-select-item v-for="type in productTypes" :key="type.id" :value="type.id">
											{{ type.name }}
										</shadcn-select-item>
									</shadcn-select-group>
								</shadcn-select-content>
							</shadcn-select>
						</div>
						<div class="space-y-2">
							<shadcn-label for="isShow">是否显示</shadcn-label>
							<shadcn-checkbox id="isShow" v-model="editForm.isShow" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="isCustomized">是否定制</shadcn-label>
							<shadcn-checkbox id="isCustomized" v-model="editForm.isCustomized" />
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
							<dt class="text-sm font-medium text-muted-foreground">产品类型</dt>
							<dd class="mt-1">{{ getProductTypeName(template.productTypeId) }}</dd>
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
						<div class="space-y-2 p-4 border rounded-lg" v-if="template.specId">
							<dt class="text-sm font-medium text-muted-foreground">规格书ID</dt>
							<dd class="mt-1">{{ template.specId }}</dd>
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

		<design-parameter-preview :parameters="parameters || []" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdTemplate } from '~/models/entity/template'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdPType } from '~/models/entity/ptype'

const props = defineProps<{
	template: ZdTemplate
	isEditing: boolean
	parameters?: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	submit: [form: Partial<ZdTemplate>]
}>()

const productTypes = ref<ZdPType[]>([])
const entityApis = useEntityApis()

// 获取产品类型列表
onMounted(async () => {
	try {
		const response = await entityApis.ptype.getAll()
		productTypes.value = response || []
	} catch (error) {
		console.error('获取产品类型失败:', error)
		productTypes.value = []
	}
})

const getProductTypeName = (typeId: number) => {
	const productType = productTypes.value.find(type => type.id === typeId)
	return productType ? productType.name : `类型ID: ${typeId}`
}

const editForm = ref<Partial<ZdTemplate>>({
	name: props.template.name,
	description: props.template.description,
	productTypeId: props.template.productTypeId,
	isShow: props.template.isShow,
	isCustomized: props.template.isCustomized
})

const handleSubmit = () => {
	emit('submit', editForm.value)
}
</script> 