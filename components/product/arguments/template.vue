<template>
	<div class="product-arguments-template">
		<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all
			expand-on-click-node />
		<!-- <el-input v-model="text" :autosize="{ minRows: 50 }" type="textarea"
			placeholder="Please input" /> -->
		<utils-editor v-model="$props.arg.name" />
	</div>
</template>

<script lang="ts" setup>
import type { Argument } from '~/assets/data/args';

defineProps(['arg']);
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