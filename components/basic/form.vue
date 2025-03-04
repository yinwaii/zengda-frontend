<template>
	<!-- {{model}} -->
	<el-form label-position="left" label-width="80px">
		<template v-for="(value, key) in ($props.param as Record<string, GenericParam<T>>)">
			<!-- {{console.log(value, key, value?.getItem(model)[key])}} -->
			<el-form-item :label="value.name" label-position='left'>
				<basic-generic-item :value="value" :key="key" v-model="value?.getItem(formData)[key]" />
			</el-form-item>
		</template>
	</el-form>
</template>

<script lang="ts" setup generic="T">

const formData = inject<T>('form-data')

defineProps<{
	param: GenericParamMap<T>
}>()

</script>