<template>
	<shadcn-dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
		<shadcn-dialog-content class="sm:max-w-[425px]">
			<shadcn-dialog-header>
				<shadcn-dialog-title>{{ isEditing ? '编辑参数' : '新增参数' }}</shadcn-dialog-title>
				<shadcn-dialog-description>
					请填写参数信息
				</shadcn-dialog-description>
			</shadcn-dialog-header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<shadcn-label for="name" class="text-right">名称</shadcn-label>
					<shadcn-input id="name" v-model="form.name" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<shadcn-label for="type" class="text-right">类型</shadcn-label>
					<shadcn-select v-model="form.type" class="col-span-3">
						<shadcn-select-trigger>
							<shadcn-select-value :placeholder="'选择类型'" />
						</shadcn-select-trigger>
						<shadcn-select-content>
							<shadcn-select-item value="string">字符串</shadcn-select-item>
							<shadcn-select-item value="number">数字</shadcn-select-item>
							<shadcn-select-item value="boolean">布尔值</shadcn-select-item>
						</shadcn-select-content>
					</shadcn-select>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<shadcn-label for="value" class="text-right">值</shadcn-label>
					<shadcn-input id="value" v-model="form.value" class="col-span-3" />
				</div>
			</div>
			<shadcn-dialog-footer>
				<shadcn-button variant="outline" @click="$emit('update:modelValue', false)">
					取消
				</shadcn-button>
				<shadcn-button @click="handleSubmit">
					保存
				</shadcn-button>
			</shadcn-dialog-footer>
		</shadcn-dialog-content>
	</shadcn-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ZdParameterArgument } from '~/models/entity/argument'
import { useToast } from '~/components/ui/toast'

const props = defineProps<{
	modelValue: boolean
	editingItem?: ZdParameterArgument
}>()

const emit = defineEmits<{
	'update:modelValue': [value: boolean]
	'submit': [argument: ZdParameterArgument]
}>()

const { toast } = useToast()

const isEditing = computed(() => !!props.editingItem)

const form = ref<ZdParameterArgument>({
	id: 0,
	name: '',
	type: 'string',
	value: ''
})

// 监听编辑项变化，更新表单
watch(() => props.editingItem, (newItem) => {
	if (newItem) {
		form.value = { ...newItem }
	} else {
		form.value = {
			id: 0,
			name: '',
			type: 'string',
			value: ''
		}
	}
}, { immediate: true })

// 处理表单提交
const handleSubmit = () => {
	if (!form.value.name.trim()) {
		toast({
			title: '错误',
			description: '参数名称不能为空',
			variant: 'destructive'
		})
		return
	}

	emit('submit', { ...form.value })
	emit('update:modelValue', false)
}
</script> 