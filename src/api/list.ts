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
  temp: number
  humid: number
  description: string
  sample_image: any
  cargo_name: string
}

export interface ControlPanelItem {
  apply: false
  smartHumid: false
  water: false
  wind: false
  smartLight: false
  light: false
}

export interface WarehouseProps {
  warehouseName: string
  warehouseId: number
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
  x: number[]
  data: [
    {
      name: string
      value: number[]
    },
    {
      name: string
      value: number[]
    },
  ]
}

export interface WarehouseDevice {
  deviceId: string
  deviceType: string
  is_online: boolean
}

export interface ExtraOptions {
  isEnabled: boolean
  warningEvent: {
    enable: boolean
    temperature: {
      enable: boolean
      upper: number
      lower: number
    }
    humidity: {
      enable: boolean
      upper: number
      lower: number
    }
  }
  reminderEvent: {
    enable: boolean
    temperature: {
      enable: boolean
      upper: number
      lower: number
    }
    humidity: {
      enable: boolean
      upper: number
      lower: number
    }
  }
  seriousEvent: {
    enable: boolean
    temperature: {
      enable: boolean
      upper: number
      lower: number
    }
    humidity: {
      enable: boolean
      upper: number
      lower: number
    }
  }
}
export interface WarehousesInfo {
  id: number
  name: string
  company: string
  branch: string
  description: string
  temperature_pivot: number
  humidity: {
    lower: number
    upper: number
  }
  extraOptions: ExtraOptions
}

export interface WarehouseParamSubmit {
  id: number
  name: string
  temperature_pivot: number
  humidity: {
    lower: number
    upper: number
  }
  extraOptions: ExtraOptions
}

export interface ShelfData {
  deviceId: string
  locCol: number
  locRow: number
  shelfCol: number
  shelfRow: number
  shelfId: number
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

export function warehouseUserUpdate(data: any) {
  return axios.post('dev-api/warehouse/warehouse-user-update', data)
}

export function warehouseUserGet(params: any) {
  return axios.get('dev-api/warehouse/warehouse-user-get', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseUserDelete(data: any) {
  return axios.post('dev-api/warehouse/warehouse-user-delete', data)
}

export function warehouseDeviceBind(data: any) {
  return axios.post('dev-api/warehouse/warehouse-device-bind', data)
}

export function warehouseAuthInfoGet(params: any) {
  return axios.get('dev-api/warehouse/warehouse-authinfo-get', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
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

export function warehouseParamsUpdate(data: WarehouseParamSubmit) {
  return axios.post('dev-api/warehouse/warehouse-params-update', data)
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

export function warehouseFetchFunctionStatus(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-function-status', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseControlPanelGet(params: any) {
  return axios.get('dev-api/warehouse/warehouse-control-panel-get', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseControlPanelSubmit(data: any) {
  return axios.post('dev-api/warehouse/warehouse-control-panel-update', data)
}

export function warehouseQueryDevices(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-devices', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseDeviceShelfGet(params: any) {
  return axios.get('dev-api/warehouse/warehouse-device-shelf-get', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseDeviceShelfSet(data: any) {
  return axios.post('dev-api/warehouse/warehouse-device-shelf-set', data)
}

export function warehouseGetEvents(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-events', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseEventMark(data: any) {
  return axios.post('dev-api/warehouse/warehouse-event-mark', data)
}

export function warehouseEventDetails(params: any) {
  return axios.get('dev-api/warehouse/warehouse-event-details', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseGetAdmin(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-admin', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseQueryEmployees(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-employees-by-keywords', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseAddAdmin(data: any) {
  return axios.post('dev-api/warehouse/warehouse-add-admin', data)
}

export function warehouseCancelAdmin(data: any) {
  return axios.post('dev-api/warehouse/warehouse-cancel-admin', data)
}

export function wareHouseGetById(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-by-id', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function getIamToken() {
  return axios.get('dev-api/huawei/huawei-get-iam-token')
}

export function deviceSettingsChange(data: any) {
  return axios.post('dev-api/management/device-settings-change', data)
}

// 由于调第三方接口，没有正确返回wrapper，所以用fetch，以防error
export function warehouseMonitor(token: string, deviceId: string) {
  return fetch(`iotda-api/v5/iot/624907afb1634bad885e26827aceb360/devices/${deviceId}/shadow`, {
    headers: {
      'x-auth-token': token,
    },
  })
}

export function warehouseGetStorage(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-storage', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseQueryAllCargo(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-all-cargo', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function cargoQueryLocation(params: any) {
  return axios.get('dev-api/cargo/cargo-query-location', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseQueryAllShelves(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-all-shelves', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseShelfQueryCargo(params: any) {
  return axios.get('dev-api/warehouse/warehouse-shelf-query-cargo', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseGetCargo(params: any) {
  return axios.get('dev-api/warehouse/warehouse-get-cargo', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseQueryAtGateRecords(params: any) {
  return axios.get('dev-api/warehouse/warehouse-query-at-gate-records', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}
