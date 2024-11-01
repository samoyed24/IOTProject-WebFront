<template>
  <a-drawer title="消息盒子" width="50%" :visible="props.visible" @ok="handleClose" @cancel="handleClose">
    <a-form>
      <a-row :gutter="8">
        <a-col :span="15" :flex="1">
          <a-form-item label="事件等级">
            <a-select v-model="messageQueryForm.level" default-value="">
              <a-option value="">全部</a-option>
              <a-option :value="1">
                <icon-exclamation-circle-fill style="color: blue" />
                提醒事件
              </a-option>
              <a-option :value="2">
                <icon-exclamation-circle-fill style="color: orange" />
                警告事件
              </a-option>
              <a-option :value="3">
                <icon-exclamation-circle-fill style="color: red" />
                严重事件
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="15" :flex="1">
          <a-form-item label="是否已读">
            <a-select v-model="messageQueryForm.isRead" default-value="">
              <a-option value="">全部</a-option>
              <a-option :value="false">
                <icon-question-circle-fill style="color: gray" />
                未读
              </a-option>
              <a-option :value="true">
                <icon-check-circle-fill style="color: green" />
                已读
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-list :loading="tableLoading" :data="messageData" :scrollbar="true" :max-height="400" :pagination-props="paginationProps">
      <template #item="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <icon-exclamation-circle-fill size="30" :style="iconExclamationColor(item.messageType)" />
            </template>
            <template #title>
              {{ item.title }}
            </template>
            <template #description>
              {{ item.content }}
              {{ item.time }}(来自{{ item.sender }})
            </template>
          </a-list-item-meta>
          <template #actions>
            <icon-check v-if="!item.isRead" @click="markMessageRead(item.id)" />
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>

<script setup lang="ts">
import { type MessageListType, queryMessageList, setMessageStatus } from '@/api/message'
import { Message } from '@arco-design/web-vue'
import { updateList } from '@/components/navbar/index.vue'
import {computed, reactive, ref, watch} from 'vue'
import form from '@/router/routes/modules/form'

const props = defineProps({
  visible: {
    type: Boolean,
    // default: false,
  },
})

const messageQueryForm = reactive({
  isRead: null as boolean,
  level: null as number,
})

const totalMessage = ref(0)

const currentPage = ref(1)

const paginationProps = computed(() => {
  return {
    defaultPageSize: 20,
    total: totalMessage.value,
    current: currentPage.value,
    onChange: (page) => {
      currentPage.value = page
      fetchSourceData()
    },
  }
})

const emits = defineEmits(['closeEvent'])

const handleClose = () => {
  emits('closeEvent')
}

// const drawerVisible = ref(false)

const messageData = reactive([])

const tableLoading = ref(false)

const setLoading = (loading: boolean) => {
  tableLoading.value = loading
}

const fetchSourceData = async () => {
  setLoading(true)
  try {
    const { data } = await queryMessageList({
      ...messageQueryForm,
      pageSize: paginationProps.value.defaultPageSize,
      current: paginationProps.value.current,
    })
    messageData.splice(0, messageData.length, ...data.list)
    totalMessage.value = data.total
  } catch (err) {
    Message.error(`信息获取失败：${err}`)
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const iconExclamationColor = (level: number) => {
  if (level === 1) {
    return { color: 'blue' }
  }
  if (level === 2) {
    return { color: 'orange' }
  }
  if (level === 3) {
    return { color: 'red' }
  }
  return ''
}

const markMessageRead = async (id: number) => {
  await setMessageStatus({ eventId: id })
  Message.success('消息已阅读')
  await fetchSourceData()
  updateList() // 调用Navbar部件更新a-badge红点信息数量
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchSourceData() // 当 visible 为 true 时加载数据
    }
  },
  { immediate: true }
)

watch(
  () => messageQueryForm,
  () => {
    // console.log(1)
    fetchSourceData()
  },
  { deep: true }
)

// fetchSourceData()
// async function readMessage(data: MessageListType) {
//   await setMessageStatus({ eventId: data[0].id })
//   await fetchSourceData()
//   updateList(messageData.messageList.length) // 调用Navbar部件更新a-badge红点信息数量
// }
</script>

<script lang="ts">
export default {
  name: 'MessageDetails',
}
</script>

<style scoped lang="less"></style>
