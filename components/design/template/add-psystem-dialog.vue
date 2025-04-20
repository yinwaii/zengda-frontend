<template>
	<shadcn-dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
		<shadcn-dialog-content class="sm:max-w-[425px]">
			<shadcn-dialog-header>
				<shadcn-dialog-title>添加 PSYSTEM</shadcn-dialog-title>
				<shadcn-dialog-description>
					请选择一个 PSYSTEM 或创建新的
				</shadcn-dialog-description>
			</shadcn-dialog-header>

			<div class="space-y-4 py-4">
				<div class="flex items-center gap-2">
					<shadcn-select v-model="selectedPsystemId" class="flex-1">
						<shadcn-select-trigger>
							<shadcn-select-value placeholder="选择 PSYSTEM" />
						</shadcn-select-trigger>
						<shadcn-select-content>
							<shadcn-select-item v-for="psystem in psystems" :key="psystem.id" :value="psystem.id">
								{{ psystem.name }}
							</shadcn-select-item>
						</shadcn-select-content>
					</shadcn-select>
					<shadcn-button variant="outline" @click="openCreateDialog">
						<LucidePlus class="h-4 w-4 mr-1" />
						新建
					</shadcn-button>
				</div>
			</div>

			<shadcn-dialog-footer>
				<shadcn-button variant="outline" @click="$emit('update:modelValue', false)">
					取消
				</shadcn-button>
				<shadcn-button @click="handleSubmit" :disabled="!selectedPsystemId">
					确定
				</shadcn-button>
			</shadcn-dialog-footer>
		</shadcn-dialog-content>
	</shadcn-dialog>

	<!-- PSYSTEM 创建对话框 -->
	<psystem-dialog
		:open="showCreateDialog"
		:psystem="psystem"
		@submit="handlePsystemCreated"
	/>
</template>

<script setup lang="ts">
import { LucidePlus } from 'lucide-vue-next'
import { ref, onMounted, inject } from 'vue'
// import type { ZdPSystem } from '~/models/entity/psystem'
import PsystemDialog from '~/components/design/psystem/dialog.vue'
import { useToast } from '~/components/ui/toast'

const props = defineProps<{
	templateId: number
	modelValue: boolean
}>()

const emit = defineEmits<{
	'update:modelValue': [value: boolean]
	'submit': [psystemId: number]
}>()

const toast = useToast().toast
const entityApis = useEntityApis()

const refresh = inject('refresh') as () => Promise<void>

// 状态
const psystems = ref<ZdPSystem[]>([])
const selectedPsystemId = ref<number | null>(null)
const showCreateDialog = ref(false)
const psystem = ref<ZdPSystem>()

// 加载 PSYSTEM 列表
const loadPsystems = async () => {
	try {
		const response = await entityApis.psystem.getAll()
		if (response) {
			psystems.value = response
		}
	} catch (error) {
		console.error('加载 PSYSTEM 列表失败:', error)
		toast({
			title: '错误',
			description: '加载 PSYSTEM 列表失败',
			variant: 'destructive'
		})
	}
}

// 打开创建对话框
const openCreateDialog = () => {
	showCreateDialog.value = true
}

// 处理 PSYSTEM 创建完成
const handlePsystemCreated = async (newPsystem: ZdPSystem) => {
	psystem.value = newPsystem
	await entityApis.template.create(psystem.value)
	// 重新加载 PSYSTEM 列表
	await loadPsystems()
	// 自动选择新创建的 PSYSTEM
	selectedPsystemId.value = newPsystem.id
	showCreateDialog.value = false
}

// 处理提交
const handleSubmit = async () => {
	if (selectedPsystemId.value) {
		await entityApis.template_psystem.create(toApiId(props.templateId), selectedPsystemId.value)
		emit('update:modelValue', false)
		// 调用refresh函数刷新树状结构
		await refresh()
	}
}

// 组件挂载时加载数据
onMounted(() => {
	loadPsystems()
})
</script> 