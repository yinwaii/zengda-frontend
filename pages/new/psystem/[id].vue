<template>
	<div>
		<!-- 标题区域 -->
		<div class="p-6 bg-white border border-gray-200 shadow-sm">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h1 class="text-3xl font-bold text-gray-900 mb-3 leading-tight">
						{{ zdpsystem?.name || '功能模块详情' }}
					</h1>
					<p class="text-base text-gray-600 leading-relaxed max-w-3xl">
						{{ zdpsystem?.description || '暂无描述' }}
					</p>
				</div>
			</div>
		</div>

		<el-tabs type="border-card">
			<el-tab-pane label="物料组件">
				<psystem-component-table v-if="zdpsystem?.id" :psystem-id="zdpsystem.id" />
			</el-tab-pane>
			<el-tab-pane label="参数配置">
				<parameter-table v-if="zdpsystem?.id" :obj-type="'psystem'" :obj-id="zdpsystem.id" />
			</el-tab-pane>
			<el-tab-pane label="规格书配置">
				<specification-from-psystem v-if="zdpsystem?.id" :psystem-id="zdpsystem.id" />
			</el-tab-pane>
			<!-- <el-tab-pane label="报价预览">

    </el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script setup lang="ts">

const { id } = useRoute().params
const zdpsystem = ref<ZdPSystem>()
const entityApis = useEntityApis()
onMounted(async () => {
	zdpsystem.value = await entityApis.psystem.get(id)
})

</script>