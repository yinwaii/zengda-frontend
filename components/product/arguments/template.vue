<template>
	<div class="product-arguments-template">
		<el-tree :data="rootArgument.children" :props="{ label: 'name' }" default-expand-all expand-on-click-node />
		<el-input v-model="text" :autosize="{ minRows: 50 }" type="textarea"
			placeholder="Please input" />
	</div>
</template>

<script lang="ts" setup>
import { rootArgument } from 'assets/data/args'
const text = ref('sdad')
</script>

<style lang="scss" scoped>
.product-arguments-template {
	display: flex;
	flex-direction: row;
	justify-content: space-around;

	.el-tree {
		width: 25%;
	}

	.el-textarea {
		width: 50%
	}
}
</style>