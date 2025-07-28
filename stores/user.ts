import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEntityApis } from '~/composables/use-entity-apis'

export const useUserStore = defineStore('userStore', () => {
	const token = ref('')
	const expireTime = ref('')
	const previousUsername = ref('')
	const isAuthenticated = ref(false)
	const entityApis = useEntityApis();
	const lastSave = ref(false)

	const login = async (username: string, password: string, save: boolean = false) => {
		try {
			const result = await entityApis.user.login(username, password)
			// 保存到 store 和 sessionStorage
			token.value = result.token
			expireTime.value = String(result.expireTime)
			isAuthenticated.value = true
			if (save) {
				previousUsername.value = username
				lastSave.value = true
			}

			// 保存到 cookie
			const cookie = useCookie('Admin-Token', {
				maxAge: Number(expireTime.value),
				path: '/',
				secure: true,
				sameSite: 'strict'
			})
			cookie.value = token.value
		} catch (error) {
			throw error
		}
	}

	const logout = () => {
		token.value = ''		
		expireTime.value = ''
		isAuthenticated.value = false

		// 清除 cookie
		const cookie = useCookie('Admin-Token')
		cookie.value = null
	}

	const checkAuth = () => {
		// console.log(isAuthenticated.value, token.value, expireTime.value)
		return isAuthenticated.value && token.value && expireTime.value
	}

	const getPreviousUsername = () => {
		return previousUsername.value
	}

	return {
		token,
		previousUsername,
		expireTime,
		isAuthenticated,
		login,
		logout,
		checkAuth,
		getPreviousUsername,
		lastSave
	}
}, {
	persist: {
		storage: piniaPluginPersistedstate.cookies(),
	}
})