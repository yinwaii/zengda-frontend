<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">{{ component?.name }}</h2>
						<p class="text-sm text-muted-foreground mt-1">{{ component?.description || '暂无描述' }}</p>
					</div>
					<div class="flex items-center gap-2">
						<shadcn-button variant="outline" @click="isExpanded = !isExpanded">
							<LucideChevronDown v-if="!isExpanded" class="h-4 w-4" />
							<LucideChevronUp v-else class="h-4 w-4" />
							{{ isExpanded ? '收起' : '展开' }}
						</shadcn-button>
						<shadcn-button @click="isEditing = true">
							<LucidePencil class="mr-2 h-4 w-4" />
							编辑
						</shadcn-button>
					</div>
				</div>
			</shadcn-card-header>
			<shadcn-card-content v-show="isExpanded">
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
							<shadcn-label for="isRequired">是否必须</shadcn-label>
							<shadcn-checkbox id="isRequired" v-model="editForm.isRequired" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="bomId">默认BOM</shadcn-label>
							<shadcn-select v-model="editForm.bomId">
								<shadcn-select-trigger>
									<shadcn-select-value placeholder="请选择BOM" />
								</shadcn-select-trigger>
								<shadcn-select-content>
									<shadcn-select-item v-for="bom in bomOptions" :key="bom.id" :value="bom.id">
										BOM {{ bom.id }}
									</shadcn-select-item>
								</shadcn-select-content>
							</shadcn-select>
						</div>
						<div class="space-y-2">
							<shadcn-label for="price">价格计算公式/默认价格</shadcn-label>
							<shadcn-input id="price" v-model="editForm.price" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="compValue">价格</shadcn-label>
							<shadcn-input id="compValue" v-model="editForm.compValue" />
						</div>
						<div class="flex justify-end gap-2">
							<shadcn-button type="button" variant="outline" @click="isEditing = false">
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
							<dt class="text-sm font-medium text-muted-foreground">是否显示</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="component.isShow ? 'default' : 'outline'">
									{{ component.isShow ? '是' : '否' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">是否必须</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="component.isRequired ? 'default' : 'outline'">
									{{ component.isRequired ? '是' : '否' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">价格计算公式/默认价格</dt>
							<dd class="mt-1">{{ component.price || '未设置' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">价格</dt>
							<dd class="mt-1">{{ component.compValue || '未设置' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">BOM ID</dt>
							<!--<dd class="mt-1">{{ hasBom ? (bomData ? bomData.id : '未关联BOM') : '未关联BOM' }}</dd> -->
							<dd class="mt-1">{{ component.bomId || '未关联BOM' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(component.createdTime) || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(component.updatedTime) || '暂无' }}</dd>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="component.id" type="component" />
	</div>
</template>

<script setup lang="ts">
import { LucidePencil, LucideChevronDown, LucideChevronUp } from 'lucide-vue-next'
import { toRaw, ref, computed, watch } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdComponent } from '~/models/entity/component'
import type { ZdParameter } from '~/models/entity/parameter'
import type { ZdBom } from '~/models/entity/bom'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { useEntityApis } from '~/composables/use-entity-apis'
import { useToast } from '~/components/ui/toast'
const props = defineProps<{
	data: TreeNodeData,
	component: ZdComponent,
	parameters?: ZdParameter[],
	bom?: ZdBom
}>()

// api获取bom列表
const bomIds = ref<number[]>([ 1, 2, 3])

// 计算组件数据，优先使用component，如果不存在则从data中提取
const component = computed(() => {
  if (props.component) return props.component
  return props.data && props.data.originalData ? props.data.originalData : props.data || {}
})

const entityApis = useEntityApis()
const toast = useToast()
const bomOptions = ref<ZdBom[]>([])
// 加载BOM选项
const loadBomOptions = async (componentId: number) => {
	try {
		const bomIds = await entityApis.bom.getByComponentId(componentId)
		if (!bomIds || bomIds.length === 0) {
			bomOptions.value = []
			return
		}

		// 并行获取所有BOM的详细信息
		const bomDetailsPromises = bomIds.map((bomId: any) => entityApis.bom.get(bomId))
		const bomDetails = await Promise.all(bomDetailsPromises)

		// 过滤掉可能的null值并更新bomOptions
		bomOptions.value = bomDetails.filter(bom => bom !== null)

		console.log('加载BOM选项:', {
			componentId,
			optionsCount: bomOptions.value.length,
			options: bomOptions.value
		})

		// 获取组件详情以设置默认BOM
		const component = await entityApis.component.get(componentId)
		console.log('组件详情:', component)

		if (component?.bomId) {
			editForm.value.bomId = component.bomId
			console.log('设置默认BOM:', component.bomId)
		}
	} catch (error) {
		console.error('加载BOM选项失败:', error)
		toast.toast({
			title: '错误',
			description: '加载BOM选项失败',
			variant: 'destructive'
		})
	}
}

// // 获取关联的BOM数据
// const bomData = computed(() => {
//   if (props.bom) return props.bom
//   return props.data && props.data.bomData ? props.data.bomData : null
// })

// 检查是否有BOM数据
const hasBom = computed(() => {
  return !!component.value.bomId || !!bomOptions.value
})

const emit = defineEmits<{
	save: [form: Partial<ZdComponent>]
}>()

const isEditing = ref(false)
const isExpanded = ref(false)

const editForm = ref<Partial<ZdComponent>>({
	name: component.value.name,
	description: component.value.description,
	isShow: component.value.isShow,
	isRequired: component.value.isRequired,
	price: component.value.price,
	compValue: component.value.compValue,
	bomId: component.value.bomId
})

// 监听组件数据变化，更新表单
watch(() => component.value, (newComponent) => {
  if (newComponent) {
    editForm.value = {
      id: newComponent.id,
      name: newComponent.name,
      description: newComponent.description,
      isShow: newComponent.isShow,
      isRequired: newComponent.isRequired,
      price: newComponent.price,
      compValue: newComponent.compValue,
      bomId: newComponent.bomId
    }
  }
}, { immediate: true })

onMounted(() => {
	loadBomOptions(toApiId(component.value.id) || 0)
})

const handleSubmit = (event: Event) => {
  if (event) event.preventDefault()
  
  isEditing.value = false
  
  // 获取编辑表单中的数据
  const formData = toRaw(editForm.value)
  
  // 创建新对象，确保包含id
  const updatedData: Partial<ZdComponent> = {
    id: component.value.id,
    ...formData
  }
  
  // 使用 JSON 序列化再解析来创建普通对象的深拷贝，移除 Proxy
  const plainData = JSON.parse(JSON.stringify(updatedData))
  
  console.log('发送修改后的组件数据:', plainData)
  emit('save', plainData)
}
</script> 