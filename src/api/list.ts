import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'
import axios from 'axios'
import qs from 'query-string'

export interface CargoTemplate {
  id: number
  name: string
  created_by: string
  type: string
  created_at: string
  period: number
  description: string
  sample_image: any
  cargo_name: string
}

export interface PolicyRecord {
  id: string
  number: number
  name: string
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo'
  filterType: 'artificial' | 'rules'
  count: number
  status: 'online' | 'offline'
  createdTime: string
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number
  pageSize: number
}

export interface PolicyListRes {
  list: PolicyRecord[]
  total: number
}

export interface WarehouseDevice {
  deviceId: string
  deviceType: string
  is_online: boolean
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('dev-api/api/v1/web-get-records', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function getRecordDetails(params: any) {
  return axios.get('dev-api/bind/get-record-details', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function queryBranchTemplate(params: any) {
  return axios.get('dev-api/management/get-templates-under-branch', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function deleteTemplate(data: any) {
  return axios.post('dev-api/management/delete-template', data)
}

export function getTemplateDetails(data: any) {
  return axios.post('dev-api/bind/get-template-details', data)
}

export function warehouseDeviceBind(data: any) {
  return axios.post('dev-api/warehouse/warehouse-device-bind', data)
}

export interface ServiceRecord {
  id: number
  title: string
  description: string
  name?: string
  actionType?: string
  icon?: string
  data?: DescData[]
  enable?: boolean
  expires?: boolean
}
export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection')
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service')
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset')
}

export function queryEmployeeList(params: any) {
  return axios.get('dev-api/management/get-employees', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseDeviceInterface(data: any) {
  return axios.post('dev-api/warehouse/warehouse-device-setting', data)
}

// export function downloadEmployeeTemplate() {
//   return axios.get('dev-api/management/get-employee-import-template')
// }

export function queryBranchCargoList(params: any) {
  return axios.get('dev-api/management/branch-cargo-get', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function queryCargoCurrentRecords(params: any) {
  return axios.get('dev-api/management/get-cargo-current-records', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function queryWarehouses(params: any) {
  return axios.get('dev-api/warehouse/branch-get-warehouses', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function queryDevices(params: any) {
  return axios.get('dev-api/management/branch-get-devices', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseQueryDevices(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-devices', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

