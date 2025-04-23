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
			:tree-data="templateTreeData"
			tree-title="模板详情"
			:default-expanded-keys="expandedKeys"
			@node-click="handleNodeClick"
			@node-toggle="handleNodeToggle"
			@save="handleSave"
			@create="handleCreate"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useEntityTree } from '~/composables/use-entity-tree'
import { useEntityHandlers } from '~/composables/use-entity-handlers'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { NODE_TYPES } from '~/models/entity/node-types'

// 保留原有的 keepalive 配置
definePageMeta({
	name: 'template-detail',
	keepalive: false
})

const { id } = useRoute().params
const templateId = Number(id)
const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 加载状态
const pageLoading = ref(true)

// 模板树数据
const templateTreeData = ref<TreeNodeData[]>([])

// 默认展开的节点
const expandedKeys = ref<(string | number)[]>([])

/**
 * 加载特定模板数据
 */
const loadSpecificTemplate = async () => {
	pageLoading.value = true
	try {
		// 步骤1: 使用loadTemplateById获取模板基本数据
		const { treeData: templateData } = await entityTree.loadTemplateById(templateId)
		
		if (templateData.length === 0) {
			toast.toast({
				title: "警告",
				description: "无法找到指定模板",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}

		const treeDataWithPSystem = await entityTree.loadPSystemByTemplate(templateData)
		templateTreeData.value = treeDataWithPSystem
		console.log('treeDataWithPSystem:', treeDataWithPSystem)

		const treeDataWithTemplateSpecification = await entityTree.loadSpecificationByTemplate(templateData)
		templateTreeData.value = treeDataWithTemplateSpecification
		console.log('treeDataWithTemplateSpecification:', treeDataWithTemplateSpecification)

		const treeDataWithComponent = await entityTree.loadComponentByPSystem(templateData)
		templateTreeData.value = treeDataWithComponent
		console.log('treeDataWithComponent:', treeDataWithComponent)

		const treeDataWithBom = await entityTree.loadBomByComponent(templateData)
		templateTreeData.value = treeDataWithBom
		console.log('treeDataWithBom:', treeDataWithBom)

		const treeDataWithSpecification = await entityTree.loadSpecificationByPSystem(templateData)
		templateTreeData.value = treeDataWithSpecification
		console.log('treeDataWithSpecification:', treeDataWithSpecification)

		
		// 步骤2: 使用loadEntityChildren一次性加载所有子元素
		// 由于loadEntityChildren内部会调用loadPSystemByTemplate和loadComponentByTemplate
		// 所以不需要单独调用这些方法
		// console.log('加载模板所有子元素...')
		// const { treeData: completeData } = await entityTree.loadEntityChildren(templateData, {
		// 	loadSystems: true,
		// 	loadComponents: true,
		// 	loadFullComponents: true,
		// 	loadBoms: true,
		// 	loadSpecifications: true
		// })
		
		if (templateTreeData.value.length > 0) {
			// 设置默认展开根节点
			expandedKeys.value = [templateTreeData.value[0].id]
			
			toast.toast({
				title: "成功",
				description: "模板数据加载完成",
			})
		} else {
			toast.toast({
				title: "警告",
				description: "无法加载模板子元素",
				variant: "destructive",
			})
		}
	} catch (error) {
		console.error('获取模板数据失败:', error)
		toast.toast({
			title: "错误",
			description: "获取模板数据失败",
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

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
	console.log('保存数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleSave(data, nodeType, loadSpecificTemplate)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
	console.log('创建数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleCreate(data, nodeType, loadSpecificTemplate)
}

provide('refresh', loadSpecificTemplate)

// 初始化时加载数据
onMounted(async () => {
	await loadSpecificTemplate()
})
</script>