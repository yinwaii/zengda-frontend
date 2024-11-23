<template>
	<div class="wrap"></div>
	<el-overlay z-index="0">
		<div class="container">
			<slot></slot>
		</div>
	</el-overlay>
</template>

<style lang="scss" scoped>
.wrap {
	height: 100vh;
	width: 100vw;
	position: relative;
	background: url('/assets/imgs/background.jpg') no-repeat;
	-webkit-background-size: 100%;
	background-size: 100%;
}

.el-overlay {
	display: flex;
	align-items: center;
	justify-content: center;

	.container {
		min-width: 300px;
	}
}
</style>