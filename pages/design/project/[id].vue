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
			:tree-data="projectTreeData"
			tree-title="项目详情"
			:default-expanded-keys="expandedKeys"
			@node-click="handleNodeClick"
			@node-toggle="handleNodeToggle"
			@save="handleSave"
			@create="handleCreate"
		/>
	</div>
	
	<!-- 配置生成对话框 -->
		<design-configuration-dialog 
			:open="isConfigDialogOpen" 
		:project-id="projectId"
			@update:open="isConfigDialogOpen = $event"
			@save="handleConfigSubmit"
	/>
</template>

<script setup lang="ts">
import { LucideSettings } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'
import { useEntityTree } from '@/composables/useEntityTree'
import { useEntityHandlers } from '@/composables/useEntityHandlers'
import type { TreeNodeData } from '~/components/abstract/tree/types'
import { NODE_TYPES } from '~/utils/treeNodeFactory'

// 添加 keepalive 配置
definePageMeta({
	name: 'project-detail',
	// 禁用缓存，减少内存占用
	keepalive: false,
	// 禁用页面过渡动画
	pageTransition: false
})

const { id } = useRoute().params
const projectId = Number(id)
const toast = useToast()
const entityApis = useEntityApis()
const entityTree = useEntityTree()
const entityHandlers = useEntityHandlers()

// 项目树数据
const projectTreeData = ref<TreeNodeData[]>([])

// 添加页面初始加载状态
const pageLoading = ref(true)

// 配置对话框状态
const isConfigDialogOpen = ref(false)
const projectConfiguration = ref<ZdConfiguration | null>(null)

// 默认展开的节点
const expandedKeys = ref<(string | number)[]>([])

/**
 * 打开配置对话框
 */
const openConfigDialog = () => {
	isConfigDialogOpen.value = true
}

/**
 * 处理数据保存
 */
const handleSave = (data: any, nodeType: string) => {
	console.log('保存数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleSave(data, nodeType, loadSpecificProject)
}

/**
 * 处理新数据创建
 */
const handleCreate = (data: any, nodeType: string) => {
	console.log('创建数据:', data, '节点类型:', nodeType)
	return entityHandlers.handleCreate(data, nodeType, loadSpecificProject)
}

/**
 * 加载特定项目数据
 */
const loadSpecificProject = async () => {
	pageLoading.value = true
	try {
		console.log('开始加载项目数据...')
		// 步骤1: 使用loadProjectById获取项目基本数据
		const { treeData: projectData } = await entityTree.loadProjectById(projectId)
		
		if (projectData.length === 0) {
			toast.toast({
				title: "警告",
				description: "无法找到指定项目",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}
		
		// 获取项目详情
		const project = await entityApis.project.get(projectId)
		if (!project) {
			toast.toast({
				title: "警告", 
				description: "无法获取项目详情",
				variant: "destructive",
			})
			pageLoading.value = false
			return
		}
		
		// 步骤2: 使用loadEntityChildren一次性加载所有子元素
		// 这样避免多次修改反应式数据，减少递归更新的可能性
		console.log('加载项目所有子元素...')
		const { treeData: completeData } = await entityTree.loadEntityChildren(projectData, {
			loadSystems: true,
			loadComponents: true,
			loadFullComponents: true,
			loadBoms: true,
			loadSpecifications: true
		})
		
		if (completeData.length > 0) {
			// 一次性更新树数据
			projectTreeData.value = completeData
			
			// 设置默认展开根节点和模板节点
			const expandKeys = [completeData[0].id]
			// 如果有子节点，将第一层子节点也设为展开
			if (completeData[0].children && completeData[0].children.length > 0) {
				expandKeys.push(completeData[0].children[0].id)
			}
			expandedKeys.value = expandKeys

            // 加载项目配置
			await loadProjectConfiguration()
			
			toast.toast({
				title: "成功",
				description: "项目数据加载完成",
			})
		} else {
			toast.toast({
				title: "警告",
				description: "无法加载项目子元素",
				variant: "destructive",
			})
		}
	} catch (error) {
		console.error('获取项目数据失败:', error)
		toast.toast({
			title: "错误",
			description: "获取项目数据失败",
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
 * 加载项目配置
 */
const loadProjectConfiguration = async () => {
	if (!projectId) return
	
	try {
		const project = await entityApis.project.get(projectId)
		if (!project || !project.templateId) return
		
		const config = await entityApis.configuration.getByTemplateId(
			project.templateId,
			projectId
		)
		
		if (config && config.id > 0) {
			projectConfiguration.value = config
		} else {
			projectConfiguration.value = null
		}
	} catch (error) {
		console.error('加载项目配置失败:', error)
		projectConfiguration.value = null
	}
}

/**
 * 处理配置提交
 */
const handleConfigSubmit = async (configuration: ZdConfiguration) => {
	try {
		// 如果有ID则更新，否则创建
		if (configuration.id) {
			await entityApis.configuration.update(configuration)
			toast.toast({
				title: "成功",
				description: "更新配置成功",
			})
		} else {
			await entityApis.configuration.create(configuration)
			toast.toast({
				title: "成功",
				description: "创建配置成功",
			})
		}
		
		// 重新加载配置
		await loadProjectConfiguration()
		
		// 关闭对话框
		isConfigDialogOpen.value = false
	} catch (error) {
		console.error('保存配置失败:', error)
		toast.toast({
			title: "错误",
			description: "保存配置失败",
			variant: "destructive",
		})
	}
}

/**
 * 手动加载配置
 */
const handleLoadConfiguration = async () => {
	await loadProjectConfiguration()
	toast.toast({
		title: "成功",
		description: "重新加载配置成功",
	})
}

// 初始化时加载数据
onMounted(async () => {
	await loadSpecificProject()
})

// 监听配置对话框关闭
watch(() => isConfigDialogOpen.value, (isOpen) => {
	if (!isOpen) {
		// 对话框关闭后刷新配置
		loadProjectConfiguration()
	}
})
</script> 