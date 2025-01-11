<template>
	<div class="design-arguments-template">
		<div class="arguments-tree">
			<div class="arguments-icon">
				<el-button size="small"><el-icon><Check /></el-icon></el-button>
			</div>
			<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all expand-on-click-node
				@node-click="selectArgument" :indent="8" />
		</div>
		<utils-editor v-model="templateText" />
	</div>
</template>

<script lang="ts" setup>
import { Check } from '@element-plus/icons-vue';
const api = useApi();
const props = defineProps({
	arg: { type: Object as PropType<Module>, required: true }
});
const templateText = ref('');
const argId = ref(0);
const selectArgument = async (arg: Module) => {
	// await saveTemplate();
	argId.value = arg.id;
	// templateText.value = await $fetch('/api/modules/getSpecificationForArgument', { query: { mid: props.arg.id, aid: arg.id } });
}
</script>

<style lang="scss" scoped>
.design-arguments-template {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	min-height: 60vh;

	.arguments-tree {
		width: 25%;
		min-height: 100%;
		background-color: white;

		.arguments-icon {
			text-align: right;
			padding: 0 10px 0 10px;
		}
	}

	.quill-editor {
		width: 75%
	}
}
</style>