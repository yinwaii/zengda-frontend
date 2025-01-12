<template>
	<abstract-descriptions :defaultValue="defaultModule" :title="moduleModel.name" :param="paramsModule" :data="moduleModel"></abstract-descriptions>
</template>

<script lang="ts" setup>
const api = useApi();

const props = defineProps<{
	mid: number
}>()

const moduleModel = ref<Module>(await unpackApi(api.modules.query(props.mid)));

watch(() => props.mid, async (mid) => {
	if (mid) {
		moduleModel.value = await unpackApi(api.modules.query(mid));
	}
})
</script>