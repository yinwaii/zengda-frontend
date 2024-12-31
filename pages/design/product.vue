<template>
	<div class="container">
		<el-col>
			<!-- <design-arguments-selector v-model="rootArgument" /> -->
			<!-- <el-transfer v-model="value" :props="{key: 'id', label: 'name', disabled: 'isEnabled'}" :data="rootArgument" /> -->
		</el-col>
	</div>
</template>

<script setup lang="ts">
const rootArgument = ref([])
const value = ref([])
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
}
</style>