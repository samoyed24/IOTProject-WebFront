<template>
  <div>
    <a-table :columns="columns" :loading="tableLoading" :data="tableData" :pagination="false">
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #deviceType="{ record }">
        <template v-if="record.deviceType === 'warehouse_sensor'">库房温控</template>
        <template v-else-if="record.deviceType === 'bindrole'">录入/质检</template>
        <template v-else-if="record.deviceType === 'check'">读取</template>
        <template v-else-if="record.deviceType === 'warehouse_guard'">库房守卫</template>
        <template v-else-if="record.deviceType === 'transmit'">运输</template>
      </template>
      <template #is_online="{ record }">
        <icon-check-circle-fill v-if="record.is_online" style="color: green" />
        <icon-close-circle-fill v-else style="color: red" />
        <template v-if="record.is_online">在线</template>
        <template v-else>离线</template>
      </template>
      <template #operation="{ record }">
        <a-popconfirm content="确定？" @ok="handleUnbind(record.deviceId)" :ok-loading="unbindLoading">
          <a-button status="danger">解绑</a-button>
        </a-popconfirm>

      </template>
      <template #is_active="{ record }">
        <a-switch
          v-model="record.is_active"
          :loading="switchLoading"
          :before-change="
            (e: string | number | boolean) => {
              handleSwitch(e as boolean, record.deviceId)
            }
          "
        ></a-switch>
      </template>
    </a-table>
    <a-button :long="true" type="primary" @click="modalVisible = true">
      <template #icon>
        <icon-plus></icon-plus>
      </template>
      添加设备
    </a-button>
    <a-modal
      title="添加设备"
      :visible="modalVisible"
      width="50%"
      :ok-loading="okLoading"
      @cancel="modalVisible = false"
      @close="modalVisible = false"
      @ok="submitForm"
    >
      <a-form ref="formRef" :model="deviceAdd">
        <a-form-item
          field="deviceId"
          label="设备唯一标识"
          :rules="[
            {
              required: true,
              message: '请输入设备唯一标识',
            },
          ]"
        >
          <a-input v-model="deviceAdd.deviceId"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { type WarehouseDevice, warehouseDeviceBind, warehouseDeviceInterface, warehouseQueryDevices } from '@/api/list';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue/es/form';
import { defineProps, ref } from 'vue';

const props = defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})
const okLoading = ref(false)
const formRef = ref<FormInstance>()
const submitForm = async () => {
  const res = await formRef.value?.validate()
  if (res) return
  okLoading.value = true
  try {
    const { data } = await warehouseDeviceBind(deviceAdd.value)
    if (data.success) {
      Message.success('设备绑定成功')
      modalVisible.value = false
      await fetchData()
    } else {
      Message.error(data.msg)
    }
  } catch {
    //
  } finally {
    okLoading.value = false
  }
}

const deviceAdd = ref({
  deviceId: '',
  warehouseId: props.warehouseId,
})

const tableData = ref<WarehouseDevice[]>([])

const columns = [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '设备唯一标识',
    dataIndex: 'deviceId',
  },
  {
    title: '类型',
    dataIndex: 'deviceType',
    slotName: 'deviceType',
  },
  {
    title: '状态',
    dataIndex: 'is_online',
    slotName: 'is_online',
  },
  {
    title: '启用',
    dataIndex: 'is_active',
    slotName: 'is_active',
  },
  {
    title: '操作',
    slotName: 'operation',
  },
]

const fetchData = async () => {
  setLoading(true)
  try {
    const params = { warehouseId: props.warehouseId }
    const { data } = await warehouseQueryDevices(params)
    tableData.value = data.list
  } catch {
    // 错误处理逻辑
  } finally {
    setLoading(false)
  }
}

const switchLoading = ref(false)

const generatedeviceSetting = () => {
  return {
    deviceId: '',
    warehouseId: props.warehouseId,
    settings: {
      is_deleted: false,
      is_active: false,
    },
  }
}
const handleSwitch = async (e: boolean, deviceId: string) => {
  switchLoading.value = true
  try {
    const body = generatedeviceSetting()
    body.deviceId = deviceId
    body.settings.is_active = e
    // eslint-disable-next-line no-undef
    const { data } = await warehouseDeviceInterface(body)
    if (!data.success) Message.error(data.msg)
    switchLoading.value = false
    Message.success('操作成功！')
    return data.success
  } catch {
    return false
  }
}

const modalVisible = ref(false)

const tableLoading = ref(false)

const unbindLoading = ref(false)
const handleUnbind = async (deviceId: string) => {
  unbindLoading.value = true
  try {
    const body = generatedeviceSetting()
    body.deviceId = deviceId
    body.settings.is_deleted = true
    // eslint-disable-next-line no-undef
    const { data } = await warehouseDeviceInterface(body)
    if (!data.success) Message.error(data.msg)
    unbindLoading.value = false
    Message.success('操作成功！')
    await fetchData()
    return data.success
  } catch {
    return false
  }
}

const setLoading = (loading: boolean) => {
  tableLoading.value = loading
}
fetchData()
</script>

<script lang="ts">
export default {
  name: 'DeviceManagement',
}
</script>

<style scoped lang="less"></style>
