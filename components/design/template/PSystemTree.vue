<template>
	<TreeView
		:items="mappedItems"
		:get-key="getKey"
		:get-title="getTitle"
		:get-children="getChildren"
		v-model:expanded-state="expandedState"
		class="rounded-lg border bg-card p-4"
	>
		<template #title="{ item }">
			<div class="flex items-center gap-2">
				<component 
					:is="isComponent(item) ? PuzzleIcon : FolderIcon" 
					:class="[
						'h-4 w-4 shrink-0',
						isComponent(item) ? 'text-blue-500' : 'text-muted-foreground'
					]"
				/>
				<span class="font-medium">{{ (item as ExtendedTreeViewItem).name }}</span>
				<span 
					v-if="(item as ExtendedTreeViewItem).description" 
					class="text-sm text-muted-foreground truncate max-w-[400px]"
				>
					{{ (item as ExtendedTreeViewItem).description }}
				</span>
			</div>
		</template>
		<template #content="{ item }">
			<div v-if="getParameters(item as ExtendedTreeViewItem)?.length" class="flex flex-wrap gap-1.5 my-2">
				<shadcn-badge 
					v-for="param in getParameters(item as ExtendedTreeViewItem)" 
					:key="param.id" 
					variant="outline"
					class="text-xs bg-background/50"
				>
					<span class="font-medium">{{ param.name }}:</span>
					<span class="ml-1 opacity-85">{{ param.value }}</span>
				</shadcn-badge>
			</div>
		</template>
	</TreeView>
</template>

<script setup lang="ts">
import type { ZdPSystem } from '~/models/entity/psystem'
import type { TreeViewItem } from '~/components/abstract/TreeView.vue'
import type { ZdTComponent } from '~/models/entity/tcompoment'
import TreeView from '~/components/abstract/TreeView.vue'
import { computed, ref } from 'vue'
import { FolderIcon, PuzzleIcon } from 'lucide-vue-next'

interface ExtendedTreeViewItem extends TreeViewItem {
	_original: ZdPSystem | ZdTComponent
	_type: 'system' | 'component'
}

const props = defineProps<{
	items: (ZdPSystem & { components?: ZdTComponent[] })[]
}>()

// 展开状态管理
const expandedState = ref<Record<string | number, boolean>>({})

// 将 ZdPSystem 映射到 TreeViewItem
const mappedItems = computed(() => mapToTreeViewItems(props.items))

function mapToTreeViewItems(items: (ZdPSystem & { components?: ZdTComponent[] })[]): TreeViewItem[] {
	return items.map(item => {
		const systemItem: ExtendedTreeViewItem = {
			id: item.id,
			name: item.name,
			description: item.description,
			children: item.children ? mapToTreeViewItems(item.children) : null,
			_original: item,
			_type: 'system'
		}

		// 如果有组件，添加为子节点
		if (item.components?.length) {
			const componentItems: ExtendedTreeViewItem[] = item.components.map(comp => ({
				id: comp.id,
				name: `组件 ${comp.componentId}`,
				description: comp.description,
				children: null,
				_original: comp,
				_type: 'component'
			}))
			
			systemItem.children = systemItem.children 
				? [...systemItem.children, ...componentItems]
				: componentItems
		}

		return systemItem
	})
}

// 类型安全的辅助函数
const getKey = (item: TreeViewItem): number => (item as ExtendedTreeViewItem).id
const getTitle = (item: TreeViewItem): string => (item as ExtendedTreeViewItem).name
const getChildren = (item: TreeViewItem): TreeViewItem[] | null => (item as ExtendedTreeViewItem).children || null
const getParameters = (item: ExtendedTreeViewItem) => item._type === 'system' ? (item._original as ZdPSystem).parameters : null
const isComponent = (item: TreeViewItem): boolean => (item as ExtendedTreeViewItem)._type === 'component'
</script> 