<template>
	<el-row>
		<el-button type="primary" @click="saveTemplate">保存</el-button>
	</el-row>
	<div class="design-arguments-template">
		<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all
			expand-on-click-node @node-click="selectArgument" />
		<utils-editor v-model="templateText" />
	</div>
</template>

<script lang="ts" setup>
import type { Argument } from '~/assets/data/args';

const props = defineProps(['arg']);
const templateText = ref('');
const argId = ref(0);
const saveTemplate = async () => {
	await $fetch("/api/modules/modifySpecificationForArgument", {
		method: "POST",
		body: {
			mid: props.arg.id, aid: argId.value,
			template: templateText.value
		}
	})
}
const selectArgument = async (arg: Argument) => {
	await saveTemplate();
	argId.value = arg.id;
	templateText.value = await $fetch('/api/modules/getSpecificationForArgument', { query: { mid: props.arg.id, aid: arg.id } });
}
</script>

<style lang="scss" scoped>
.design-arguments-template {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-height: 60vh;

	.el-tree {
		width: 25%;
	}

	.editor {
		width: 75%
	}
}
</style>