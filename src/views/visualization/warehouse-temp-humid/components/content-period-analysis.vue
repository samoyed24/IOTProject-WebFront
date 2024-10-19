<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '16px' }">
      <template #title>
        {{ $t('warehouseTempHumid.contentPeriodAnalysis') }}
      </template>
      <Chart style="width: 100%; height: 370px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useLoading from '@/hooks/loading'
import { queryContentPeriodAnalysis, queryWarehouseTemphumid, type WarehouseDevice } from '@/api/visualization'
import { type ToolTipFormatterParams } from '@/types/echarts'
import useChartOption from '@/hooks/chart-option'

const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
  return items
    .map(
      (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}%
        </span>
      </div>`
    )
    .join('')
}

const { loading, setLoading } = useLoading(true)
const xAxis = ref<string[]>([])
const textChartsData = ref<number[]>([])
const imgChartsData = ref<number[]>([])
const temperatureData = ref<number[]>([])
const humidityData = ref<number[]>([])
const videoChartsData = ref<number[]>([])
const { chartOption } = useChartOption((isDark) => {
  return {
    title: {
      text: '双 Y 轴折线图示例（带缩放）',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['数据1', '数据2'],
    },
    xAxis: {
      type: 'category',
      data: xAxis.value
    },
    yAxis: [
      {
        type: 'value',
        name: 'Y轴1',
        max: 26,
        min: 19,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: 'blue',
          },
        },
      },
      {
        type: 'value',
        name: 'Y轴2',
        max: 0.8,
        min: 0.4,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: 'red',
          },
        },
      },
    ],
    series: [
      {
        name: '数据1',
        type: 'line',
        yAxisIndex: 0, // 使用第一个 Y 轴
        data: temperatureData.value,
        lineStyle: {
          color: 'blue',
        },
        smooth: true,
      },
      {
        name: '数据2',
        type: 'line',
        yAxisIndex: 1, // 使用第二个 Y 轴
        data: humidityData.value,
        lineStyle: {
          color: 'red',
        },
        smooth: true,
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0], // 仅对 X 轴有效
        start: 0, // 数据窗口范围的起始百分比
        end: 100, // 数据窗口范围的结束百分比
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
  };

})
const fetchData = async () => {
  setLoading(true)
  try {
    const params: WarehouseDevice = {
      warehouseId: 1,
      pastDays: 30,
    }
    const { data: chartData } = await queryWarehouseTemphumid(params)
    xAxis.value = chartData.xAxis
    chartData.data.forEach((el: any) => {
      if (el.name === '温度') {
        temperatureData.value = el.value
      } else if (el.name === '湿度') {
        humidityData.value = el.value
      }
    })
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
fetchData()
</script>

<style scoped lang="less">
.chart-box {
  width: 100%;
  height: 230px;
}
</style>
