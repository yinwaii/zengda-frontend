<template>
	<div class="p-4 h-full">
		<div v-if="pageLoading" class="flex items-center justify-center h-full">
			<div class="animate-pulse flex space-x-4">
				<div class="rounded-full bg-accent-foreground/10 h-10 w-10"></div>
				<div class="flex-1 space-y-3 py-1">
					<div class="h-2 bg-accent-foreground/10 rounded"></div>
					<div class="space-y-1">
						<div class="h-2 bg-accent-foreground/10 rounded"></div>
					</div>
				</div>
			</div>
		</div>
		
		<design-dynamic-entity-tree
			v-else
			:tree-data="psystemTreeData"
			tree-title="模块详情"
			:default-expanded-keys="expandedKeys"
			@node-click="handleNodeClick"
			@node-toggle="handleNodeToggle"
			@save="handleSave"
			@create="handleCreate"
		/>
	</div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast'
import { useEntityTree } from '~/composables/use-entity-tree'
import { useEntityHandlers } from '~/composables/use-entity-handlers'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { NODE_TYPES } from '~/models/entity/node-types'
import type { ZdComponent } from '~/models/entity/component'

// 添加 keepalive 配置
definePageMeta({
	name: 'psystem-detail',
	// 禁用缓存，减少内存占用
	keepalive: false,
	// 禁用页面过渡动画
	pageTransition: false
})

const { id } = useRoute().params
const psystemId = Number(id)
const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 模块树数据
const psystemTreeData = ref<TreeNodeData[]>([])

// 添加页面初始加载状态
const pageLoading = ref(true)

// 默认展开的节点
const expandedKeys = ref<(string | number)[]>([])

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
	console.log('保存数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleSave(data, nodeType, loadSpecificPSystem)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
	console.log('创建数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleCreate(data, nodeType, loadSpecificPSystem)
}

/**
 * 加载特定模块数据
 */
const loadSpecificPSystem = async () => {
	pageLoading.value = true
	try {
		console.log('开始加载模块数据...')
		// 步骤1: 使用loadPSystemById获取模块基本数据
		const { treeData: psystemData } = await entityTree.loadPSystemById(psystemId)
		
		if (psystemData.length === 0) {
			toast.toast({
				title: "警告",
				description: "无法找到指定模块",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}

		psystemTreeData.value = psystemData
		// 设置根节点为选中状态
		if (psystemData.length > 0) {
			handleNodeClick(psystemData[0])
			// 设置默认展开的节点
			expandedKeys.value = [psystemData[0].id]
		}

		console.log('当前树数据:', psystemData)

		const psystemWithComponent = await entityTree.loadComponentByPSystem(psystemTreeData.value)
		console.log('psystemWithComponent:', psystemWithComponent)
		psystemTreeData.value = psystemWithComponent
		
		// 如果有组件节点，将它们也加入到展开列表中
		const rootNode = psystemTreeData.value[0]
		if (rootNode && rootNode.children && rootNode.children.length > 0) {
			rootNode.children.forEach(child => {
				if (child.id) {
					expandedKeys.value.push(child.id)
				}
			})
		}

		const psystemWithBom = await entityTree.loadBomByComponent(psystemTreeData.value)
		console.log('psystemWithBom:', psystemWithBom)
		psystemTreeData.value = psystemWithBom

		const psystemWithSpecification = await entityTree.loadSpecificationByPSystem(psystemTreeData.value)
		console.log('psystemWithSpecification:', psystemWithSpecification)
		psystemTreeData.value = psystemWithSpecification

		handleNodeClick(psystemTreeData.value[0])
	} catch (error) {
		console.error('获取模块数据失败:', error)
		toast.toast({
			title: "错误",
			description: "获取模块数据失败",
			variant: "destructive",
		})
	} finally {
		pageLoading.value = false
	}
}

/**
 * 处理节点点击
 */
const handleNodeClick = (node: TreeNodeData) => {
	console.log('节点点击:', node)
	// 这里可以添加额外的处理逻辑
}

/**
 * 处理节点展开/折叠
 */
const handleNodeToggle = (node: TreeNodeData, expanded: boolean) => {
	console.log('节点切换:', node, expanded ? '展开' : '折叠')
	// 这里可以添加额外的处理逻辑
}

provide('refresh', loadSpecificPSystem)

// 初始化时加载数据
onMounted(async () => {
	await loadSpecificPSystem()
})
</script> 