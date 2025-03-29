import type { TableData } from '@arco-design/web-vue/es/table/interface'
import axios from 'axios'
import qs from "query-string";

export interface ContentDataRecord {
  x: string
  y: number
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('api/content-data')
}

export function branchQueryInOutStatistics() {
  return axios.get('dev-api/management/branch-query-in-out-statistics')
}

export function branchQueryTypeStatistics() {
  return axios.get('dev-api/management/branch-query-type-statistics')
}

export interface PopularRecord {
  key: number
  clickNumber: string
  title: string
  increases: number
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params })
}

export function branchTemplateCategoryStatistics(params: any) {
  return axios.get('dev-api/management/branch-template-category-statistics', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export interface BranchBasicStatistics {
  totalCount: number
  hour24Count: number
  inWareCount: number
  inWare24Count: number
  outWare24Count: number
  waitingOrderCount: number
  cargoSpoilCount: number
  storageChangeCompareYesterday: number
  event24Count: number
}

export function queryBranchBasicStatistics() {
  return axios.get('dev-api/management/branch-get-basic-statistics')
}
