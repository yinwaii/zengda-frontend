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
		<!-- <div class="flex justify p-2">
			<el-space wrap>
				<el-text>选择报价单：</el-text>
				<configuration-select v-if="zdproject?.id" v-model="configId" :project-id="zdproject.id"
					:template-id="zdproject.templateId" />
				<el-button type="primary" @click="onNewConfiguration">新建报价单</el-button>
			</el-space>
			<configuration-dialog v-model="dialogVisible" @submit="onSubmitConfiguration" />
		</div> -->
		<el-tabs type="border-card">
			<el-tab-pane label="报价填写">
				<configuration-argument v-if="configId && zdproject?.templateId" :config-id="configId" :template-id="zdproject.templateId" />
			</el-tab-pane>
			<el-tab-pane label="规格书生成">
				<specification-render v-if="configId && zdproject?.templateId" :template-id="zdproject.templateId" :config-id="configId" />
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
const dialogVisible = ref(false)
const onRefresh = async () => {
	zdproject.value = await entityApis.project.get(id)
	const configs = (await entityApis.configuration.getByTemplateId(zdproject.value?.templateId, zdproject.value?.id)).list
	if (configs.length > 0) {
		configId.value = configs[0].id
	}
	else {
		const config = await entityApis.configuration.createDefault(zdproject.value?.id)
		configId.value = config
	}
	console.log(configId.value, zdproject.value?.templateId)
}
onMounted(async () => {
	await onRefresh()
})

// const onSubmitConfiguration = async (configuration: Partial<ZdConfiguration>) => {
// 	dialogVisible.value = false
// 	configuration.projectId = zdproject.value?.id
// 	configuration.templateId = zdproject.value?.templateId
// 	const res = await entityApis.configuration.create(configuration)
// 	configId.value = res.id
// }

// const onNewConfiguration = async () => {
// 	dialogVisible.value = true
// }

</script>