<template>
	<div class="selector">
		<el-text size="large">模块： </el-text>
		<client-only>
			<el-cascader v-model="selected" :options="moduleData.data" :props="moduleProps" placeholder="直接输入名称可搜索" filterable
				!show-all-levels @change="changeModule" ref="cascader" />
			<el-button type="primary" @click="$emit('updateModule', selected)">确认</el-button>
			<el-button type="primary" @click="generateTemplate">生成模板</el-button>
			<abstract-dialog v-model="dialogModel" :param="paramsProjectTemplate" @post-message="onSave" />
			<!-- <el-button type="primary" @click="console.log('1')">新建</el-button> -->
		</client-only>
	</div>
</template>

<script lang="ts" setup>
import type { CascaderProps } from 'element-plus';
const api = useApi();

defineEmits({
	updateModule: async (arg?: number) => true
})

const moduleData: any = await api.modules.queryAll();
const moduleProps: CascaderProps = {
	label: 'name',
	value: 'id',
	expandTrigger: 'hover',
	checkStrictly: true,
	emitPath: false,
}
const selected = ref<number>()

const cascaderRef = useTemplateRef('cascader')
const changeModule = () => {
	cascaderRef.value?.togglePopperVisible(false);
}
const dialogModel = reactive({
	isVisible: false,
	message: 'insert',
	data: defaultProjectTemplate()
})
const generateTemplate = () => {
	dialogModel.data = defaultProjectTemplate()
	dialogModel.data.module_id = selected.value ?? -1
	dialogModel.data.create_time = getCurrentTime()
	dialogModel.data.update_time = getCurrentTime()
	dialogModel.isVisible = true
}
const onSave = (message: string, data: any) => {
	if (message === 'insert') {
		api.projectTemplate.insert(data)
	}
	dialogModel.isVisible = false
}

</script>

<style lang="scss" scoped>
.selector {
	padding: 10px 10px 0px 10px;

	.el-button {
		margin: 0 10px 0 10px;
	}
}
</style>

<style lang="scss">
.el-cascader-panel {
	.el-radio {
		width: 100%;
		height: 100%;
		z-index: 10;
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.el-radio__input {
		visibility: hidden;
	}

	.el-cascader-node__postfix {
		top: 10px;
	}
}
</style>