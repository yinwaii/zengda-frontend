<template>
	<div class="product-arguments-template">
		<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all expand-on-click-node />
		<el-input v-model="text" :autosize="{ minRows: 50 }" type="textarea"
			placeholder="Please input" />
	</div>
</template>

<script lang="ts" setup>
const text = ref('sdad')
defineProps(['arg']);
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