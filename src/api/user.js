import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/api/user/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'post',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data,
  })
}
