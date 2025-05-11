<template>
	<div class="login-form flex flex-col items-center w-full">
		<h2 class="login-title text-2xl font-bold mb-6">登录</h2>

		<form class="w-1/2 space-y-6" @submit.prevent="submitForm">
			<!-- Username Input -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">用户名</label>
				<input v-model="form.username" type="text"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					:class="{ 'border-red-500': errors.username }" />
				<p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
			</div>

			<!-- Password Input -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">密码</label>
				<input v-model="form.password" type="password"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					:class="{ 'border-red-500': errors.password }" />
				<p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
			</div>

			<!-- Remember Me and Forgot Password -->
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<input type="checkbox" id="remember" class="h-4 w-4 text-blue-600 rounded" />
					<label for="remember" class="ml-2 text-sm text-gray-700">记住我</label>
				</div>
				<nuxt-link @click="forgetPassword" class="text-sm text-blue-600 hover:underline">
					忘记密码
				</nuxt-link>
			</div>

			<!-- Buttons -->
			<div class="flex flex-col sm:flex-row justify-between gap-4">
				<button type="submit"
					class="w-full sm:w-[47%] bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
					@onclick="submitForm">
					登录
				</button>
				<button type="button" @click="register"
					class="w-full sm:w-[47%] bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors">
					注册
				</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useToast } from '~/components/ui/toast/use-toast';

interface RuleForm {
	username: string;
	password: string;
}

const form = reactive<RuleForm>({
	username: '',
	password: '',
});

const errors = reactive({
	username: '',
	password: '',
});

const router = useRouter();
const userStore = useUserStore();
const { toast } = useToast();

const validateForm = () => {
	errors.username = '';
	errors.password = '';

	// Username validation
	if (!form.username) {
		errors.username = '请输入用户名';
	} else if (form.username.length < 5) {
		errors.username = '用户名需要至少5个字符';
	}

	// Password validation
	if (!form.password) {
		errors.password = '请输入密码';
	} else if (form.password.length < 5 || form.password.length > 20) {
		errors.password = '密码应为5-20位';
	}

	return !errors.username && !errors.password;
};

const submitForm = async () => {
	if (validateForm()) {
		try {
			await userStore.login(form.username.trim(), form.password);
			router.push('/');
		}
		catch (error: any) {
			console.error('登录失败:', error);
			// 使用 Toast 显示错误信息
			toast({
				variant: "destructive",
				title: "登录失败",
				description: error.message || '请检查用户名和密码是否正确',
			});
		}
	} else {
		// 表单验证失败时也显示 Toast
		toast({
			variant: "destructive",
			title: "表单验证失败",
			description: "请检查输入信息是否正确",
		});
	}
};

const forgetPassword = () => {
	console.log('forgetPassword');
};

const register = () => {
	router.push('/personal/register');
};
</script>
