<template>
	<div class="design-arguments-template">
		<div class="arguments-tree">
			<div class="arguments-icon">
				<el-button size="small" @click="saveTemplate"><el-icon>
						<Check />
					</el-icon></el-button>
			</div>
			<el-tree :data="$props.arg.children" :props="{ label: 'name' }" default-expand-all expand-on-click-node
				@node-click="selectArgument" />
		</div>
		<utils-editor v-model="templateText" />
	</div>
</template>

<script lang="ts" setup>
import type { Argument } from '~/assets/data/args';
import { Check } from '@element-plus/icons-vue';

const props = defineProps(['arg']);
const templateText = ref('');
const argId = ref(0);
const saveTemplate = async () => {
	await $fetch("/api/modules/modifySpecificationForArgument", {
		method: "POST",
		body: {
			mid: props.arg.id, aid: argId.value,
			template: templateText.value
		}
	})
}
const selectArgument = async (arg: Argument) => {
	await saveTemplate();
	argId.value = arg.id;
	templateText.value = await $fetch('/api/modules/getSpecificationForArgument', { query: { mid: props.arg.id, aid: arg.id } });
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

	.editor {
		width: 75%
	}
}
</style>