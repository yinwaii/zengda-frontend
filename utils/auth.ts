import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
//定义token过期时间的key
const timeKey = "expireTime";

/**
 * 获取token
 * @returns 
 */
export function getToken() {
	return Cookies.get(TokenKey)
}

/**
 * 设置token
 * @param  token 
 * @returns 
 */
export function setToken(token: string) {
	return Cookies.set(TokenKey, token)
}

/**
 * 删除token
 * @returns 
 */
export function removeToken() {
	return Cookies.remove(TokenKey)
}

/**
 * 清空sessionStorage
 * @returns 
 */
export function clearStorage() {
	return sessionStorage.clear();
}

/**
* 设置token过期时间
* @returns
*/
export function setTokenTime(time: number) {
	return sessionStorage.setItem(timeKey, time.toString());
}

/**
 * 获取token过期时间
 * @returns 
 */
export function getTokenTime() {
	return sessionStorage.getItem(timeKey);
}

/**
* 清空token过期时间
* @returns
*/
export function removeTokenTime() {
	return sessionStorage.setItem(timeKey, '0');
}