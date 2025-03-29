import type { GeneralChart } from '@/types/global'
import axios from 'axios'
import qs from 'query-string'
import type { PolicyListRes } from '@/api/list'

export interface ChartDataRecord {
  x: string
  y: number
  name: string
}
export interface DataChainGrowth {
  quota: string
}

export interface DataChainGrowthRes {
  count: number
  growth: number
  chartData: {
    xAxis: string[]
    data: { name: string; value: number[] }
  }
}
export function queryDataChainGrowth(data: DataChainGrowth) {
  return axios.post<DataChainGrowthRes>('/api/data-chain-growth', data)
}

export interface PopularAuthorRes {
  list: {
    ranking: number
    author: string
    contentCount: number
    clickCount: number
  }[]
}

export function queryPopularAuthor() {
  return axios.get<PopularAuthorRes>('/api/popular-author/list')
}

export interface ContentPublishRecord {
  x: string[]
  y: number[]
  name: string
}

export function queryContentPublish() {
  return axios.get<ContentPublishRecord[]>('/api/content-publish')
}

export function queryContentPeriodAnalysis() {
  return axios.post<GeneralChart>('/api/content-period-analysis')
}

export interface PublicOpinionAnalysis {
  quota: string
}
export interface PublicOpinionAnalysisRes {
  count: number
  growth: number
  chartData: ChartDataRecord[]
}
export function queryPublicOpinionAnalysis(data: DataChainGrowth) {
  return axios.post<PublicOpinionAnalysisRes>('/api/public-opinion-analysis', data)
}
export interface DataOverviewRes {
  xAxis: string[]
  data: Array<{ name: string; value: number[]; count: number }>
}

export interface WarehouseDevice {
  warehouseId: number
  pastHours ?: number
  pastDays: number
}

export interface WarehouseProps {
  warehouseName: string
  warehouseId: number
}

export function queryDataOverview() {
  return axios.post<DataOverviewRes>('/api/data-overview')
}

export function queryWarehouseTemphumid(params: WarehouseDevice) {
  return axios.get<PolicyListRes>('dev-api/warehouse/get-warehouse-temphumid', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}
