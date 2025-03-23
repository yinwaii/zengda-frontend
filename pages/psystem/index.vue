<template>
	<div class="flex h-full">
		<div class="w-1/4 border-r overflow-auto">
			<layout-sidebar :data="sidebarData" />
		</div>
		<div class="flex-1 p-6 overflow-auto">
			<template v-if="selectedPSystem">
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h2 class="text-2xl font-bold">{{ selectedPSystem.name }}</h2>
						<shadcn-button v-if="selectedPSystem.docsUrl" variant="outline" as-child>
							<a :href="selectedPSystem.docsUrl" target="_blank">
								<LucideFileText class="mr-2 h-4 w-4" />
								查看文档
							</a>
						</shadcn-button>
					</div>
					
					<shadcn-card>
						<shadcn-card-header>
							<shadcn-card-title>基本信息</shadcn-card-title>
						</shadcn-card-header>
						<shadcn-card-content>
							<dl class="grid grid-cols-2 gap-4">
								<div>
									<dt class="text-sm font-medium text-muted-foreground">ID</dt>
									<dd class="mt-1">{{ selectedPSystem.id }}</dd>
								</div>
								<div>
									<dt class="text-sm font-medium text-muted-foreground">父ID</dt>
									<dd class="mt-1">{{ selectedPSystem.parentId }}</dd>
								</div>
								<div class="col-span-2">
									<dt class="text-sm font-medium text-muted-foreground">描述</dt>
									<dd class="mt-1">{{ selectedPSystem.description || '暂无描述' }}</dd>
								</div>
							</dl>
						</shadcn-card-content>
					</shadcn-card>

					<shadcn-card v-if="selectedPSystem.parameters && selectedPSystem.parameters.length > 0">
						<shadcn-card-header>
							<shadcn-card-title>参数列表</shadcn-card-title>
						</shadcn-card-header>
						<shadcn-card-content>
							<shadcn-table>
								<shadcn-table-header>
									<shadcn-table-row>
										<shadcn-table-head>参数名</shadcn-table-head>
										<shadcn-table-head>描述</shadcn-table-head>
										<shadcn-table-head>值</shadcn-table-head>
										<shadcn-table-head>类型</shadcn-table-head>
									</shadcn-table-row>
								</shadcn-table-header>
								<shadcn-table-body>
									<shadcn-table-row v-for="param in selectedPSystem.parameters" :key="param.id">
										<shadcn-table-cell>{{ param.name }}</shadcn-table-cell>
										<shadcn-table-cell>{{ param.description || '-' }}</shadcn-table-cell>
										<shadcn-table-cell>{{ param.value }}</shadcn-table-cell>
										<shadcn-table-cell>{{ param.dtype || '-' }}</shadcn-table-cell>
									</shadcn-table-row>
								</shadcn-table-body>
							</shadcn-table>
						</shadcn-card-content>
					</shadcn-card>
				</div>
			</template>
			<div v-else class="flex items-center justify-center h-full text-muted-foreground">
				请从左侧选择一个系统
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEntityApis } from '@/composables/use-entity-apis'
import type { ZdPSystem } from '@/models/entity/psystem'
import type { SidebarData } from '@/models/sidebar'
import { LucideFileText } from 'lucide-vue-next'

const apis = useEntityApis()
const selectedPSystem = ref<ZdPSystem | null>(null)
const systems = ref<ZdPSystem[]>([])

const sidebarData = computed<SidebarData>(() => {
	return [
		{
			title: '系统列表',
			url: '/psystem',
			items: systems.value.map(system => ({
				title: system.name,
				url: `/psystem/${system.id}`,
				isActive: selectedPSystem.value?.id === system.id,
				items: []
			}))
		}
	]
})

// 获取系统列表
const fetchPSystems = async () => {
	try {
		const response = await apis.psystem.getAll(true)
		systems.value = response
	} catch (error) {
		console.error('Failed to fetch psystems:', error)
	}
}

// 获取单个系统详情
const fetchPSystemDetail = async (id: number) => {
	try {
		const response = await apis.psystem.get(id)
		selectedPSystem.value = response
		await fetchPSystems() // 更新列表以刷新选中状态
	} catch (error) {
		console.error('Failed to fetch psystem detail:', error)
	}
}

// 初始加载
fetchPSystems()
</script> 