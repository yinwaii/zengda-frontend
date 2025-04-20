<template>
	<div class="space-y-6">
		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold">物料清单</h2>
						<p class="text-sm text-muted-foreground mt-1">编号: {{ bom.number }} - 版本: {{ bom.version }}</p>
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
							<shadcn-label for="number">编号</shadcn-label>
							<shadcn-input id="number" v-model="editForm.number" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="version">版本</shadcn-label>
							<shadcn-input id="version" v-model="editForm.version" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="componentId">组件ID</shadcn-label>
							<shadcn-input id="componentId" v-model="editForm.componentId" type="number" />
						</div>
						<div class="space-y-2">
							<shadcn-label for="note">备注</shadcn-label>
							<shadcn-textarea id="note" v-model="editForm.note" />
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
							<dd class="mt-1">{{ bom.id }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">编号</dt>
							<dd class="mt-1">{{ bom.number }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">版本</dt>
							<dd class="mt-1">{{ bom.version }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">组件ID</dt>
							<dd class="mt-1">{{ bom.componentId }}</dd>
						</div>
						<div class="space-y-2 p-4 border rounded-lg">
							<dt class="text-sm font-medium text-muted-foreground">备注</dt>
							<dd class="mt-1">{{ bom.note || '暂无备注' }}</dd>
						</div>
					</div>
					
					<h3 class="text-lg font-medium mt-8 mb-4">子物料项</h3>
					<div v-if="bom.items && bom.items.length > 0">
						<ul class="space-y-3">
							<li v-for="item in bom.items" :key="item.itemId" class="flex justify-between p-3 border rounded-lg">
								<div>
									<span class="font-medium">{{ item.itemName }}</span>
									<p v-if="item.note" class="text-sm text-muted-foreground mt-1">{{ item.note }}</p>
								</div>
								<shadcn-badge>ID: {{ item.itemId }}</shadcn-badge>
							</li>
						</ul>
					</div>
					<div v-else class="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
						暂无子物料项
					</div>
				</template>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<shadcn-card>
			<shadcn-card-header>
				<shadcn-card-title class="text-xl font-semibold">BOM信息</shadcn-card-title>
			</shadcn-card-header>
			<shadcn-card-content>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建人</dt>
						<dd class="mt-1">{{ bom.createdBy || '暂无创建人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">创建时间</dt>
						<dd class="mt-1">{{ formatDate(bom.createdTime) || '暂无创建时间' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改人</dt>
						<dd class="mt-1">{{ bom.updatedBy || '暂无修改人' }}</dd>
					</div>
					<div class="space-y-2 p-4 border rounded-lg">
						<dt class="text-sm font-medium text-muted-foreground">修改时间</dt>
						<dd class="mt-1">{{ formatDate(bom.updatedTime) || '暂无修改时间' }}</dd>
					</div>
				</div>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<shadcn-card>
			<shadcn-card-header>
				<div class="flex items-center justify-between">
					<shadcn-card-title class="text-xl font-semibold">BOM表信息</shadcn-card-title>
					<shadcn-button size="sm" @click="handleAddItem">
						<LucidePlus class="mr-2 h-4 w-4" />
						添加物料
					</shadcn-button>
				</div>
			</shadcn-card-header>
			<shadcn-card-content>
				<abstract-data-table
					:columns="bomItemColumns"
					:data="bom.items || []"
					search-column="itemName"
					search-placeholder="根据物料名称检索..."
				/>
			</shadcn-card-content>
		</shadcn-card>

		<shadcn-separator />

		<design-parameter-preview :nodeId="bom.id" type="bom" />
	</div>
	
	<!-- 物料项查看/编辑对话框 -->
	<design-bom-item-dialog
		v-model:is-open="itemDialogOpen"
		:is-editing="itemDialogMode === 'edit'"
		:item="selectedBomItem"
		title="查看物料详情"
		description="查看BOM中的物料项信息"
		@submit="handleItemSubmit"
	>
		<div class="grid grid-cols-2 gap-4" v-if="selectedBomItem">
			<div class="space-y-2 p-4 border rounded-lg">
				<dt class="text-sm font-medium text-muted-foreground">物料ID</dt>
				<dd class="mt-1">{{ selectedBomItem.itemId }}</dd>
			</div>
			<div class="space-y-2 p-4 border rounded-lg">
				<dt class="text-sm font-medium text-muted-foreground">物料名称</dt>
				<dd class="mt-1">{{ selectedBomItem.itemName }}</dd>
			</div>
			<div class="col-span-2 space-y-2 p-4 border rounded-lg">
				<dt class="text-sm font-medium text-muted-foreground">备注</dt>
				<dd class="mt-1">{{ selectedBomItem.note || '暂无备注' }}</dd>
			</div>
		</div>
	</design-bom-item-dialog>
	
	<!-- 物料详情查询对话框 -->
	<design-bom-item-query
		v-model:is-open="itemQueryDialogOpen"
		:item-id="selectedItemId"
	/>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { resolveComponent, toRaw } from 'vue'
import { LucidePencil, LucidePlus } from 'lucide-vue-next'
import type { ZdBom, ZdBomChild } from '~/models/entity/bom'
import type { ZdParameter } from '~/models/entity/parameter'
import { formatDate } from '~/utils/date'
import { packHeader } from '~/models/column'

// 导入自定义组件
import DesignBomItemDialog from '~/components/design/bom/item-dialog.vue'
import DesignBomItemQuery from '~/components/design/bom/item-query.vue'
import DesignBomItemActions from '~/components/design/bom/item-actions.vue'

const props = defineProps<{
	bom: ZdBom
	isEditing: boolean
	parameters: ZdParameter[]
}>()

const emit = defineEmits<{
	edit: []
	cancel: []
	save: [form: Partial<ZdBom>]
}>()

const entityApis = useEntityApis()
const editForm = ref<Partial<ZdBom>>({
	number: props.bom.number,
	version: props.bom.version,
	componentId: props.bom.componentId,
	note: props.bom.note,
})

// 物料项对话框状态
const itemDialogOpen = ref(false)
const itemDialogMode = ref<'view' | 'add' | 'edit'>('view')
const selectedBomItem = ref<ZdBomChild | undefined>(undefined)
const selectedItemIndex = ref<number>(-1)

// 物料查询对话框状态
const itemQueryDialogOpen = ref(false)
const selectedItemId = ref<number>(0)

// 处理查看物料项
const handleViewItem = (item: ZdBomChild, index: number) => {
	selectedBomItem.value = { ...item }
	selectedItemIndex.value = index
	itemDialogMode.value = 'view'
	itemDialogOpen.value = true
}

// 处理编辑物料项
const handleEditItem = (item: ZdBomChild, index: number) => {
	selectedBomItem.value = { ...item }
	selectedItemIndex.value = index
	itemDialogMode.value = 'edit'
	itemDialogOpen.value = true
}

// 处理删除物料项
const handleDeleteItem = async (item: ZdBomChild, index: number) => {
	if (!confirm('确定要删除此物料项吗？')) return
	
	try {
		// 创建一个新的BOM对象，移除指定索引的物料项
		const updatedBom: ZdBom = {
			...toRaw(props.bom),
			items: [...(props.bom.items || [])]
		}
		
		if (updatedBom.items && updatedBom.items.length > index) {
			updatedBom.items.splice(index, 1)
		}
		
		// 调用API更新BOM
		await entityApis.bom.update(updatedBom)
		
		// 发出事件通知更新
		emit('save', updatedBom)
	} catch (error) {
		console.error('删除物料项失败:', error)
		alert('删除物料项失败，请重试')
	}
}

// 处理添加物料项
const handleAddItem = () => {
	selectedBomItem.value = {
		bomId: props.bom.id,
		itemId: 0,
		itemName: '',
		note: ''
	}
	selectedItemIndex.value = -1
	itemDialogMode.value = 'edit'
	itemDialogOpen.value = true
}

// 处理物料项查询
const handleQueryItem = (item: ZdBomChild) => {
	selectedItemId.value = item.itemId
	itemQueryDialogOpen.value = true
}

// 处理物料项表单提交
const handleItemSubmit = async (updatedItem: ZdBomChild) => {
	try {
		console.log('更新前的BOM数据:', props.bom)
		// 创建一个新的BOM对象，更新或添加物料项
		const updatedBom: ZdBom = {
			...toRaw(props.bom),
			items: [...(props.bom.items || [])]
		}
		console.log('更新后的BOM数据:', updatedBom)
		
		if (!updatedBom.items) {
			updatedBom.items = []
		}

		updatedItem.bomId = toApiId(props.bom.id) ?? 0
		
		if (selectedItemIndex.value >= 0) {
			// 更新现有物料项
			updatedBom.items[selectedItemIndex.value] = updatedItem
		} else {
			// 添加新物料项
			updatedBom.items.push(updatedItem)
		}
		
		// 调用API更新BOM
		console.log('发送修改后的BOM数据:', updatedBom)
		updatedBom.id = toApiId(props.bom.id) ?? 0
		await entityApis.bom.update(updatedBom)
		
		// 发出事件通知更新
		emit('save', updatedBom)
	} catch (error) {
		console.error('更新物料项失败:', error)
		alert('更新物料项失败，请重试')
	}
}

// BOM表格的列定义
const bomItemColumns = computed(() => [
	{
		accessorKey: 'itemId',
		header: packHeader<ZdBomChild>('物料ID'),
		meta: { width: '100px' }
	},
	{
		accessorKey: 'itemName',
		header: packHeader<ZdBomChild>('物料名称'),
		meta: { width: '180px' }
	},
	{
		accessorKey: 'note',
		header: packHeader<ZdBomChild>('备注'),
		meta: { width: '200px' }
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }: { row: any }) => {
			const item = row.original as ZdBomChild
			const index = props.bom.items ? props.bom.items.findIndex(i => 
				i.itemId === item.itemId && i.bomId === item.bomId
			) : -1
			return h('div', { class: 'flex justify-end' }, [
				h(resolveComponent('design-bom-item-actions'), {
					onView: () => handleViewItem(item, index),
					onEdit: () => handleEditItem(item, index),
					onDelete: () => handleDeleteItem(item, index),
					onQuery: () => handleQueryItem(item)
				})
			])
		},
		meta: { width: '80px' }
	}
])

const handleSubmit = (event: Event) => {
	// 阻止表单默认提交行为
	if (event) event.preventDefault()
	
	// 确保有原始ID
	const originalId = props.bom.id
	
	// 创建更新对象，确保包含必要字段
	const updatedData = {
		...toRaw(props.bom),
		...toRaw(editForm.value),
		id: originalId,
		originalId: originalId
	} as (Partial<ZdBom> & { originalId: number })
	
	// 使用JSON序列化再解析创建普通对象深拷贝，移除Proxy
	const plainData = JSON.parse(JSON.stringify(updatedData))
	
	console.log('发送修改后的BOM数据:', plainData)
	emit('save', plainData)
}
</script> 