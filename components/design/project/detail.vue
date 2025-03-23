<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">项目详情</h2>
			<div class="flex items-center gap-2">
				<template v-if="isEditing">
					<shadcn-button variant="outline" @click="$emit('cancel')">取消</shadcn-button>
					<shadcn-button @click="handleSubmit">保存</shadcn-button>
				</template>
				<template v-else>
					<shadcn-button @click="$emit('edit')">编辑</shadcn-button>
				</template>
			</div>
		</div>

		<shadcn-card>
			<shadcn-card-content class="pt-6">
				<template v-if="isEditing">
					<form @submit.prevent="handleSubmit" class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<shadcn-label for="name">名称</shadcn-label>
								<shadcn-input id="name" v-model="form.name" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="description">描述</shadcn-label>
								<shadcn-input id="description" v-model="form.description" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="productType">产品类型</shadcn-label>
								<shadcn-select v-model="form.productTypeId">
									<shadcn-select-trigger>
										<shadcn-select-value :placeholder="getProductTypeName(form.productTypeId)" />
									</shadcn-select-trigger>
									<shadcn-select-content>
										<shadcn-select-item v-for="type in productTypes" :key="type.id" :value="type.id">
											{{ type.name }}
										</shadcn-select-item>
									</shadcn-select-content>
								</shadcn-select>
							</div>
							<div class="space-y-2">
								<shadcn-label for="template">模板</shadcn-label>
								<shadcn-select v-model="form.templateId">
									<shadcn-select-trigger>
										<shadcn-select-value :placeholder="getTemplateName(form.templateId)" />
									</shadcn-select-trigger>
									<shadcn-select-content>
										<shadcn-select-item v-for="template in templates" :key="template.id" :value="template.id">
											{{ template.name }}
										</shadcn-select-item>
									</shadcn-select-content>
								</shadcn-select>
							</div>
							<div class="space-y-2">
								<shadcn-label for="quantity">数量</shadcn-label>
								<shadcn-input id="quantity" v-model="form.quantity" type="number" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="model">型号</shadcn-label>
								<shadcn-input id="model" v-model="form.model" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="attention">注意事项</shadcn-label>
								<shadcn-input id="attention" v-model="form.attention" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="company">公司</shadcn-label>
								<shadcn-input id="company" v-model="form.company" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="tel">电话</shadcn-label>
								<shadcn-input id="tel" v-model="form.tel" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="mob">手机</shadcn-label>
								<shadcn-input id="mob" v-model="form.mob" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="fax">传真</shadcn-label>
								<shadcn-input id="fax" v-model="form.fax" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="email">邮箱</shadcn-label>
								<shadcn-input id="email" v-model="form.email" type="email" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="number">编号</shadcn-label>
								<shadcn-input id="number" v-model="form.number" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="date">日期</shadcn-label>
								<shadcn-input id="date" v-model="form.date" type="date" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="valid">有效期</shadcn-label>
								<shadcn-input id="valid" v-model="form.valid" type="date" />
							</div>
							<div class="space-y-2">
								<shadcn-label for="price">价格</shadcn-label>
								<shadcn-input id="price" v-model="form.price" type="number" />
							</div>
						</div>
					</form>
				</template>
				<template v-else>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">名称</div>
							<div>{{ project.name }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">描述</div>
							<div>{{ project.description }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">产品类型</div>
							<div>{{ getProductTypeName(project.productTypeId) }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">模板</div>
							<div>{{ getTemplateName(project.templateId) }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">数量</div>
							<div>{{ project.quantity }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">型号</div>
							<div>{{ project.model }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">注意事项</div>
							<div>{{ project.attention }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">公司</div>
							<div>{{ project.company }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">电话</div>
							<div>{{ project.tel }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">手机</div>
							<div>{{ project.mob }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">传真</div>
							<div>{{ project.fax }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">邮箱</div>
							<div>{{ project.email }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">编号</div>
							<div>{{ project.number }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">日期</div>
							<div>{{ project.date }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">有效期</div>
							<div>{{ project.valid }}</div>
						</div>
						<div class="space-y-1">
							<div class="text-sm font-medium text-muted-foreground">价格</div>
							<div>{{ project.price }}</div>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
	project: ZdProject
	isEditing: boolean
}>()

const emit = defineEmits<{
	(e: 'edit'): void
	(e: 'cancel'): void
	(e: 'submit', form: Partial<ZdProject>): void
}>()

const entityApis = useEntityApis()
const form = ref<Partial<ZdProject>>({})
const productTypes = ref<ZdProductType[]>([])
const templates = ref<ZdTemplate[]>([])

// 获取产品类型名称
const getProductTypeName = (id: number | undefined) => {
	if (!id) return '未知类型'
	const type = productTypes.value.find((t: ZdProductType) => t.id === id)
	return type?.name || '未知类型'
}

// 获取模板名称
const getTemplateName = (id: number | undefined) => {
	if (!id) return '未知模板'
	const template = templates.value.find((t: ZdTemplate) => t.id === id)
	return template?.name || '未知模板'
}

// 处理表单提交
const handleSubmit = () => {
	emit('submit', form.value)
}

// 监听 project 变化，更新表单
watch(() => props.project, (newProject) => {
	form.value = { ...newProject }
}, { immediate: true })

// 获取产品类型和模板列表
const fetchData = async () => {
	try {
		const [productTypeResponse, templateResponse] = await Promise.all([
			entityApis.ptype.getAll(),
			entityApis.template.getByPage(0, 100)
		])
		productTypes.value = productTypeResponse
		templates.value = templateResponse.content
	} catch (error) {
		console.error('获取数据失败:', error)
	}
}

onMounted(() => {
	fetchData()
})
</script> 