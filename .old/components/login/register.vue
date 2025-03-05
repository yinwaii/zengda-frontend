<template>
	<el-card>
		<template #header>
			<div class="card-header">
				<span>注册</span>
			</div>
		</template>
		<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" status-icon>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" type="password" show-password />
			</el-form-item>
			<el-form-item label="确认密码" prop="passwordConfirm">
				<el-input v-model="form.passwordConfirm" type="password" show-password />
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" type="email" />
			</el-form-item>
			<el-form-item label="验证码" prop="emailCode">
				<el-input v-model="form.emailCode" />
			</el-form-item>
		</el-form>
		<div class="card-bottom">
			<nuxt-link to="/personal/login">已经有账号了，直接登录</nuxt-link>
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
	passwordConfirm: string,
	email: string,
	emailCode: string,
}

const form = reactive<RuleForm>({
	username: '',
	password: '',
	passwordConfirm: '',
	email: '',
	emailCode: ''
})

const validateConfirm = (_: any, value: any, callback: any) => {
	if (value !== form.password) {
		callback(new Error('两次密码不一致'))	
	}
	else {
		callback()
	}
}

const rules = reactive<FormRules<RuleForm>>({
	username: [
		{ required: true, message: '请输入用户名', trigger: 'change' },
		{ min: 5, message: '用户名需要至少5个字符', trigger: 'change' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'change' },
		{ pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).*$/, message: '密码应至少包含字母、数字、特殊字符', trigger: 'change' },
		{ min: 8, max: 20, message: '密码应为8-16位', trigger: 'change' },
	],
	passwordConfirm: [
		{ required: true, message: '请再次输入密码', trigger: 'change' },
		{ validator: validateConfirm, trigger: 'change' },
	],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'change' },
		{
			pattern: /^[A-Za-z0-9!#$%&'+/=?^_`{|}~-]+(.[A-Za-z0-9!#$%&'+/=?^_`{|}~-]+)*@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?.)+[A-Za-z0-9]+(-[A-Za-z0-9]+)?$/,
			message: '邮箱格式不正确',
			trigger: 'change',
		}
	],
	emailCode: [
		{ required: true, message: '请输入邮箱验证码', trigger: 'change' },
		{ pattern: /^\d{6}$/, message: '验证码为六位数字', trigger: 'change' },
	]
})

const submitForm = (formEl: FormInstance | undefined) => {
	console.log(formEl)
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			console.log('submit!')
		} else {
			console.log('error submit!')
		}
	})
}

const resetForm = (formEl: FormInstance | undefined) => {
	console.log(formEl)
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