<template>
	<div class="relative min-h-screen w-full overflow-hidden">
		<!-- 粒子效果背景 -->
		<Particles
			id="tsparticles"
			:options="{
				background: {
					color: {
						value: '#0d47a1'
					}
				},
				fpsLimit: 60,
				particles: {
					color: {
						value: '#ffffff'
					},
					links: {
						color: '#ffffff',
						distance: 150,
						enable: true,
						opacity: 0.5,
						width: 1
					},
					move: {
						enable: true,
						speed: 2
					},
					number: {
						density: {
							enable: true,
							area: 800
						},
						value: 80
					},
					opacity: {
						value: 0.5
					},
					shape: {
						type: 'circle'
					},
					size: {
						value: { min: 1, max: 3 }
					}
				},
				detectRetina: true
			}"
			class="absolute inset-0 -z-10"
		/>
		
		<!-- 内容区域 -->
		<div class="relative z-10 min-w-[300px]">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.particles-container {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: -1;
}
</style>