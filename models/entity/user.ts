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