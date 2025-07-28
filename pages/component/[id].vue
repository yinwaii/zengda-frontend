<template>
  <div>
    <!-- 标题区域 -->
    <div class="p-6 bg-white border border-gray-200 shadow-sm">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {{ zdcomponent?.name || '组件详情' }}
          </h1>
          <p class="text-base text-gray-600 leading-relaxed max-w-3xl">
            {{ zdcomponent?.description || '暂无描述' }}
          </p>
        </div>
      </div>
    </div>

    <el-tabs type="border-card">
      <!-- <el-tab-pane label="参数配置">
        <parameter-table v-if="zdcomponent?.id" :obj-type="'component'" :obj-id="zdcomponent.id" />
      </el-tab-pane> -->
      <el-tab-pane label="BOM表配置">
        <bom-table v-if="bomId" :bom-id="bomId" />
      </el-tab-pane>
      <!-- <el-tab-pane label="报价预览">

    </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup lang="ts">

const { id } = useRoute().params
const zdcomponent = ref<ZdComponent>()
const entityApis = useEntityApis()
const onRefresh = async () => {
  zdcomponent.value = await entityApis.component.get(id)
}
const bomId = ref<number>()
const onUpdateBom = async () => {
  if (!zdcomponent.value?.id) { 
    return
  }
  const boms = await entityApis.bom.getByComponentId(zdcomponent.value.id)
  console.log(boms)
  if (boms.length === 0) {
    const bom = await entityApis.bom.create({ componentId: zdcomponent.value.id })
    bomId.value = bom.id
  }
  else {
    bomId.value = boms[0]
  }
}
onMounted(async () => {
  await onRefresh()
  await onUpdateBom()
})

</script>