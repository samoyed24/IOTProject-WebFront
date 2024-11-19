<template>
  <a-tabs v-model:active-key="activeTab" position="left">
    <a-tab-pane :key="1">
      <template #title>
        <icon-user />
        生产安全
      </template>
      <a-form-item label="门禁管理">
        <a-switch></a-switch>
      </a-form-item>
      <a-form-item>
        <a-auto-complete
          v-model="searchContent"
          :data="employeeData"
          placeholder="请输入手机号进行访问人员添加，支持姓名/手机号/邮箱模糊搜索"
          @search="handleSearch"
        />
        <a-button type="primary" :loading="addLoading" :disabled="!searchContent" @click="handleAdd">
          <template #icon><icon-user-add /></template>
        </a-button>
      </a-form-item>
      <a-table :data="tableData" :columns="gateColumns" :loading="tableLoading">
        <template #is_allowed="{ record }">
          <template v-if="record.is_allowed">
            <icon-check-circle-fill style="color: green" />
            允许
          </template>
          <template v-else>
            <icon-question-circle-fill style="color: red" />
            不允许
          </template>
        </template>
        <template #operations="{ record }">
          <a-button size="small" status="normal" type="text" @click="handleAuthInfoShow(record.id)">鉴权信息</a-button>
          <a-modal :visible="authInfoUser != -1" :footer="false" :title="`${record.name}在库房的鉴权信息`" @cancel="authInfoUser = -1">
            <a-form>
              <a-form-item label="人脸信息">
                <a-upload
                  accept=".jpg, .jpeg"
                  :show-file-list="false"
                  action="dev-api/warehouse/user-authinfo-update"
                  :data="{ item: 'face_recognition', employee: record.id }"
                  :disabled="authUploadStatus.face_recognition"
                  @success="
                    (resp) => {
                      authUploadStatus.face_recognition = false
                      if (!resp.response.status) {
                        Message.error(resp.response.data.errorMsg)
                      } else {
                        Message.success('鉴权信息已更新')
                      }
                      fetchAuthInfo(record.id)
                    }
                  "
                  @error="
                    (e: any) => {
                      authUploadStatus.face_recognition = false
                      Message.error(e.response.errorMsg)
                    }
                  "
                  @before-upload="
                    () => {
                      authUploadStatus.face_recognition = true
                      Message.info('文件已上传，请等待后端服务器返回结果...')
                      return true
                    }
                  "
                />
                <template #extra>
                  当前状态：
                  <template v-if="authInfo.face_recognition == null">
                    <icon-loading />
                    获取中
                  </template>
                  <template v-else-if="authInfo.face_recognition == true">
                    <icon-check-circle-fill />
                    已录入
                  </template>
                  <template v-else>
                    <icon-question-circle-fill />
                    待录入
                  </template>
                </template>
              </a-form-item>
              <a-form-item label="声纹信息">
                <a-upload
                  accept=".mp3, .wav"
                  :show-file-list="false"
                  action="dev-api/warehouse/user-authinfo-update"
                  :data="{ item: 'voice_vector', employee: record.id }"
                  :disabled="authUploadStatus.voice_vector"
                  @success="
                    (resp) => {
                      authUploadStatus.voice_vector = false
                      if (!resp.response.status) {
                        Message.error(resp.response.data.errorMsg)
                      } else {
                        Message.success('鉴权信息已更新')
                      }
                      fetchAuthInfo(record.id)
                    }
                  "
                  @error="
                    (e: any) => {
                      authUploadStatus.voice_vector = false
                      Message.error(e.response.errorMsg)
                    }
                  "
                  @before-upload="
                    () => {
                      authUploadStatus.voice_vector = true
                      Message.info('文件已上传，请等待后端服务器返回结果...')
                      return true
                    }
                  "
                />
                <template #extra>
                  当前状态：
                  <template v-if="authInfo.voice_vector == null">
                    <icon-loading />
                    获取中
                  </template>
                  <template v-else-if="authInfo.voice_vector == true">
                    <icon-check-circle-fill />
                    已录入
                  </template>
                  <template v-else>
                    <icon-question-circle-fill />
                    待录入
                  </template>
                </template>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-popconfirm content="确定？" @ok="cancelUser(record.id)">
            <a-button size="small" status="danger" type="text">取消</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane :key="2">
      <template #title>
        <icon-fire />
        防火安全
      </template>
    </a-tab-pane>
    <a-tab-pane :key="3">
      <template #title>
        <icon-lock />
        防盗安全
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { warehouseAuthInfoGet, warehouseQueryEmployees, warehouseUserDelete, warehouseUserGet, warehouseUserUpdate } from '@/api/list'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const activeTab = ref(1)

const searchContent = ref('')
const employeeData = reactive([])

const handleSearch = async () => {
  await nextTick(async () => {
    try {
      const { data } = await warehouseQueryEmployees({
        kw: searchContent.value,
      })
      employeeData.splice(0, employeeData.length, ...data.list)
    } catch (err) {
      //
    }
  })
}

const addLoading = ref(false)
const handleAdd = async () => {
  try {
    addLoading.value = true
    const data = {
      warehouseId: props.warehouseId,
      username: searchContent.value,
    }
    await warehouseUserUpdate(data)
    Message.success('添加成功')
  } catch (err) {
    Message.error(`添加失败：${err}`)
  } finally {
    await fetchData()
    addLoading.value = false
  }
}

const gateColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
  },
  {
    title: '允许进入',
    dataIndex: 'is_allowed',
    slotName: 'is_allowed',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
]

const tableLoading = ref(false)

const tableData = reactive([])

const fetchData = async () => {
  try {
    tableLoading.value = true
    const { data } = await warehouseUserGet({ warehouseId: props.warehouseId })
    tableData.splice(0, tableData.length, ...data)
  } catch (err) {
    Message.error(err)
  } finally {
    tableLoading.value = false
  }
}

const cancelUser = async (telephone: string) => {
  try {
    tableLoading.value = true
    const { data } = await warehouseUserDelete({
      warehouseId: props.warehouseId,
      telephone,
    })
    Message.success('删除成功')
  } catch (err) {
    Message.error(err)
  } finally {
    await fetchData()
    tableLoading.value = false
  }
}

const authInfoUser = ref(-1)

const authInfo = reactive({
  face_recognition: null as boolean,
  voice_vector: null as boolean,
})

const authUploadStatus = reactive({
  face_recognition: false,
  voice_vector: false,
})

const handleAuthInfoShow = (id: number) => {
  authInfoUser.value = id
  Object.assign(authInfo, generateAuthInfoModel())
  Object.assign(authUploadStatus ,generateUploadStatus())
  fetchAuthInfo(id)
}

const fetchAuthInfo = async (id: number) => {
  try {
    const { data } = await warehouseAuthInfoGet({ employee: id })
    Object.assign(authInfo, data)
  } catch (err) {
    Message.error(err)
  }
}

const generateAuthInfoModel = () => {
  return {
    face_recognition: null as boolean,
    voice_vector: null as boolean,
  }
}

const generateUploadStatus = () => {
  return {
    face_recognition: false,
    voice_vector: false,
  }
}

fetchData()
</script>

<script lang="ts">
export default {
  name: 'SafetyManagement',
}
</script>

<style scoped lang="less"></style>
