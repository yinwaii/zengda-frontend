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
							<shadcn-label for="parentId">父系统</shadcn-label>
							<shadcn-select v-model="editForm.parentId">
								<shadcn-select-trigger>
									<shadcn-select-value :placeholder="parentSystems.length ? '选择父系统' : '无父系统'" />
								</shadcn-select-trigger>
								<shadcn-select-content>
									<shadcn-select-group>
										<shadcn-select-item :value="-1">无父系统</shadcn-select-item>
										<shadcn-select-item 
											v-for="parent in parentSystems" 
											:key="parent.id" 
											:value="parent.id"
											:disabled="parent.id === system.id"
										>
											{{ parent.name }}
										</shadcn-select-item>
									</shadcn-select-group>
								</shadcn-select-content>
							</shadcn-select>
						</div>
						<div class="space-y-2">
							<shadcn-label for="docsUrl">文档链接</shadcn-label>
							<shadcn-input id="docsUrl" :value="editForm.docsUrl || ''" @update:model-value="editForm.docsUrl = typeof $event === 'number' ? String($event) : $event" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="isDeleted">已删除</shadcn-label>
							<shadcn-checkbox 
								id="isDeleted" 
								:model-value="Boolean(editForm.isDeleted)" 
								@update:model-value="editForm.isDeleted = $event === 'indeterminate' ? false : $event" 
							/>
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
							<dt class="text-sm font-medium text-muted-foreground">父系统</dt>
							<dd class="mt-1">{{ getParentSystemName(system.parentId) }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">文档链接</dt>
							<dd class="mt-1">
								<a 
									v-if="system.docsUrl" 
									:href="system.docsUrl" 
									target="_blank" 
									class="text-blue-500 hover:underline"
								>
									{{ system.docsUrl }}
								</a>
								<span v-else>暂无链接</span>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">状态</dt>
							<dd class="mt-1">
								<shadcn-badge :variant="system.isDeleted ? 'destructive' : 'default'">
									{{ system.isDeleted ? '已删除' : '正常' }}
								</shadcn-badge>
							</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg" v-if="system.specId !== null">
							<dt class="text-sm font-medium text-muted-foreground">规格ID</dt>
							<dd class="mt-1">{{ system.specId }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
							<dd class="mt-1">{{ formatDate(system.createdTime) || '暂无' }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
							<dd class="mt-1">{{ formatDate(system.updatedTime) || '暂无' }}</dd>
						</div>
					</div>
					
					<div v-if="system.children && system.children.length > 0" class="mt-8">
						<h3 class="text-lg font-medium mb-4">子系统</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div 
								v-for="child in system.children" 
								:key="child.id" 
								class="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
							>
								<h4 class="font-medium">{{ child.name }}</h4>
								<p class="text-sm text-muted-foreground mt-1 line-clamp-2">
									{{ child.description || '暂无描述' }}
								</p>
							</div>
						</div>
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="system.id" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toRaw } from 'vue'
import { LucidePencil } from 'lucide-vue-next'
import { formatDate } from '~/utils/date'
import type { ZdPSystem } from '~/models/entity/psystem'
import type { ZdParameter } from '~/models/entity/parameter'
import type { TreeNodeData } from '~/components/abstract/tree/types'

const props = defineProps<{
	system: ZdPSystem
	isEditing: boolean
	parameters?: ZdParameter[]
	data?: TreeNodeData // 可选的树节点数据
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdPSystem>]
}>()

const parentSystems = ref<ZdPSystem[]>([])
const entityApis = useEntityApis()

// 计算属性，处理系统数据
const system = computed(() => {
	// 优先使用直接传入的system
	return props.system || {}
})

// 获取可选父系统列表
onMounted(async () => {
	try {
		const response = await entityApis.psystem.getAll(true)
		parentSystems.value = response || []
	} catch (error) {
		console.error('获取产品系统列表失败:', error)
		parentSystems.value = []
	}
})

// 获取父系统名称
const getParentSystemName = (parentId: number) => {
	if (parentId === -1) return '无父系统'
	const parent = parentSystems.value.find(p => p.id === parentId)
	return parent ? parent.name : `系统ID: ${parentId}`
}

const editForm = ref<Partial<ZdPSystem>>({
	name: system.value.name,
	description: system.value.description,
	parentId: system.value.parentId,
	docsUrl: system.value.docsUrl,
	isDeleted: system.value.isDeleted
})

const handleSubmit = (event: Event) => {
	// 阻止表单默认提交行为
	if (event) event.preventDefault()
	
	// 确保有原始ID
	const originalId = system.value.id
	
	// 创建更新对象，确保包含必要字段
	const updatedData = {
		...toRaw(system.value),
		...toRaw(editForm.value),
		id: originalId,
		originalId: originalId
	} as (Partial<ZdPSystem> & { originalId: number })
	
	// 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	console.log('发送修改后的系统数据:', plainData)
	emit('save', plainData)
}
</script> 