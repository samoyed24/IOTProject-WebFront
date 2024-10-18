import type { UserState } from '@/store/modules/user/types'
import axios from 'axios'
import type { RouteRecordNormalized } from 'vue-router'

export interface LoginData {
  username: string
  password: string
}

export interface LoginRes {
  token: string
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('dev-api/api/v1/web-login', data)
}

export function logout() {
  return axios.post<LoginRes>('dev-api/api/v1/web-logout')
}

export function getUserInfo() {
  return axios.post<UserState>('dev-api/api/v1/get-user-info')
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('dev-api/api/user/menu')
}
