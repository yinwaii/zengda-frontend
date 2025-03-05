<template>
    <div class="login-form">
        <span class="login-title">登录</span>   
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" show-password />
            </el-form-item>
            <el-form-item>
                <el-row justify="space-between">
                    <el-checkbox label="记住我" />
                    <nuxt-link @click="forgetPassword">忘记密码</nuxt-link>
                </el-row>
            </el-form-item>
            <!-- <nuxt-link to="/personal/register">尚未拥有账号，开始注册</nuxt-link> -->
            <el-row justify="space-between">
                <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
                <el-button size="large" @click="register">注册</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
const ruleFormRef = ref<FormInstance>()

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

const forgetPassword = () => {
    console.log('forgetPassword')
}

const router = useRouter()
const register = () => {
    router.push('/personal/register')
}

</script>

<style lang="scss" scoped>
.login-title{
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}
.el-form{
  width: 50%;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-row {
  width: 100%;
}

.el-button {
  width: 47%;
}

@media (max-width: 468px) {
  .el-row {
    display: flex;
    justify-content: space-between;
  }
  .el-button {
    width: 100%;
    margin: 0 0 10px 0 ;
  }
}
</style>