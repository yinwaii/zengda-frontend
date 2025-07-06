<template>
	<div>
		<!-- 标题区域 -->
		<div class="p-6 bg-white border border-gray-200 shadow-sm">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h1 class="text-3xl font-bold text-gray-900 mb-3 leading-tight">
						{{ zdtemplate?.name || '模板详情' }}
					</h1>
					<p class="text-base text-gray-600 leading-relaxed max-w-3xl">
						{{ zdtemplate?.description || '暂无描述' }}
					</p>
				</div>
			</div>
		</div>

		<el-tabs type="border-card">
			<el-tab-pane label="物料组件">
				<component-table />
			</el-tab-pane>
			<el-tab-pane label="功能模块">
				<psystem-table />
			</el-tab-pane>
			<el-tab-pane label="参数配置">
				<parameter-table v-if="zdtemplate?.id" :obj-type="'template'" :obj-id="zdtemplate.id" />
			</el-tab-pane>
			<el-tab-pane label="规格书生成">

			</el-tab-pane>
			<el-tab-pane label="报价预览">

			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">

const { id } = useRoute().params
const zdtemplate = ref<ZdTemplate>()
const entityApis = useEntityApis()
onMounted(async () => {
	zdtemplate.value = await entityApis.template.get(id)
})

</script>