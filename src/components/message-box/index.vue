<template>
  <a-spin style="display: block" :loading="loading">
    <a-scrollbar style="height: 300px; overflow: auto">
      <a-tabs v-model:active-key="messageType" type="rounded" destroy-on-hide>
        <a-tab-pane v-for="item in tabList" :key="item.key">
          <template #title>
            <span>{{ item.title }}{{ formatUnreadLength(item.key) }}</span>
          </template>
          <a-result v-if="!renderList.length" status="404">
            <template #subtitle>{{ $t('messageBox.noContent') }}</template>
          </a-result>
          <List :render-list="renderList" :unread-count="unreadCount" />
        </a-tab-pane>
      </a-tabs>
    </a-scrollbar>

    <a-button type="primary" long="long" @click="setDetailsShow(true)">查看更多</a-button>
  </a-spin>
</template>

<script lang="ts" setup>
import { type MessageListType, type MessageRecord, queryMessageList, setMessageStatus } from '@/api/message'
import useLoading from '@/hooks/loading'
import MessageDetails from '@/components/message-box/message-details.vue'
import { Message } from '@arco-design/web-vue'
import { computed, reactive, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { setDetailsShow, updateList } from '@/components/navbar/index.vue'
import List from './list.vue'

interface TabItem {
  key: string
  title: string
  avatar?: string
}
const { loading, setLoading } = useLoading(true)
const messageType = ref('notice')
const { t } = useI18n()
const messageData = reactive<{
  renderList: MessageRecord[]
  messageList: MessageRecord[]
}>({
  renderList: [],
  messageList: [],
})

toRefs(messageData)
const tabList: TabItem[] = [
  {
    key: 'notice',
    title: t('messageBox.tab.title.notice'),
  },
]

async function fetchSourceData() {
  setLoading(true)
  try {
    const { data } = await queryMessageList({
      isRead: false,
    })
    messageData.messageList = data.list
    updateList(messageData.messageList.length)
  } catch (err) {
    Message.error(`信息获取失败：${err}`)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
async function readMessage(data: MessageListType) {
  await setMessageStatus({ eventId: data[0].id })
  await fetchSourceData()
  updateList(messageData.messageList.length) // 调用Navbar部件更新a-badge红点信息数量
}
const renderList = computed(() => {
  return messageData.messageList.filter((item) => messageType.value === item.type)
})
const unreadCount = computed(() => {
  return renderList.value.filter((item) => !item.status).length
})
const getUnreadList = (type: string) => {
  const list = messageData.messageList.filter((item) => item.type === type && !item.status)
  return list
}
const formatUnreadLength = (type: string) => {
  const list = getUnreadList(type)
  return list.length ? `(${list.length})` : ``
}
const handleItemClick = (items: MessageListType) => {
  if (renderList.value.length) readMessage([...items])
}
fetchSourceData()
</script>

<style scoped lang="less">
:deep(.arco-popover-popup-content) {
  padding: 0;
}

:deep(.arco-list-item-meta) {
  align-items: flex-start;
}
:deep(.arco-tabs-nav) {
  padding: 14px 0 12px 16px;
  border-bottom: 1px solid var(--color-neutral-3);
}
:deep(.arco-tabs-content) {
  padding-top: 0;
  .arco-result-subtitle {
    color: rgb(var(--gray-6));
  }
}
</style>
