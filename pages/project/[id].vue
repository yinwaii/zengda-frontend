<template>
	<div>
		<!-- 标题区域 -->
		<div class="p-6 bg-white border border-gray-200 shadow-sm">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h1 class="text-3xl font-bold text-gray-900 mb-3 leading-tight">
						{{ zdproject?.name || '项目详情' }}
					</h1>
					<p class="text-base text-gray-600 leading-relaxed max-w-3xl">
						{{ zdproject?.description || '暂无描述' }}
					</p>
				</div>
			</div>
		</div>
		<div class="flex justify p-2">
			<el-text>选择报价单：</el-text>
			<configuration-select v-if="zdproject?.id" v-model="configId" :project-id="zdproject.id"
				:template-id="zdproject.templateId" />
		</div>
		<el-tabs type="border-card">
			<el-tab-pane label="报价填写">
			</el-tab-pane>
			<el-tab-pane label="规格书生成">
				<specification-render v-if="configId" :specification-id="configId" :config-id="configId" />
			</el-tab-pane>
			<el-tab-pane label="报价预览">
				<configuration-price v-if="configId" :config-id="configId" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const zdproject = ref<ZdProject>()
const entityApis = useEntityApis()
const configId = ref<number>()
onMounted(async () => {
	zdproject.value = await entityApis.project.get(id)
})

</script>