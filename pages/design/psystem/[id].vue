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
			tree-title="产品系统详情"
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
import { useEntityTree } from '@/composables/useEntityTree'
import { useEntityHandlers } from '@/composables/useEntityHandlers'
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

// 产品系统树数据
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
 * 加载特定产品系统数据
 */
const loadSpecificPSystem = async () => {
	pageLoading.value = true
	try {
		console.log('开始加载产品系统数据...')
		// 步骤1: 使用loadPSystemById获取产品系统基本数据
		const { treeData: psystemData } = await entityTree.loadPSystemById(psystemId)
		
		if (psystemData.length === 0) {
			toast.toast({
				title: "警告",
				description: "无法找到指定产品系统",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}

		psystemTreeData.value = psystemData

		console.log('当前树数据:', psystemData)
		
		// // 步骤2: 加载所有PSystem节点的组件数据
		// console.log('加载组件数据...')

		// // 使用DFS搜索所有PSystem节点
		// const findPSystemNodes = (nodes: TreeNodeData[]): TreeNodeData[] => {
		// 	let result: TreeNodeData[] = []
		// 	for (const node of nodes) {
		// 		// 检查当前节点是否为PSystem节点
		// 		if (node.type === NODE_TYPES.PSYSTEM) {
		// 			result.push(node)
		// 		}
		// 		// 递归处理子节点
		// 		if (node.children && node.children.length > 0) {
		// 			result = result.concat(findPSystemNodes(node.children))
		// 		}
		// 	}
		// 	return result
		// }

		// // 确保根节点被包含在搜索中
		// const psystemNodes = findPSystemNodes(currentTreeData)
			
		// console.log(`找到 ${psystemNodes.length} 个PSystem节点 ${psystemNodes}`)

		// // 为每个PSystem节点加载组件数据
		// for (const psystemNode of psystemNodes) {
		// 	try {
		// 		const psystemId = toApiId(psystemNode.id)
		// 		console.log('psystemId:', psystemId, psystemNode)
		// 		if (!psystemId) continue

		// 		// 获取该PSystem下的所有组件
		// 		const response = await entityApis.psystem_component.getAll(toApiId(psystemId))
		// 		console.log('获取组件数据:', toApiId(psystemId), response)
		// 		// if (!response || !response.list || response.list.length === 0) continue

		// 		const componentNodes: TreeNodeData[] = []
		// 		// 转换组件数据为树节点
		// 		for (const componentId of response) {
		// 			console.log('componentId:', componentId)
		// 			const component = await entityApis.component.get(componentId)
		// 			// 使用工厂函数创建组件节点
		// 			const componentNode = entityTree.componentTreeNodeFactory({
		// 				...component,
		// 				id: component.id,
		// 				type: NODE_TYPES.COMPONENT
		// 			})
		// 			componentNodes.push(componentNode)
		// 		}
		// 		console.log('componentNodes:', componentNodes)

		// 		// 将组件节点添加到PSystem节点下
		// 		psystemNode.children = (psystemNode.children || []).concat(componentNodes)
		// 		console.log(`为PSystem ${psystemId} 添加了 ${componentNodes.length} 个组件节点`)
		// 	} catch (err) {
		// 		console.error(`加载PSystem ${psystemNode.id} 的组件数据失败:`, err)
		// 	}
		// }
		
		// // 步骤3: 加载所有PSystem节点的规格数据
		// console.log('加载规格数据...')
		// // 使用新增的loadSpecificationByPSystem递归遍历所有PSystem节点，获取并加载规格
		// currentTreeData = await entityTree.loadSpecificationByPSystem(currentTreeData)
		
		// if (currentTreeData.length > 0) {
		// 	// 更新树数据
		// 	psystemTreeData.value = currentTreeData
			
		// 	// 设置默认展开根节点
		// 	const expandKeys = [currentTreeData[0].id]
		// 	// 如果有子节点，将第一层子节点也设为展开
		// 	if (currentTreeData[0].children && currentTreeData[0].children.length > 0) {
		// 		expandKeys.push(currentTreeData[0].children[0].id)
		// 	}
		// 	expandedKeys.value = expandKeys
			
		// 	toast.toast({
		// 		title: "成功",
		// 		description: "产品系统数据加载完成",
		// 	})
		// } else {
		// 	toast.toast({
		// 		title: "警告",
		// 		description: "无法加载产品系统子元素",
		// 		variant: "destructive",
		// 	})
		// }
	} catch (error) {
		console.error('获取产品系统数据失败:', error)
		toast.toast({
			title: "错误",
			description: "获取产品系统数据失败",
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