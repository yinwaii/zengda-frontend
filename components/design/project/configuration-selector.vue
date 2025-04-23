<template>
	<shadcn-card v-if="configurations" class="shadow-none">
		<shadcn-card-header class="py-2">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-medium">项目配置</h3>
				<div class="flex items-center gap-2">
					<shadcn-button size="sm" variant="outline" @click="handleAddConfig">
						<LucidePlus class="h-4 w-4 mr-1" />
						新增配置
					</shadcn-button>
				</div>
			</div>
		</shadcn-card-header>
		<shadcn-card-content class="py-2">
			<div class="flex items-center gap-3">
				<shadcn-select v-model="selectedConfigId" class="flex-1">
					<shadcn-select-trigger class="w-full">
						<template #default>
							{{ getSelectedConfigName() }}
						</template>
					</shadcn-select-trigger>
					<shadcn-select-content>
						<shadcn-select-item v-for="config in configurations" :key="config.id" :value="config.id">
							{{ config.id }} - 最后更新: {{ formatDate(config.updatedTime) || formatDate(config.createdTime) || '未知' }}
						</shadcn-select-item>
					</shadcn-select-content>
				</shadcn-select>
				<shadcn-button size="sm" variant="outline" @click="handleEditConfig" :disabled="!selectedConfig">
					<LucidePencil class="h-4 w-4 mr-1" />
					编辑
				</shadcn-button>
				<shadcn-button size="sm" variant="destructive" @click="handleDeleteConfig" :disabled="!selectedConfig">
					<LucideTrash class="h-4 w-4 mr-1" />
					删除
				</shadcn-button>
				<shadcn-button variant="outline" @click="openPriceDialog">
					<LucideCalculator class="mr-2 h-4 w-4" />
					报价结果计算
				</shadcn-button>
				<shadcn-button variant="outline" @click="generateSpecification" :disabled="specLoading">
					<LucideFileText class="mr-2 h-4 w-4" />
					{{ specLoading ? '生成中...' : '规格书生成' }}
				</shadcn-button>
			</div>
		</shadcn-card-content>
	</shadcn-card>

	<!-- 配置对话框 -->
	<configuration-dialog 
		:modelValue="showConfigDialog"
		@update:modelValue="showConfigDialog = $event"
		:editing-item="editingConfig"
		@submit="onConfigSubmit" 
	/>

	<!-- 确认删除对话框 -->
	<shadcn-alert-dialog v-model:open="showDeleteConfirm">
		<shadcn-alert-dialog-content>
			<shadcn-alert-dialog-header>
				<shadcn-alert-dialog-title>确认删除</shadcn-alert-dialog-title>
				<shadcn-alert-dialog-description>
					您确定要删除此配置吗？此操作不可撤销。
				</shadcn-alert-dialog-description>
			</shadcn-alert-dialog-header>
			<shadcn-alert-dialog-footer>
				<shadcn-alert-dialog-cancel>取消</shadcn-alert-dialog-cancel>
				<shadcn-alert-dialog-action @click="confirmDelete">删除</shadcn-alert-dialog-action>
			</shadcn-alert-dialog-footer>
		</shadcn-alert-dialog-content>
	</shadcn-alert-dialog>

	<!-- 报价结果对话框 -->
	<shadcn-dialog v-model:open="isPriceDialogOpen">
		<shadcn-dialog-content class="max-w-3xl">
			<shadcn-dialog-header>
				<shadcn-dialog-title>报价结果计算</shadcn-dialog-title>
				<shadcn-dialog-description>
					选择配置并查看相关的报价结果
				</shadcn-dialog-description>
			</shadcn-dialog-header>

			<div class="space-y-4">
				<!-- 配置选择 -->
				<div class="space-y-2">
					<shadcn-label for="price-config">选择配置</shadcn-label>
					<shadcn-select v-model="priceConfigId" @update:modelValue="loadPriceData">
						<shadcn-select-trigger id="price-config" class="w-full">
							<shadcn-select-value placeholder="选择配置"></shadcn-select-value>
						</shadcn-select-trigger>
						<shadcn-select-content>
							<shadcn-select-item v-for="config in configurations" :key="config.id" :value="config.id">
								{{ config.id }} - 最后更新: {{ formatDate(config.updatedTime) || formatDate(config.createdTime) || '未知' }}
							</shadcn-select-item>
						</shadcn-select-content>
					</shadcn-select>
				</div>

				<!-- 加载状态 -->
				<div v-if="priceLoading" class="flex justify-center py-8">
					<div class="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
				</div>

				<!-- 价格信息 -->
				<div v-else-if="priceData">
					<div class="flex justify-between items-center mb-4">
						<div>
							<h4 class="text-lg font-semibold">总价: {{ formatPrice(priceData.totalPrice) }}</h4>
							<p class="text-sm text-muted-foreground">配置ID: {{ priceData.configId }}</p>
						</div>
					</div>

					<!-- 价格项表格 -->
					<abstract-data-table :columns="priceColumns" :data="priceItems" searchColumn="name"
						searchPlaceholder="搜索价格项名称...">
					</abstract-data-table>
				</div>

				<!-- 空状态 -->
				<div v-else-if="priceConfigId" class="text-center py-8">
					<p class="text-muted-foreground">未找到价格数据</p>
				</div>

				<div v-else class="text-center py-8">
					<p class="text-muted-foreground">请选择一个配置查看报价结果</p>
				</div>
			</div>

			<shadcn-dialog-footer>
				<shadcn-button variant="outline" @click="isPriceDialogOpen = false">
					关闭
				</shadcn-button>
			</shadcn-dialog-footer>
		</shadcn-dialog-content>
	</shadcn-dialog>
</template>

<script setup lang="ts">
import { LucidePlus, LucidePencil, LucideTrash, LucideCalculator, LucideFileText } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { formatDate } from '~/utils/date'
import type { ZdConfiguration } from '~/models/entity/configuration'
import type { ZdPrice, ZdPriceItem } from '~/models/entity/price'
import ConfigurationDialog from '~/components/design/configuration/dialog.vue'
import { useToast } from '~/components/ui/toast'
import { toApiId } from '~/utils/idConverter'

const props = defineProps<{
	project: {
		id: string
		templateId: number
	}
}>()

const emit = defineEmits<{
	'update:selectedConfigId': [id: number | null]
	'update:configurations': [configs: ZdConfiguration[]]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

// 配置相关状态
const configurations = ref<ZdConfiguration[]>([])
const selectedConfigId = ref<number | null>(null)
const selectedConfig = computed(() => 
	configurations.value.find(c => c.id === selectedConfigId.value) || null
)

// 对话框状态
const showConfigDialog = ref(false)
const editingConfig = ref<ZdConfiguration | undefined>(undefined)
const showDeleteConfirm = ref(false)

// 报价相关状态
const isPriceDialogOpen = ref(false)
const priceConfigId = ref<number | null>(null)
const priceLoading = ref(false)
const priceData = ref<ZdPrice | null>(null)
const priceItems = ref<ZdPriceItem[]>([])

// 规格书生成相关状态
const specLoading = ref(false)

// 获取所有配置
const loadConfigurations = async () => {
	try {
		if (!props.project || !props.project.id || !props.project.templateId) return

		// 使用toApiId转换项目ID为纯数字
		const projectNumericId = toApiId(props.project.id)
		if (projectNumericId === null) {
			console.error('无法将项目ID转换为有效的数字ID')
			toast({
				title: '错误',
				description: '项目ID格式无效',
				variant: 'destructive'
			})
			return
		}
		
		const response = await entityApis.configuration.getByTemplateId(
			props.project.templateId,
			projectNumericId
		)

		if (response && response.list && response.list.length > 0) {
			configurations.value = response.list
			// 默认选择第一个配置
			if (!selectedConfigId.value && response.list.length > 0) {
				selectedConfigId.value = response.list[0].id
			}
		} else {
			configurations.value = []
			selectedConfigId.value = null
		}

		emit('update:configurations', configurations.value)
	} catch (error) {
		console.error('加载配置列表失败:', error)
		toast({
			title: '错误',
			description: '加载配置列表失败',
			variant: 'destructive'
		})
	}
}

// 处理新增配置
const handleAddConfig = () => {
	editingConfig.value = undefined // 确保不是编辑模式
	showConfigDialog.value = true
}

// 处理编辑配置
const handleEditConfig = () => {
	if (!selectedConfig.value) return
	editingConfig.value = selectedConfig.value
	showConfigDialog.value = true
}

// 处理删除配置
const handleDeleteConfig = () => {
	if (!selectedConfig.value) return
	showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = async () => {
	if (!selectedConfig.value) return

	try {
		await entityApis.configuration.delete(selectedConfig.value.id)
		toast({
			title: '成功',
			description: '配置已删除'
		})
		
		// 重新加载配置列表
		await loadConfigurations()
		showDeleteConfirm.value = false
	} catch (error) {
		console.error('删除配置失败:', error)
		toast({
			title: '错误',
			description: '删除配置失败',
			variant: 'destructive'
		})
	}
}

// 配置对话框提交处理
const onConfigSubmit = async (config: ZdConfiguration) => {
	try {
		if (editingConfig.value) {
			// 更新
			await entityApis.configuration.update(config)
			toast({
				title: '成功',
				description: '配置已更新'
			})
		} else {
			// 创建
			// 确保使用纯数字ID
			const projectNumericId = toApiId(props.project.id)
			if (projectNumericId === null) {
				throw new Error('无法将项目ID转换为有效的数字ID')
			}
			
			const newConfig = await entityApis.configuration.create({
				...config,
				projectId: projectNumericId,
				templateId: props.project.templateId
			})
			toast({
				title: '成功',
				description: '配置已创建'
			})
		}
		
		// 重新加载配置列表
		await loadConfigurations()
		showConfigDialog.value = false
	} catch (error) {
		console.error('保存配置失败:', error)
		toast({
			title: '错误',
			description: '保存配置失败',
			variant: 'destructive'
		})
	}
}

// 获取选中配置名称
const getSelectedConfigName = () => {
	if (!selectedConfig.value) return '请选择配置'
	return `配置 #${selectedConfig.value.id}`
}

// 价格项表格列定义
const priceColumns = ref([
	{
		accessorKey: 'name',
		header: '名称',
	},
	{
		accessorKey: 'totalPrice',
		header: '价格',
		cell: ({ row }: { row: any }) => {
			return formatPrice(row.original.totalPrice)
		}
	},
	{
		accessorKey: 'remark',
		header: '备注',
		cell: ({ row }: { row: any }) => {
			return row.original.remark || '-'
		}
	}
])

// 加载价格数据
const loadPriceData = async () => {
	if (!priceConfigId.value) return

	try {
		priceLoading.value = true
		const response = await entityApis.price.get(priceConfigId.value)

		if (response) {
			priceData.value = response
			// 提取价格项数据
			if (response.priceItems && Array.isArray(response.priceItems)) {
				priceItems.value = flattenPriceItems(response.priceItems)
			} else {
				priceItems.value = []
			}
		} else {
			toast({
				title: '警告',
				description: '未找到价格数据'
			})
			priceData.value = null
			priceItems.value = []
		}
	} catch (error) {
		console.error('加载价格数据失败:', error)
		toast({
			title: '错误',
			description: '加载价格数据失败',
			variant: 'destructive'
		})
		priceData.value = null
		priceItems.value = []
	} finally {
		priceLoading.value = false
	}
}

// 将嵌套的价格项列表扁平化
const flattenPriceItems = (items: ZdPriceItem[], level = 0): ZdPriceItem[] => {
	let result: ZdPriceItem[] = []

	items.forEach(item => {
		// 添加当前项
		const flatItem = {
			...item,
			// 添加显示级别信息，用于前端缩进显示
			level,
			// 为每个项生成一个唯一ID，避免key重复
			_id: `price_${Math.random().toString(36).substring(2, 9)}`
		}

		result.push(flatItem)

		// 递归处理子项
		if (item.children && item.children.length > 0) {
			result = [...result, ...flattenPriceItems(item.children, level + 1)]
		}
	})

	return result
}

// 打开报价结果对话框
const openPriceDialog = () => {
	isPriceDialogOpen.value = true

	// 默认选择当前配置
	if (selectedConfig.value && !priceConfigId.value) {
		priceConfigId.value = selectedConfig.value.id
	}
	loadPriceData()
}

// 格式化价格
const formatPrice = (price: number) => {
	if (typeof price !== 'number') return '¥0.00'
	return `¥${price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// 规格书生成处理函数
const generateSpecification = async () => {
	if (!props.project || !props.project.templateId) {
		toast({
			title: '错误',
			description: '项目信息不完整',
			variant: 'destructive'
		})
		return
	}

	try {
		specLoading.value = true

		// 1. 获取模板信息
		const template = await entityApis.template.get(props.project.templateId)
		if (!template || !template.specId) {
			toast({
				title: '错误',
				description: '未找到模板规格书配置',
				variant: 'destructive'
			})
			return
		}

		// 2. 获取规格书配置
		const specConfig = await entityApis.specification.getAll(template.specId)
		if (!specConfig) {
			toast({
				title: '错误',
				description: '未找到规格书配置',
				variant: 'destructive'
			})
			return
		}

		// 清理specConfig中的null值
		const cleanSpecConfig = (obj: any): any => {
			if (obj === null || obj === undefined) {
				return undefined
			}
			if (Array.isArray(obj)) {
				return obj.map(item => cleanSpecConfig(item)).filter(item => item !== undefined)
			}
			if (typeof obj === 'object') {
				const cleaned: any = {}
				for (const [key, value] of Object.entries(obj)) {
					// 对于texts、bools和imgs属性，保留对象但清理内部null值
					if (key === 'texts' || key === 'bools' || key === 'imgs') {
						if (value && typeof value === 'object') {
							const cleanedValue: any = {}
							for (const [k, v] of Object.entries(value)) {
								if (v !== null) {
									cleanedValue[k] = v
								}
							}
							cleaned[key] = cleanedValue
						} else {
							cleaned[key] = {}
						}
						continue
					}
					const cleanedValue = cleanSpecConfig(value)
					if (cleanedValue !== undefined) {
						cleaned[key] = cleanedValue
					}
				}
				return Object.keys(cleaned).length > 0 ? cleaned : undefined
			}
			return obj
		}

		const cleanedSpecConfig = cleanSpecConfig(specConfig)

		// 3. 渲染规格书
		const renderUrl = await entityApis.specification.render(selectedConfigId.value, cleanedSpecConfig)
		if (!renderUrl) {
			toast({
				title: '错误',
				description: '规格书渲染失败',
				variant: 'destructive'
			})
			return
		}

		// 4. 下载文件
		const blob = await entityApis.system.download(renderUrl)
		// 创建下载链接
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `规格书_${props.project.id}_${new Date().toISOString().split('T')[0]}.docx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)

		toast({
			title: '成功',
			description: '规格书生成成功'
		})
	} catch (error) {
		console.error('生成规格书失败:', error)
		toast({
			title: '错误',
			description: '生成规格书失败',
			variant: 'destructive'
		})
	} finally {
		specLoading.value = false
	}
}

// 监听项目变化，更新配置
watch(() => props.project, () => {
	loadConfigurations()
}, { immediate: true })

// 监听选中配置变化，通知父组件
watch(selectedConfigId, (newValue) => {
	emit('update:selectedConfigId', newValue)
})
</script> 