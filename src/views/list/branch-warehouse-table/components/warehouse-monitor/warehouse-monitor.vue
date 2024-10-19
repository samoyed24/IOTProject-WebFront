<template>
  <a-drawer
    :visible="drawerVisible"
    @ok="handleClose"
    @close="handleClose"
    @cancel="handleClose"
    width="50%"
    :title="`${warehouseProps.warehouseName} - 实时监控`"
  >
    <a-form>
      <a-form-item label="请选择监控设备">
        <a-select :options="devices" v-model="selectedDeviceId" :loading="deviceSelectLoading" @change="handleDeviceChange"></a-select>
      </a-form-item>
    </a-form>
    <div v-if="selectedDeviceId">
      <a-row justify="center" :gutter="12">
        <a-col :span="12" flex="20%">
        </a-col>
        <a-col :span="12" flex="auto">
          <a-spin :loading="statLoading">
<!--            <icon-info size="20px" />-->

            <a-statistic
                title="实时温度"
                :value="tempHumid.temperature / 10"
                :precision="1"
            >
              <template #suffix>
                °C
              </template>
            </a-statistic>
          </a-spin>
        </a-col>
        <a-col :span="12" flex="auto">
          <a-spin :loading="statLoading">
<!--            <icon-info size="20px" />-->
            <a-statistic
                title="实时湿度"
                :value="tempHumid.humidity / 10"
                :precision="1"
            >
              <template #suffix>
                %
              </template>
            </a-statistic>
          </a-spin>
        </a-col>
      </a-row>
      <a-row justify="center" :gutter="12" >
        <a-statistic
          title="最后更新时间"
          :value="tempHumid.event_time"
          format="YYYY-MM-DD HH:mm:ss"
        >
        </a-statistic>
      </a-row>
    </div>

  </a-drawer>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, reactive, ref} from "vue";
import {getIamToken, warehouseMonitor, warehouseQueryDevices} from "@/api/list";

const props = defineProps({
  warehouseProps: {
    type: Object,
    default: () => {
      return {
        warehouseName: '',
        warehouseId: -1
      }
    }
  }
})

const drawerVisible = ref(true)

const handleClose = () => {
  drawerVisible.value = false
  clearInterval(intervalId.value)
  setTimeout(handleDestroyComp, 500)
}

const handleDestroyComp = () => {
  emits('close-event')
}



const emits = defineEmits(['close-event'])

const token = ref("")
const fetchToken = async () => {
  try {
    const { data } = await getIamToken()
    token.value = data.token
  } catch {
    //
  } finally {
    //
  }
}

let devices: string[] = reactive([]);
const selectedDeviceId = ref()
const deviceSelectLoading = ref(true)
const statLoading = ref(true)


const fetchDevices = async () => {
  try {
    const {data} = await warehouseQueryDevices({
      warehouseId: props.warehouseProps.warehouseId
    })
    const fetchDevices = data.list
    devices = []
    fetchDevices.forEach((device) => {
      if (device.deviceType === 'warehouse_sensor') {
        devices.push(device.deviceId)
      }
    })
    if (devices) {
      const first: string = devices[0]
      selectedDeviceId.value = first
    }
  } catch {
    //
  } finally {
    deviceSelectLoading.value = false
  }
}

const tempHumid = reactive({
  temperature: "",
  humidity: "",
  event_time: "",
})

const intervalId = ref(0)

const fetchShadow = async () => {
    warehouseMonitor(token.value, selectedDeviceId.value)
        .then((resp) => resp.json())
        .then((resp) => {
          resp.shadow.forEach((shadow) => {
            if (shadow.service_id === "TempHumid") {
              let dateString = shadow.reported.event_time
              dateString = dateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3 $4:$5:$6 UTC');
              const eventTime = new Date(dateString)
              tempHumid.event_time = eventTime
              tempHumid.temperature = shadow.reported.properties.Temperature
              tempHumid.humidity = shadow.reported.properties.Humidity
            }
          })
        })
}

fetchToken()
    .then(() => {
      fetchDevices()
          .then(() => {
            if (selectedDeviceId.value) {
              fetchShadow()
              clearInterval(intervalId.value)
              intervalId.value = setInterval(fetchShadow, 10000)
              statLoading.value = false
            }
          })
    })


</script>

<script lang="ts">
export default {
  name: "WarehouseMonitor"
}
</script>

<style scoped lang="less">

</style>
