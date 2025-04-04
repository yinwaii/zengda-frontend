<template>
	<div class="space-y-0.5">
		<div v-for="(item, index) in items" :key="getKey(item)">
			<div 
				class="flex items-center w-full text-left py-1.5 px-2 hover:bg-accent/50 rounded-md group cursor-pointer transition-colors"
				:class="[
					{ 'bg-accent/30': expandedItems[getKey(item)] },
					{ 'hover:bg-accent/60': expandedItems[getKey(item)] },
				]"
				@click="toggleItem(item)"
			>
				<ChevronRight 
					v-if="hasChildren(item)"
					class="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground" 
					:class="{ 'rotate-90': expandedItems[getKey(item)] }"
				/>
				<div v-else class="w-4"></div>
				<div class="ml-2 flex-1">
					<slot name="title" :item="item">
						<span class="font-medium">{{ getTitle(item) }}</span>
					</slot>
				</div>
			</div>
			<div 
				v-show="expandedItems[getKey(item)]"
				class="relative ml-6 pl-4 border-l border-l-border"
			>
				<slot name="content" :item="item" />
				<TreeView
					v-if="hasChildren(item)"
					:items="getChildrenSafe(item)"
					:get-key="getKey"
					:get-title="getTitle"
					:get-children="getChildren"
					:depth="depth + 1"
					class="mt-0.5"
					:class="{
						'bg-accent/[0.03] p-2 rounded-md': depth === 0,
						'bg-accent/[0.06] p-2 rounded-md': depth === 1,
						'bg-accent/[0.09] p-2 rounded-md': depth === 2,
					}"
				>
					<template v-for="(_, slotName) in $slots" :key="slotName">
						<slot :name="slotName" :item="item" />
					</template>
				</TreeView>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
// import { ref, watch, useSlots } from 'vue'

export interface TreeViewItem {
	id: number
	name: string
	description?: string
	children?: TreeViewItem[] | null
}

export interface TreeViewProps {
	items: TreeViewItem[]
	getKey?: (item: TreeViewItem) => string | number
	getTitle?: (item: TreeViewItem) => string
	getChildren?: (item: TreeViewItem) => TreeViewItem[] | null | undefined
	expandedState?: Record<string | number, boolean>
	depth?: number
}

const props = withDefaults(defineProps<TreeViewProps>(), {
	items: () => [],
	getKey: (item: TreeViewItem) => item.id,
	getTitle: (item: TreeViewItem) => item.name,
	getChildren: (item: TreeViewItem) => item.children,
	expandedState: undefined,
	depth: 0,
})

const emit = defineEmits<{
	'update:expanded-state': [state: Record<string | number, boolean>]
}>()

const slots = useSlots()

// 展开状态管理
const expandedItems = ref<Record<string | number, boolean>>(props.expandedState || {})

// 监听外部传入的展开状态
watch(() => props.expandedState, (newState) => {
	if (newState) {
		expandedItems.value = { ...newState }
	}
}, { deep: true })

// 更新展开状态
const updateExpandedState = (state: Record<string | number, boolean>) => {
	Object.assign(expandedItems.value, state)
	emit('update:expanded-state', expandedItems.value)
}

// 切换节点展开状态
const toggleItem = (item: TreeViewItem) => {
	if (hasChildren(item)) {
		const key = props.getKey(item)
		expandedItems.value[key] = !expandedItems.value[key]
		emit('update:expanded-state', expandedItems.value)
	}
}

// 辅助函数，用于安全地检查是否有子节点
const hasChildren = (item: TreeViewItem): boolean => {
	const children = props.getChildren(item)
	return Array.isArray(children) && children.length > 0
}

// 辅助函数，用于安全地获取子节点数组
const getChildrenSafe = (item: TreeViewItem): TreeViewItem[] => {
	const children = props.getChildren(item)
	return Array.isArray(children) ? children : []
}

// 定义插槽
defineSlots<{
	title(props: { item: TreeViewItem }): void
	content(props: { item: TreeViewItem }): void
	[key: string]: (props: { item: TreeViewItem }) => void
}>()
</script>

<style scoped>
.group:hover .text-muted-foreground {
	@apply text-foreground;
}
</style> 