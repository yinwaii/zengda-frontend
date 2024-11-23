<template>
	<el-card>
		<template #header>
			<div class="card-header">
				<span>登录</span>
			</div>
		</template>
		<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" status-icon>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" type="password" show-password />
			</el-form-item>
		</el-form>
		<div class="card-bottom">
			<nuxt-link to="/personal/register">尚未拥有账号，开始注册</nuxt-link>
		</div>
		<template #footer>
			<div class="card-footer">
				<el-button type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
				<el-button size="large" @click="resetForm(ruleFormRef)">取消</el-button>
			</div>
		</template>
	</el-card>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

const ruleFormRef = ref<FormInstance>()

definePageMeta({ layout: 'personal' });

interface RuleForm {
	username: string,
	password: string,
}

const form = reactive<RuleForm>({
	username: '',
	password: '',
})

const rules = reactive<FormRules<RuleForm>>({
	username: [
		{ required: true, message: '请输入用户名', trigger: 'change' },
		{ min: 5, message: '用户名需要至少5个字符', trigger: 'change' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'change' },
		{ min: 8, max: 20, message: '密码应为8-16位', trigger: 'change' },
	],
})

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	const valid = await formEl.validate();
	if (valid) {
		console.log('submit!')
	} else {
		console.log('error submit!')
	}
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}

</script>

<style lang="scss" scoped>
.card-header,
.card-bottom,
.card-footer {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>