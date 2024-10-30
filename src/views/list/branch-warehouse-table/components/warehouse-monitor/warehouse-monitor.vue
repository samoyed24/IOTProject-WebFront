<template>
  <a-drawer
    :visible="drawerVisible"
    width="80%"
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
        <a-card class="general-card" title="">
          <a-row>
            <a-col :flex="1">
              <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item field="is_resolved" label="状态">
                      <a-select v-model="formModel.is_resolved" placeholder="事件是否解决" @change="search">
                        <a-option :value="true">完成</a-option>
                        <a-option :value="false">未解决</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item field="level" label="等级">
                      <a-select v-model="formModel.level" placeholder="事件等级" @change="search">
                        <a-option :value="0">
                          <template #icon>
                            <icon-info-circle-fill style="color: gray"></icon-info-circle-fill>
                          </template>
                          一般事件
                        </a-option>
                        <a-option :value="1">
                          <template #icon>
                            <icon-info-circle-fill style="color: #0040bf"></icon-info-circle-fill>
                          </template>
                          提醒事件
                        </a-option>
                        <a-option :value="2">
                          <template #icon>
                            <icon-info-circle-fill style="color: orange"></icon-info-circle-fill>
                          </template>
                          警告事件
                        </a-option>
                        <a-option :value="3">
                          <template #icon>
                            <icon-info-circle-fill style="color: red"></icon-info-circle-fill>
                          </template>
                          严重事件
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item field="title" label="类型">
                      <a-select v-model="formModel.title" placeholder="事件类型" @change="search">
                        <a-option>库房环境预警</a-option>
                        <a-option>库房安全预警</a-option>
                        <a-option>库房参数变化</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
            <a-divider style="height: 40px" direction="vertical" />
            <a-col :span="12" :flex="'40px'" style="text-align: right">
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('branchWarehouseTable.form.reset') }}
              </a-button>
              <!-- <a-tooltip :content="$t('branchWarehouseTable.actions.refresh')">
                <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
              </a-tooltip> -->
            </a-col>
          </a-row>
          <a-table
            row-key="id"
            :loading="loading"
            :pagination="pagination"
            :columns="cloneColumns as TableColumnData[]"
            :data="renderData"
            :bordered="false"
            size="medium"
            @page-change="onPageChange"
          >
            <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
              <div class="custom-filter">
                <a-space direction="vertical">
                  <a-input :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
                  <div class="custom-filter-footer">
                    <a-button @click="handleFilterConfirm">Confirm</a-button>
                    <a-button @click="handleFilterReset">Reset</a-button>
                  </div>
                </a-space>
              </div>
            </template>
            <template #level="{ record }">
              <template v-if="record.level == 0">
                <icon-info-circle-fill style="color: gray" />
                一般事件
              </template>
              <template v-else-if="record.level == 1">
                <icon-info-circle-fill style="color: #0040bf" />
                提醒事件
              </template>
              <template v-else-if="record.level == 2">
                <icon-info-circle-fill style="color: orange" />
                警告事件
              </template>
              <template v-else-if="record.level == 3">
                <icon-info-circle-fill style="color: red" />
                严重事件
              </template>
            </template>
            <template #is_resolved="{ record }">
              <template v-if="!record.is_resolved">
                <icon-question-circle-fill />
                未解决
              </template>
              <template v-else>
                <icon-check-circle-fill style="color: green" />
                完成
              </template>
            </template>
            <template #operations="{ record }">
              <a-button v-if="!record.is_resolved" type="text" @click="handleResolveMark(record.id)">标记解决</a-button>
              <a-button v-else type="text" :disabled="record.level < 2" @click="handleShowDetails(record.id)">详情</a-button>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
    <EventMarkResolved
      v-if="resolveViewVisible"
      :warehouse-event-id="resolveMarkProps.warehouseEventId"
      :warehouse-id="resolveMarkProps.warehouseId"
      @close-event="
        () => {
          resolveViewVisible = false
          search()
        }
      "
    />
    <EventResolveDetails
      v-if="markDetailsShow"
      :warehouse-event-id="resolveMarkProps.warehouseEventId"
      :warehouse-id="resolveMarkProps.warehouseId"
      @close-event="
        () => {
          markDetailsShow = false
        }
      "
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { getIamToken, warehouseGetEvents, warehouseMonitor, warehouseQueryDevices, type PolicyParams, type PolicyRecord } from '@/api/list'
import { queryWarehouseTemphumid } from '@/api/visualization'
import useLoading from '@/hooks/loading'
import type { Pagination } from '@/types/global'
import { IconSearch } from '@arco-design/web-vue/es/icon'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import { computed, defineEmits, defineProps, h, reactive, ref, watch } from 'vue'
import EventMarkResolved from '@/views/list/branch-warehouse-table/components/warehouse-monitor/event-mark-resolved.vue'
import EventResolveDetails from '@/views/list/branch-warehouse-table/components/warehouse-monitor/event-resolve-details.vue'
// import { Message } from '@arco-design/web-vue'

type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    warehouseId: props.warehouseProps.warehouseId,
    is_resolved: null as boolean,
    level: null as number,
    title: null as string,
  }
}

const { loading, setLoading } = useLoading(true)

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
const renderData = ref<PolicyRecord[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])
const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})

const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await warehouseGetEvents(params)
    renderData.value = data.list
    // console.log(renderData.value)
    pagination.current = params.current
    pagination.total = data.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const reset = () => {
  formModel.value = generateFormModel()
  search()
}

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as PolicyParams)
}
search()

const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current })
}

const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: 'id',
  //   dataIndex: 'id',
  //   slotName: 'id',
  //   sortable: {
  //     sortDirections: ['ascend', 'descend'],
  //   },
  // },
  {
    title: '类型',
    dataIndex: 'title',
    // filterable: {
    // filter: (value, record) => record.name.includes(value),
    // slotName: 'name-filter',
    // icon: () => h(IconSearch),
    // },
  },
  {
    title: '事件',
    dataIndex: 'message',
    slotName: 'message',
    width: 300,
  },
  {
    title: '等级',
    dataIndex: 'level',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    filterable: {
      filters: [
        { text: '一般', value: '0' },
        { text: '提醒', value: '1' },
        { text: '警告', value: '2' },
        { text: '严重', value: '3' },
      ],
      filter: (value, record) => {
        return record.level === Number(value)
      },
      multiple: true,
    },
    slotName: 'level',
  },
  {
    title: '状态',
    dataIndex: 'is_resolved',
    slotName: 'is_resolved',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    filterable: {
      filters: [
        { text: '完成', value: true },
        { text: '未解决', value: false },
      ],
      filter: (value, record) => {
        return true
      },
      multiple: true,
    },
  },
  {
    title: '发送者',
    dataIndex: 'sender',
    filterable: {
      filters: [
        { text: '设备', value: 'device' },
        { text: '人员', value: 'employee' },
      ],
      filter: (value, record) => {
        return true
      },
      multiple: true,
    },
  },
  {
    title: '记录时间',
    dataIndex: 'time',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
])

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val)
    cloneColumns.value.forEach((item, index) => {
      item.checked = true
    })
    showColumns.value = cloneDeep(cloneColumns.value)
  },
  { deep: true, immediate: true }
)

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

const resolveViewVisible = ref(false)

const markDetailsShow = ref(false)

const resolveMarkProps = reactive({
  warehouseId: null as number,
  warehouseEventId: null as number,
})

const handleResolveMark = (eventId: number) => {
  resolveMarkProps.warehouseId = props.warehouseProps.warehouseId
  resolveMarkProps.warehouseEventId = eventId
  resolveViewVisible.value = true
}

const handleShowDetails = (eventId: number) => {
  resolveMarkProps.warehouseId = props.warehouseProps.warehouseId
  resolveMarkProps.warehouseEventId = eventId
  markDetailsShow.value = true
}

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

<style>
.custom-filter {
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  display: flex;
  justify-content: space-between;
}
</style>
