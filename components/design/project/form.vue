<template>
	<form @submit.prevent="handleSubmit" class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-2">
				<shadcn-label for="name">名称</shadcn-label>
				<shadcn-input id="name" v-model="form.name" required />
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ZdProject } from '~/models/entity/project'
import type { ZdProductType } from '~/models/entity/productType'
import type { ZdTemplate } from '~/models/entity/template'
import { useEntityApis } from '~/composables/use-entity-apis'

const props = defineProps<{
	project?: ZdProject
}>()

const emit = defineEmits<{
	(e: 'submit', form: Partial<ZdProject>): void
	(e: 'cancel'): void
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
	if (newProject) {
		form.value = { ...newProject }
	} else {
		form.value = {
			id: 0,
			name: '',
			description: '',
			productTypeId: 0,
			templateId: 0,
			quantity: 0,
			model: '',
			attention: '',
			company: '',
			tel: '',
			mob: '',
			fax: '',
			email: '',
			number: '',
			date: '',
			valid: '',
			price: '0'
		}
	}
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