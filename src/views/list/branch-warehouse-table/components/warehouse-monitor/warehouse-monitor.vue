<template>
  <a-drawer
    :visible="drawerVisible"
    width="60%"
    :title="`${warehouseProps.warehouseName} - 实时监控`"
    @ok="handleClose"
    @close="handleClose"
    @cancel="handleClose"
  >
    <a-tabs>
      <a-tab-pane :key="1">
        <template #title>
          <icon-dashboard />
          温湿度面板
        </template>
        <a-form :model="{}">
          <a-form-item label="请选择监控设备">
            <a-select v-model="selectedDeviceId" :options="devices" :loading="deviceSelectLoading" @change="fetchShadow"></a-select>
          </a-form-item>
        </a-form>
        <div v-if="selectedDeviceId">
          <a-row justify="center" :gutter="12">
            <a-col :span="12" flex="20%"></a-col>
            <a-col :span="12" flex="auto">
              <a-spin :loading="statLoading">
                <!--            <icon-info size="20px" />-->

                <a-statistic title="实时温度" :value="tempHumid.temperature / 10" :precision="1">
                  <template #suffix>°C</template>
                </a-statistic>
              </a-spin>
            </a-col>
            <a-col :span="12" flex="auto">
              <a-spin :loading="statLoading">
                <!--            <icon-info size="20px" />-->
                <a-statistic title="实时湿度" :value="tempHumid.humidity / 10" :precision="1">
                  <template #suffix>%</template>
                </a-statistic>
              </a-spin>
            </a-col>
            <!--        <a-col :span="12" flex="auto">-->
            <!--          <a-spin :loading="statLoading">-->
            <!--            &lt;!&ndash;            <icon-info size="20px" />&ndash;&gt;-->
            <!--            <a-statistic title="风扇转速" :value="tempHumid.fanSpeed">-->
            <!--              <template #suffix>转/秒</template>-->
            <!--            </a-statistic>-->
            <!--          </a-spin>-->
            <!--        </a-col>-->
          </a-row>
          <a-row justify="center" :gutter="12">
            <a-statistic title="最后更新时间" :value="tempHumid.event_time" format="YYYY-MM-DD HH:mm:ss"></a-statistic>
          </a-row>
          <div style="margin-top: 30px; display: flex; flex-direction: row; align-items: center; justify-content: center">
            <a-radio-group v-model="timeSelect" type="button" @update:model-value="fetchChartData">
              <a-radio :value="0.016">1分钟</a-radio>
              <a-radio :value="0.083">5分钟</a-radio>
              <a-radio :value="0.333">20分钟</a-radio>
              <a-radio :value="2">2小时</a-radio>
              <a-radio :value="6">6小时</a-radio>
              <a-radio :value="12">12小时</a-radio>
              <a-radio :value="24">24小时</a-radio>
              <a-radio :value="72">3天</a-radio>
              <a-radio :value="168">7天</a-radio>
            </a-radio-group>

            <a-switch v-model="autoChartUpdate">
              <template #unchecked>自动更新关闭</template>
              <template #checked>自动更新开启</template>
            </a-switch>
          </div>
          <a-spin :loading="chartLoading" style="width: 100%">
            <Chart v-if="chartShow" ref="chartInstance" :options="chartOption" height="400px"></Chart>
          </a-spin>
        </div>
      </a-tab-pane>

      <a-tab-pane :key="2">
        <template #title>
          <icon-clock-circle />
          <!--            </icon-clock-circle>-->
          事件记录
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup lang="ts">
import { getIamToken, warehouseMonitor, warehouseQueryDevices } from '@/api/list'
import { queryWarehouseTemphumid } from '@/api/visualization'
import { defineEmits, defineProps, reactive, ref } from 'vue'
// import { Message } from '@arco-design/web-vue'

const props = defineProps({
  warehouseProps: {
    type: Object,
    default: () => {
      return {
        warehouseName: '',
        warehouseId: -1,
      }
    },
  },
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

const token = ref('')
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

const devices = reactive([])
const selectedDeviceId = ref()
const deviceSelectLoading = ref(true)
const statLoading = ref(true)

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

const tempHumid = reactive({
  temperature: null as number,
  humidity: null as number,
  event_time: null as Date,
  fanSpeed: null as number,
})

const intervalId = ref(0)

const fetchShadow = async () => {
  warehouseMonitor(token.value, selectedDeviceId.value)
    .then((resp) => resp.json())
    .then((resp) => {
      resp.shadow.forEach((shadow: any) => {
        if (shadow.service_id === 'TempHumid') {
          let dateString = shadow.reported.event_time
          dateString = dateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3 $4:$5:$6 UTC')
          const eventTime = new Date(dateString)
          tempHumid.event_time = eventTime
          tempHumid.temperature = shadow.reported.properties.Temperature
          tempHumid.humidity = shadow.reported.properties.Humidity
          tempHumid.fanSpeed = shadow.reported.properties.FanSpeed
          if (autoChartUpdate.value) fetchChartData()
        }
      })
    })
}

const chartShow = ref(false)
const chartLoading = ref(true)
let xTimeData = reactive([])
let yTemp = reactive([])
let yHumid = reactive([])
const autoChartUpdate = ref(true)

const timeSelect = ref(2)
const fetchChartData = async () => {
  chartLoading.value = true
  const { data } = await queryWarehouseTemphumid({
    warehouseId: props.warehouseProps.warehouseId,
    pastHours: timeSelect.value,
  })
  xTimeData = data.x
  const temp = data.data[0].value
  const humid = data.data[1].value
  yTemp = temp
  yHumid = humid
  chartOption.xAxis.data = xTimeData
  chartOption.series[0].data = temp
  chartOption.series[1].data = humid
  chartShow.value = true
  chartLoading.value = false
}

fetchChartData()

const chartInstance = ref()

let chartOption = reactive({
  title: {
    responsive: true,
    text: '库房温度湿度变化',
    left: 'center',
    textStyle: {
      color: '#1e90ff',
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['温度', '湿度'],
    top: 30,
    textStyle: {
      color: '#1e90ff',
    },
  },
  xAxis: {
    type: 'time',
    boundaryGap: false,
    data: xTimeData,
    axisLine: {
      lineStyle: {
        color: '#1e90ff',
      },
    },
  },
  yAxis: [
    {
      type: 'value',
      name: '温度 (°C)',
      min(value: any) {
        return value.min - 1
      }, // 自动调整最小值
      max(value: any) {
        return value.max + 1
      }, // 自动调整最大值
      position: 'left',
      axisLine: {
        lineStyle: {
          color: '#1e90ff',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#1e90ff',
          opacity: 0.2,
        },
      },
    },
    {
      type: 'value',
      name: '湿度 (%)',
      min(value: any) {
        return value.min - 0.1 > 0 ? value.min - 0.1 : 0
      }, // 自动调整最小值
      max(value: any) {
        return value.max + 0.1 < 1 ? value.max + 0.1 : 1
      }, // 自动调整最大值
      position: 'right',
      axisLine: {
        lineStyle: {
          color: '#4682b4',
        },
      },
      splitLine: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '温度',
      type: 'line',
      smooth: true,
      smoothMonotone: 'x',
      symbol: 'none',
      data: yTemp,
      lineStyle: {
        color: '#1e90ff',
      },
      // markLine: {
      //   data: [
      //     {
      //       name: '平均温度',
      //       yAxis: 22.8, // 示例平均温度
      //       lineStyle: {
      //         type: 'dashed',
      //         color: '#87cefa'
      //       }
      //     }
      //   ]
      // }
    },
    {
      name: '湿度',
      type: 'line',
      smooth: true,
      smoothMonotone: 'x',
      symbol: 'none',
      yAxisIndex: 1,
      data: yHumid,
      lineStyle: {
        color: '#4682b4',
      },
    },
  ],
  dataZoom: [
    {
      type: 'slider', // 滑动条类型的缩放
      show: true,
      xAxisIndex: 0, // 作用于X轴
      start: 0, // 默认开始位置（0%）
      end: 100, // 默认结束位置（100%），即显示全部
      handleIcon: 'M8.3,1.3v11.4h-1.4V1.3H8.3 M9.7,0H6.9v13.7h2.8V0L9.7,0z', // 自定义手柄图标
      handleSize: '80%', // 手柄的大小
      handleStyle: {
        color: '#1e90ff',
        shadowBlur: 6,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
    },
    {
      type: 'inside', // 鼠标滚轮控制缩放
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
  ],
})

fetchToken().then(() => {
  fetchDevices().then(() => {
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
  name: 'WarehouseMonitor',
}
</script>

<style scoped lang="less"></style>
