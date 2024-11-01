import axios from 'axios'
import qs from "query-string";

export interface MessageRecord {
  id: number
  type: string
  title: string
  subTitle: string
  avatar?: string
  content: string
  time: string
  status: 0 | 1
  messageType?: number
}
export type MessageListType = MessageRecord[]

export function queryMessageList(params: any = {}) {
  return axios.get('dev-api/event/query-person-event', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
  })
}

interface MessageStatus {
  ids: number[]
}

export function setMessageStatus(data: { eventId: number }) {
  return axios.post<MessageListType>('dev-api/event/event-is-read', data)
}

export interface ChatRecord {
  id: number
  username: string
  content: string
  time: string
  isCollect: boolean
}

export function queryChatList() {
  return axios.post<ChatRecord[]>('/api/chat/list')
}
