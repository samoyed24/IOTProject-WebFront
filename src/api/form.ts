import axios from 'axios'
import qs from 'query-string'

export interface BaseInfoModel {
  activityName: string
  channelType: string
  promotionTime: string[]
  promoteLink: string
}
export interface ChannelInfoModel {
  advertisingSource: string
  advertisingMedia: string
  keyword: string[]
  pushNotify: boolean
  advertisingContent: string
}

export interface TemplateModel {
  cargoName: string
  type: string
  description: string
  period: string
}

export interface WarehousePropertiesModel {
  temperature: {
    upper: number
    lower: number
  }
  humidity: {
    upper: number
    lower: number
  }
}

export type UnitChannelModel = BaseInfoModel & ChannelInfoModel

export function submitChannelForm(data: UnitChannelModel) {
  return axios.post('/api/channel-form/submit', { data })
}

export function submitBranchTemplateCreateForm(data: FormData) {
  return axios.post('dev-api/management/create-branch-template', data)
}

export function submitBranchWarehouseRegisterForm(data: any) {
  return axios.post('dev-api/warehouse/branch-warehouse-register', data)
}

export function phoneNumberValidate(params: any) {
  return axios.get('dev-api/management/phone-number-validate', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function submitEmployeeAddForm(data: any) {
  return axios.post('dev-api/management/branch-employee-add', data)
}
