<template>
	<div class="product-arguments-template">
		<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all
			expand-on-click-node @node-click="selectArgument" />
		<!-- <el-input v-model="text" :autosize="{ minRows: 50 }" type="textarea"
			placeholder="Please input" /> -->
		<utils-editor v-model="templateText" />
	</div>
</template>

<script lang="ts" setup>
import type { Argument } from '~/assets/data/args';

const props = defineProps(['arg']);
const selectedArg = ref('')
const templateText = ref('');
const selectArgument = async (arg: Argument) => {
	templateText.value = await $fetch('/api/modules/getSpecificationForArgument', { query: { mid: props.arg.id, aid: arg.id } });
}
</script>

<style lang="scss" scoped>
.product-arguments-template {
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