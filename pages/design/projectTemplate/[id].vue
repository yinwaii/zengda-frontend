<template>
	<div class="flex gap-4 p-4">
		<div class="flex-1">
			<PSystemTree :items="treeData" />
		</div>
		<div class="w-80 border rounded-lg p-4">
			<h3 class="text-lg font-semibold mb-4">组件信息</h3>
			<div v-if="components.length" class="space-y-4">
				<div v-for="comp in components" :key="comp.id" class="p-3 border rounded-md">
					<div class="font-medium">组件ID: {{ comp.componentId }}</div>
					<div class="text-sm text-muted-foreground mt-1">
						<div>系统ID: {{ comp.psystemId }}</div>
						<div v-if="comp.description" class="mt-1">{{ comp.description }}</div>
					</div>
				</div>
			</div>
			<div v-else class="text-muted-foreground text-sm">
				暂无组件信息
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import PSystemTree from '~/components/design/template/PSystemTree.vue'
import { ZdPSystem } from '~/models/entity/psystem'
import { ZdTComponent } from '~/models/entity/tcompoment'
import { useEntityApis } from '~/composables/use-entity-apis'

// 添加 keepalive 配置
definePageMeta({
	name: 'psystem-detail'
})

const { id } = useRoute().params
const data = ref<ZdPSystem[]>([])
const components = ref<ZdTComponent[]>([])
const entityApis = useEntityApis()

// 将扁平列表转换为树形结构，并关联组件
const buildTree = (items: ZdPSystem[]): (ZdPSystem & { components?: ZdTComponent[] })[] => {
	return items.map(item => ({
		...item,
		children: item.children ? buildTree(item.children) : null,
		parameters: item.parameters ? [...item.parameters] : null,
		components: components.value.filter(comp => comp.psystemId === item.id)
	}))
}

// 计算树形数据
const treeData = computed(() => buildTree(data.value))

onMounted(async () => {
	try {
		const [systemResponse, componentResponse] = await Promise.all([
			entityApis.template_psystem.getByTemplateId(Number(id)),
			entityApis.template_component.getByTemplateId(Number(id))
		])
		data.value = systemResponse.list
		components.value = componentResponse.list
	} catch (error) {
		console.error('获取数据失败:', error)
	}
})
</script>