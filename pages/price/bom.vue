<script setup lang="ts">
// import type { ViewUpdate } from '@codemirror/view';
// // import type { CodeMirrorRef, Statistics } from 'nuxt-codemirror';

// const code = ref('console.log("Hello, CodeMirror!");');
// const theme = ref<'light' | 'dark' | 'none'>('light');
// const codemirror = ref<CodeMirrorRef>();


// const handleChange = (value: string, viewUpdate: ViewUpdate) => {
// 	console.log('Value changed:', value);
// 	console.log('View updated:', viewUpdate);
// };

// const handleStatistics = (stats: Statistics) => {
// 	console.log('Editor statistics:', stats);
// };

// const handleUpdate = (viewUpdate: ViewUpdate) => {
// 	console.log('Editor updated:', viewUpdate);
// };

// onMounted(() => {
// 	watchEffect(() => {
// 		if (codemirror.value) {
// 			console.log('ref', codemirror.value.view);
// 		}
// 	})
// });
</script>

<template>
	<!-- <NuxtCodeMirror ref="codemirror" v-model="code" style="width: 500px; height: 400px" 
		:theme="theme" placeholder="Enter your code here..." :auto-focus="true" :editable="true" :basic-setup="true"
		:indent-with-tab="true" @on-change="handleChange" @statistics="handleStatistics" @on-update="handleUpdate" />
	<div>{{ code }}</div>
	<input v-model="code" type="text"> -->
</template>
