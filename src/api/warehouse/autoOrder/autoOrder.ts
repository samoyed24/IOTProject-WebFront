import axios from 'axios'
import qs from 'query-string'

export enum AutoOrderAccording {
  WEIGHT = 'WEIGHT',
  QUANTITY = 'QUANTITY',
}

export default {
  'autoOrderAccording.WEIGHT': '货物总重量',
  'autoOrderAccording.QUANTITY': '货物件数',
  'autoOrderTimePriority.ENTER': '最先入库优先',
  'autoOrderTimePriority.SPOIL': '最先到期优先',
  'autoOrderWeightPriority.LIGHT': '小重量优先',
  'autoOrderWeightPriority.HEAVY': '大重量优先',
  'autoOrderWeightPriority.RANDOM': '随机',
  'autoOrderPriorityStrategy.TIME': '时间优先级优先',
  'autoOrderPriorityStrategy.WEIGHT': '重量优先级优先',
}

interface TemplateQuery {
  warehouseId: number
  cargoName: string
}

export interface TemplateQueryResult {
  cargoName: string
  cargoType: string
  id: number
}

export enum TimePriority {
  ENTER = 'ENTER',
  SPOIL = 'SPOIL',
}

export enum WeightPriority {
  LIGHT = 'LIGHT',
  HEAVY = 'HEAVY',
  RANDOM = 'RANDOM',
}

export enum PriorityStrategy {
  TIME = 'TIME',
  WEIGHT = 'WEIGHT',
}

export interface AutoOrder {
  template: TemplateQueryResult
  according: AutoOrderAccording
  weight: number | null
  quantity: number | null
  timePriority: TimePriority
  weightPriority: WeightPriority
  priorityStrategy: PriorityStrategy
}

export interface OrderToSubmit {
  order: AutoOrder
  checkResult: {
    status: number
    message: string
  }
}

export interface AutoOrderSubmitForm {
  orders: OrderToSubmit[]
  warehouseId: number
}

export interface FinalOrder {
  uuid: string
  cargoName: string
  type: string
  weight: number
  enterTime: string
  expiredAt: string
}

export interface OrderCheckResult {
  orders: OrderToSubmit[]
  status: boolean
  finalOrder: FinalOrder[]
}

export function warehouseTemplateAutoCompleteQuery(params: TemplateQuery) {
  return axios.get('dev-api/warehouse/warehouse-template-auto-complete-query', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

export function warehouseAutoOrderCheck(params: AutoOrderSubmitForm) {
  return axios.post('dev-api/warehouse/warehouse-auto-order-check', params)
}
