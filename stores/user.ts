export const useUserStore = defineStore('userStore', {
	state: () => ({
		token: getToken(),//获取token信息
		name: '',
		avatar: '',
		introduction: '',
		roles: []
	}),
	actions: {
		// 用户登录
		async login(username: string, password: string) {
			// 调用src/api/user.js文件中的login()方法
			const { token, expireTime } = await ZdUser.login(username.trim(), password)
			console.log(token, expireTime)
			// 将返回的token数据保存到store中，作为全局变量使用
			this.token = token
			// 将token信息保存到cookie中
			setToken(token)
			//设置过期时间
			setTokenTime(expireTime)
		},

		// // 获取当前登录的用户
		// getInfo({ commit, state }) {
		// 	return new Promise((resolve, reject) => {
		// 		//调用api/user里面的getInfo方法获取用户信息和权限信息
		// 		getInfo(state.token).then(response => {
		// 			const { data } = response

		// 			if (!data) {
		// 				reject('Verification failed, please Login again.')
		// 			}
		// 			//解构出用户id
		// 			const { roles, name, avatar, introduction, id } = data

		// 			// roles must be a non-empty array
		// 			if (!roles || roles.length <= 0) {
		// 				reject('getInfo: roles must be a non-null array!')
		// 			}
		// 			//将权限字段保存到sessionStorage中
		// 			commit('SET_ROLES', roles)
		// 			commit('SET_NAME', name)
		// 			commit('SET_AVATAR', avatar)
		// 			commit('SET_INTRODUCTION', introduction)
		// 			//将用户id保存到vuex中
		// 			commit('SET_USERUID', id)
		// 			//将权限字段保存到sessionStorage中
		// 			// sessionStorage.setItem("codeList",JSON.stringify(roles));
		// 			resolve(data)
		// 		}).catch(error => {
		// 			reject(error)
		// 		})
		// 	})
		// },

		// // user logout
		// logout({ commit, state, dispatch }) {
		// 	return new Promise((resolve, reject) => {
		// 		logout(state.token).then(() => {
		// 			commit('SET_TOKEN', '')
		// 			commit('SET_ROLES', [])
		// 			removeToken()
		// 			resetRouter()

		// 			// reset visited views and cached views
		// 			// to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
		// 			dispatch('tagsView/delAllViews', null, { root: true })

		// 			resolve()
		// 		}).catch(error => {
		// 			reject(error)
		// 		})
		// 	})
		// },

		// // remove token
		// resetToken({ commit }) {
		// 	return new Promise(resolve => {
		// 		commit('SET_TOKEN', '')
		// 		commit('SET_ROLES', [])
		// 		removeToken()
		// 		resolve()
		// 	})
		// },

		// // dynamically modify permissions
		// async changeRoles({ commit, dispatch }, role) {
		// 	const token = role + '-token'

		// 	commit('SET_TOKEN', token)
		// 	setToken(token)

		// 	const { roles } = await dispatch('getInfo')

		// 	resetRouter()

		// 	// generate accessible routes map based on roles
		// 	const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
		// 	// dynamically add accessible routes
		// 	router.addRoutes(accessRoutes)

		// 	// reset visited views and cached views
		// 	dispatch('tagsView/delAllViews', null, { root: true })
		// }
	}
})