export interface ZdUser {
	id: number
	username: string
	password: string
	email: string
	phone: string
	role: string
}

export interface ZdSession {
	code: number
	expireTime: number
	id: number
	token: string
}

export class ZdUser implements ZdUser {
	constructor() {
		this.id = -1;
		this.username = '';
		this.password = '';
		this.email = '';
		this.phone = '';
		this.role = '';
	}
}

export interface User {
	userId: number
	deptId: number
	userName: string
	nickName: string
	userType: string
	phonenumber: string
	email: string
	sex: string // 0: 女, 1: 男
	avatar: string
	password: string
	status: string // 0: 正常, 1: 停用
	isAdmin: number // 0: 否, 1: 是
	remark: string
}