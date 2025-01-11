<template>
	<div class="module-test">
		<module-tree ref="moduleTree" :id="1" />
		<div class="module-main">
			<!-- <h1>参数列表</h1>
			<module-arguments :mid="mid" /> -->
		</div>
	</div>
</template>

<script setup lang="ts">
const mid = ref(1)
provide('afterSelectedTree', (node: Module) => {
	mid.value = node.id
})
</script>

<style lang="scss" scoped>
.module-test {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-height: 60vh;

	.module-tree {
		width: 25%;
		margin: 10px;
	}

	.module-main {
		width: 75%;
	}
}
</style>
