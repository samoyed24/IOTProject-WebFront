<template>
  <a-spin :loading="drawerLoading">
    <a-drawer :visible="drawerVisible" width="50%" :footer="false" @cancel="handleClose">
      <template #title>
        <icon-dashboard />
        {{ props.warehouseProps.warehouseName }} - 控制面板
      </template>
      <a-form :model="{}">
        <a-form-item label="请选择控制设备">
          <a-select
            v-model="selectedDeviceId"
            :options="devices"
            :loading="deviceSelectLoading"
            @change="fetchDeviceControlPanel"
          ></a-select>
        </a-form-item>
      </a-form>
      <a-tabs v-if="selectedDeviceId" position="vertical">
        <a-tab-pane :key="1" title="温控装置">
          <template #title>
            <icon-settings />
            温度控制
          </template>
          <a-form style="width: 90%">
            <a-form-item label="智能控温">
              <a-switch v-model="formData.tempCtrl.enable" :disabled="!functionEnabledStatus.tempCtrl"></a-switch>
              <template #help>
                <div v-if="formData.tempCtrl.enable">
                  <icon-exclamation-circle-fill />
                  开启智能控温后，冷却装置与传热装置的工作参数（功率等）将由系统智能接管。系统将根据环境温度的反馈与基本参数进行比较，使用功耗与效率平衡的温控方案进行智能调控。
                </div>
                <div v-else>
                  <icon-exclamation-circle-fill />
                  关闭智能控温后，您需要手动设置温控系统的制冷强度及冷、热端风扇的转速等。建议保持智能控温的开启，以使温度的仓储环境得到调节，同时节省能源。（未设置温度基准时，不支持开启智能控温）
                </div>
              </template>
            </a-form-item>
            <a-form-item label="制冷强度">
              <a-slider
                v-model="formData.tempCtrl.props.setIntensity"
                :disabled="formData.tempCtrl.enable"
                :min="0.0"
                :max="1.0"
                :step="0.01"
              />
              <template v-if="!formData.tempCtrl.enable" #help>
                当前设定制冷强度系数：{{ formData.tempCtrl.props.setIntensity }}，制冷功率约为{{
                  (formData.tempCtrl.props.setIntensity * 120).toFixed(2)
                }}W
              </template>
            </a-form-item>
            <a-form-item label="风扇冷端转速">
              <a-slider
                v-model="formData.tempCtrl.props.setColdFan"
                :disabled="formData.tempCtrl.enable"
                :min="0.0"
                :max="1.0"
                :step="0.01"
              />
              <template v-if="!formData.tempCtrl.enable" #help>
                当前设定冷端转速系数：{{ formData.tempCtrl.props.setColdFan }}，冷端风扇转速约为{{
                  (800 + formData.tempCtrl.props.setColdFan * 1200).toFixed(2)
                }}转/分
              </template>
            </a-form-item>
            <a-form-item label="风扇热端转速">
              <a-slider
                v-model="formData.tempCtrl.props.setHotFan"
                :disabled="formData.tempCtrl.enable"
                :min="0.0"
                :max="1.0"
                :step="0.01"
              />
              <template v-if="!formData.tempCtrl.enable" #help>
                当前设定热端转速系数：{{ formData.tempCtrl.props.setHotFan }}，热端风扇转速约为{{
                  (800 + formData.tempCtrl.props.setHotFan * 1200).toFixed(2)
                }}转/分
              </template>
            </a-form-item>
          </a-form>
          <a-button
            :disabled="!applyEnable.tempCtrl"
            type="primary"
            style="margin-top: 30px"
            :loading="elementLoading.apply"
            long
            @click="setLoadingAndSubmit('apply')"
          >
            应用
          </a-button>
        </a-tab-pane>
        <a-tab-pane :key="2" title="湿度控制">
          <template #title>
            <icon-settings />
            湿度控制
          </template>
          <a-form style="width: 90%">
            <a-form-item label="智能调湿">
              <a-switch
                v-model="formData.humidCtrl.enable"
                :disabled="!functionEnabledStatus.humidCtrl"
                :loading="elementLoading.smartHumid"
                @click="setLoadingAndSubmit('smartHumid')"
              />
              <template #help>
                <div v-if="formData.humidCtrl.enable">
                  <icon-exclamation-circle-fill />
                  开启智能调湿后，加湿装置与新风系统将由系统智能接管。当环境湿度低于湿度阈值下限，加湿装置将自动开启，保持高湿存储条件；高于湿度阈值上限，新风系统将自动开启，促进空气交换，排出多余水汽。
                </div>
                <div v-else>
                  <icon-exclamation-circle-fill />
                  关闭智能调湿后，您需要手动设置加湿装置与新风系统的开关。（未设置湿度调控时，不支持开启智能调湿）
                </div>
              </template>
            </a-form-item>
            <a-form-item label="加湿装置">
              <a-switch
                v-model="formData.humidCtrl.props.setWaterEnable"
                :disabled="formData.humidCtrl.enable"
                :loading="elementLoading.water"
                @click="setLoadingAndSubmit('water')"
              />
            </a-form-item>
            <a-form-item label="新风系统">
              <a-switch
                v-model="formData.humidCtrl.props.setWindEnable"
                :disabled="formData.humidCtrl.enable"
                :loading="elementLoading.wind"
                @click="setLoadingAndSubmit('wind')"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane :key="3" title="照明">
          <template #title>
            <icon-settings />
            照明
          </template>
          <a-form style="width: 90%">
            <a-form-item label="智能照明">
              <a-switch
                v-model="formData.lightCtrl.enable"
                :disabled="!functionEnabledStatus.safetyCtrl"
                :loading="elementLoading.smartLight"
                @click="setLoadingAndSubmit('smartLight')"
              />
              <template #help>
                <div v-if="formData.lightCtrl.enable">
                  <icon-exclamation-circle-fill />
                  开启智能照明后，照明装置仅在库房内有人员工作时亮起，当库房无人时自动关闭，从而节省能源，并降低光照发热导致的温度上升。
                </div>
                <div v-else>
                  <icon-exclamation-circle-fill />
                  关闭智能照明后，您需要手动设置照明系统。（未设置安全门禁时，不支持开启智能照明）
                </div>
              </template>
            </a-form-item>
            <a-form-item label="照明">
              <a-switch
                v-model="formData.lightCtrl.props.setEnable"
                :disabled="formData.lightCtrl.enable"
                :loading="elementLoading.light"
                @click="setLoadingAndSubmit('light')"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
<!--        <a-tab-pane :key="4" title="门禁">-->
<!--          <template #title>-->
<!--            <icon-settings />-->
<!--            门禁-->
<!--          </template>-->

<!--        </a-tab-pane>-->
      </a-tabs>
      <a-result v-else status="404" subtitle="暂未选择设备" />
    </a-drawer>
  </a-spin>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, nextTick, reactive, ref, watch } from 'vue'
import {
  type ControlPanelItem,
  warehouseControlPanelGet,
  warehouseControlPanelSubmit,
  warehouseFetchFunctionStatus,
  type WarehouseProps,
  warehouseQueryDevices, warehouseQueryEmployees,
} from '@/api/list'
import {Message, Modal} from '@arco-design/web-vue'

const props = defineProps({
  warehouseProps: {
    type: Object as () => WarehouseProps,
    default: () => {
      return {
        warehouseName: '',
        warehouseId: -1,
      }
    },
  },
})

const emits = defineEmits(['closeEvent'])

const drawerVisible = ref(true)

const handleClose = () => {
  drawerVisible.value = false
  setTimeout(() => {
    emits('closeEvent')
  }, 500)
}

const formData = reactive({
  tempCtrl: {
    enable: false,
    props: {
      setIntensity: 1.0,
      setColdFan: 1.0,
      setHotFan: 1.0,
    },
  },
  humidCtrl: {
    enable: false,
    props: {
      setWaterEnable: false,
      setWindEnable: false,
    },
  },
  lightCtrl: {
    enable: null as boolean,
    props: {
      setEnable: false,
    },
  },
})

const functionEnabledStatus = reactive({
  tempCtrl: null as boolean,
  humidCtrl: null as boolean,
  safetyCtrl: null as boolean,
})

const applyEnable = reactive({
  tempCtrl: false,
  humidCtrl: false,
  lightCtrl: false,
})

const selectedDeviceId = ref()
const devices = reactive([])
const deviceSelectLoading = ref(true)

const fetchDevices = async () => {
  try {
    const { data } = await warehouseQueryDevices({
      warehouseId: props.warehouseProps.warehouseId,
    })
    const fetchDevices = data.list
    fetchDevices.forEach((device: any) => {
      if (device.deviceType === 'warehouse_sensor') {
        devices.push({
          label: `${device.deviceName}(${device.deviceId})`,
          value: device.deviceId,
        })
      }
    })
    if (devices) {
      const first: string = devices[0].value
      selectedDeviceId.value = first
      // console.log(devices)
    }
  } catch {
    //
  } finally {
    deviceSelectLoading.value = false
  }
}

fetchDevices().then(() => {
  if (selectedDeviceId.value) fetchDeviceControlPanel()
})

const fetchWarehouseFunctionStatus = async () => {
  try {
    const { data } = await warehouseFetchFunctionStatus({ warehouseId: props.warehouseProps.warehouseId })
    // console.log(data)
    Object.assign(functionEnabledStatus, data)
  } catch (err) {
    Message.error(`获取失败，${err}`)
  }
}

fetchWarehouseFunctionStatus()

watch(
  () => functionEnabledStatus,
  (newValue) => {
    if (!newValue.humidCtrl) formData.humidCtrl.enable = false
    if (!newValue.tempCtrl) formData.tempCtrl.enable = false
    if (!newValue.safetyCtrl) formData.lightCtrl.enable = false
  },
  { deep: true }
)

const elementLoading = reactive({
  apply: false,
  smartHumid: false,
  water: false,
  wind: false,
  smartLight: false,
  light: false,
})

const setLoadingAndSubmit = (key: string) => {
  nextTick(async () => {
    const k = key as keyof typeof elementLoading
    elementLoading[k] = true
    await submitForm()
    elementLoading[k] = false
  })
}

const submitForm = async () => {
  try {
    await warehouseControlPanelSubmit({
      warehouseId: props.warehouseProps.warehouseId,
      deviceId: selectedDeviceId.value,
      ...formData,
    })
    Message.success('操作成功')
  } catch (err) {
    Message.error(`操作失败,${err}`)
  }
}

const drawerLoading = ref(true)

const fetchDeviceControlPanel = async () => {
  try {
    drawerLoading.value = true
    const { data } = await warehouseControlPanelGet({
      deviceId: selectedDeviceId.value,
    })
    if (data.humidCtrl) {
      Object.assign(formData, data)
    }
  } catch (err) {
    Message.error(`控制面板获取失败：${err}}`)
  } finally {
    drawerLoading.value = false
  }
}

watch(
  () => formData.tempCtrl,
  () => {
    applyEnable.tempCtrl = true
  },
  { deep: true }
)
</script>

<script lang="ts">
export default {
  name: 'ControlPanel',
}
</script>

<style scoped lang="less"></style>
