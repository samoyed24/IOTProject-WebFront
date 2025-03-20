<template>
  <div>
    <a-spin :loading="pageLoading" style="width: 100%">
      <a-tabs :direction="'vertical'">
        <a-tab-pane :key="1">
          <template #title>
            <icon-settings />
            基本参数
          </template>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-statistic title="当前库存货物" :value="storageData.currentStorage" animation />
            </a-col>
            <a-col :span="12">
              <a-statistic title="最大库存容量" :value="storageData.maxStorage" animation />
            </a-col>
          </a-row>
          <a-form-item label="库存容量（件）">
            <template #help>
              <icon-exclamation-circle />
              注意，仅当库房内无货物时，您方可修改库存容量。
            </template>
            <a-input-number :disabled="!storageChangeable" :model-value="storageValue" :min="1" :max="100000">
              <template #append>
                <a-button :loading="saveLoading" @click="changeMaxStorage">
                  <icon-save />
                </a-button>
              </template>
            </a-input-number>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane :key="2">
          <template #title>
            <icon-storage />
            货架配置
          </template>
          <a-form ref="formRef" :model="shelfExistInfo">
            <a-form-item label="请选择货架监控">
              <a-select
                placeholder="请选择"
                :options="devices"
                :loading="deviceFetchLoading"
                :v-model="selectedDevice"
                @change="fetchShelf"
              />
            </a-form-item>
            <a-form-item field="shelfRow" label="货架行" :rules="[{ required: true, message: '请输入货架行' }]">
              <a-input-number
                v-model="shelfExistInfo.shelfRow"
                :min="1"
                :max="999"
                placeholder="1~999"
                :step="1"
                :disabled="shelfExistInfo.shelfExist"
              ></a-input-number>
            </a-form-item>
            <a-form-item field="shelfCol" label="货架列" :rules="[{ required: true, message: '请输入货架列' }]">
              <a-input-number
                v-model="shelfExistInfo.shelfCol"
                :min="1"
                :max="999"
                placeholder="1~999"
                :step="1"
                :disabled="shelfExistInfo.shelfExist"
              ></a-input-number>
            </a-form-item>
            <a-form-item>
              <a-button status="success" :disabled="shelfExistInfo.shelfExist || !selectedDevice" long @click="handleShelfSubmit">
                提交
              </a-button>
              <template #extra>
                <icon-exclamation-circle-fill />
                注意：货架配置后将无法修改。
              </template>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { defineProps, nextTick, reactive, ref } from 'vue'
import { warehouseDeviceShelfGet, warehouseDeviceShelfSet, warehouseGetStorage, warehouseQueryDevices } from '@/api/list'

const props = defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})

const storageData = reactive({
  currentStorage: 0,
  maxStorage: 0,
})

const pageLoading = ref(true)

const storageValue = ref(null)

const storageChangeable = ref(false)

const fetchData = async () => {
  pageLoading.value = true
  try {
    const params = { warehouseId: props.warehouseId }
    const { data } = await warehouseGetStorage(params)
    storageData.maxStorage = data.max_storage
    storageData.currentStorage = data.current_storage
    storageValue.value = storageData.maxStorage
    storageChangeable.value = storageData.currentStorage === 0
  } catch {
    // 错误处理逻辑
    Message.error('error')
  } finally {
    await nextTick(() => {
      pageLoading.value = false
    })
  }
}

const saveLoading = ref(false)

const changeMaxStorage = async () => {
  saveLoading.value = true
  try {
    // TODO 待实现
  } catch {
    // TODO
  } finally {
    await nextTick(() => {
      saveLoading.value = false
    })
  }
}

fetchData()

const deviceFetchLoading = ref(true)

const devices = reactive([])

const fetchDevices = async () => {
  try {
    const { data } = await warehouseQueryDevices({
      warehouseId: props.warehouseId,
    })
    const fetchDevices = data.list
    fetchDevices.forEach((device: any) => {
      if (device.deviceType === 'warehouse_cargo_shelf') {
        devices.push({
          label: `${device.deviceName}(${device.deviceId})`,
          value: device.deviceId,
        })
      }
    })
  } catch {
    //
  } finally {
    deviceFetchLoading.value = false
  }
}

fetchDevices()

const shelfExistInfo = reactive({
  shelfExist: false,
  shelfCol: null,
  shelfRow: null,
})

const selectedDevice = ref('')

const formRef = ref(null)

const fetchShelf = async (e: string) => {
  selectedDevice.value = e
  try {
    const { data } = await warehouseDeviceShelfGet({
      warehouseId: props.warehouseId,
      deviceId: e,
    })
    Object.assign(shelfExistInfo, data)
  } catch {
    //
  } finally {
    deviceFetchLoading.value = false
  }
}

const handleShelfSubmit = async () => {
  const res = await formRef.value?.validate()
  if (res) {
    return
  }
  try {
    const { data } = await warehouseDeviceShelfSet({
      deviceId: selectedDevice.value,
      warehouseId: props.warehouseId,
      col: shelfExistInfo.shelfCol,
      row: shelfExistInfo.shelfRow,
    })
    Message.success('货架配置成功！')
    await fetchShelf(selectedDevice.value)
  } catch {
    //
  } finally {
    //
  }
}
</script>

<script lang="ts">
export default {
  name: 'DeviceManagement',
}
</script>

<style scoped lang="less"></style>
