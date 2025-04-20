<template>
	<div class="flex h-full">
		<!-- 左侧树形结构 -->
		<div class="w-64 border-r">
			<div class="p-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" class="w-full">
							添加
							<ChevronDown class="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem @click="openPsystemDialog">
							添加 PSYSTEM
						</DropdownMenuItem>
						<DropdownMenuItem>
							添加配置
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			
			<Tree
				:data="treeData"
				:defaultExpandedKeys="defaultExpandedKeys"
				:defaultSelectedKeys="defaultSelectedKeys"
				@select="handleNodeClick"
			/>
		</div>
		
		<!-- 右侧内容区域 -->
		<div class="flex-1 p-4">
			<slot name="content" :node="selectedNode">
				<configuration-panel
					v-if="selectedNode"
					:projectId="projectId"
					:templateId="templateId"
					:currentNode="selectedNode"
					@update:configId="handleConfigIdUpdate"
				/>
			</slot>
		</div>

		<!-- PSYSTEM 选择对话框 -->
		<Dialog :open="showPsystemDialog" @update:open="showPsystemDialog = $event">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>选择 PSYSTEM</DialogTitle>
				</DialogHeader>
				
				<div class="py-4">
					<ProductTypeSelect v-model="selectedProductTypeId" />
				</div>
				
				<DialogFooter>
					<Button variant="outline" @click="showPsystemDialog = false">
						取消
					</Button>
					<Button @click="handlePsystemSelected">
						确认
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { LucidePlus, LucideBox, LucideSettings } from 'lucide-vue-next'
import { ref } from 'vue'
import PsystemSelectDialog from '~/components/design/template/add-psystem-dialog.vue'
import { useToast } from '~/components/ui/toast'
import { ChevronDown } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
// import { Tree } from '~/components/ui/tree'
// import ProductTypeSelect from '~/components/design/template/product-type-select.vue'
import type { ZdPSystem } from '~/models/entity/psystem'

interface Node {
	id: string
	label: string
	children?: Node[]
	// 其他节点属性...
}

const props = defineProps<{
	projectId: number
	templateId: number
	// ... other existing props ...
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

const treeData = ref<Node[]>([
	// ... existing tree data ...
])

const defaultExpandedKeys = ref<string[]>(['1'])
const defaultSelectedKeys = ref<string[]>(['1'])
const selectedNode = ref<Node | null>(null)
const showPsystemDialog = ref(false)
const selectedProductTypeId = ref<number>(0)

const handleNodeClick = (node: Node) => {
	selectedNode.value = node
}

// 处理配置ID更新
const handleConfigIdUpdate = (configId: number | null) => {
	// 可以在这里处理配置ID的更新，如果需要的话
}

// 打开 PSYSTEM 选择对话框
const openPsystemDialog = () => {
	showPsystemDialog.value = true
}

// 处理 PSYSTEM 选择
const handlePsystemSelected = async () => {
	try {
		if (!selectedProductTypeId.value) {
			toast({
				title: '错误',
				description: '请选择一个产品类型',
				variant: 'destructive'
			})
			return
		}

		const psystem = await entityApis.psystem.get(selectedProductTypeId.value)
		
		await entityApis.template_psystem.create({
			templateId: props.templateId,
			psystem_id: psystem.id
		})
		
		toast({
			title: '成功',
			description: 'PSYSTEM 添加成功'
		})
		
		showPsystemDialog.value = false
		// TODO: 刷新树形结构数据
	} catch (error) {
		console.error('添加 PSYSTEM 失败:', error)
		toast({
			title: '错误',
			description: '添加 PSYSTEM 失败',
			variant: 'destructive'
		})
	}
}

// 打开配置对话框
const openConfigurationDialog = () => {
	// TODO: 实现配置对话框
}
</script> 