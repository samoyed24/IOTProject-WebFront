<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      title="出入库总统计（近14天）"
    >
<!--      <template #extra>-->
<!--        <a-link>{{ $t('workplace.viewMore') }}</a-link>-->
<!--      </template>-->
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import {queryContentData, type ContentDataRecord, branchQueryInOutStatistics} from '@/api/dashboard'
import useChartOption from '@/hooks/chart-option'
import useLoading from '@/hooks/loading'
import type { ToolTipFormatterParams } from '@/types/echarts'
import type { AnyObject } from '@/types/global'
import { graphic } from 'echarts'
import { ref } from 'vue'

function graphicFactory(side: AnyObject) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12,
    },
  }
}
const { loading, setLoading } = useLoading(true)
const xAxis = ref<string[]>()
const outData = ref([])
const inData = ref([])
const graphicElements = ref([graphicFactory({ left: '2.6%' }), graphicFactory({ right: 0 })])
const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: '2.6%',
      right: '0',
      top: '10',
      bottom: '30',
    },
    xAxis: {
      type: 'time',
      time: {
        unit: 'day',
      },
      offset: 2,
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: {
        color: '#4E5969',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        interval: (idx: number) => {
          if (idx === 0) return false
          return idx !== xAxis.value.length - 1
        },
        lineStyle: {
          color: '#E5E8EF',
        },
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#23ADFF',
          width: 2,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      // axisLabel: {
      //   formatter(value: any, idx: number) {
      //     if (idx === 0) return value
      //     return `${value}k`
      //   },
      // },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#E5E8EF',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      // formatter(params) {
      //   const [firstElement] = params as ToolTipFormatterParams[]
      //   return `<div>
      //       <p class="tooltip-title">${firstElement.axisValueLabel}</p>
      //       <div class="content-panel"><span>总内容量</span><span class="tooltip-value">${(
      //         Number(firstElement.value) * 10000
      //       ).toLocaleString()}</span></div>
      //     </div>`
      // },
      // className: 'echarts-tooltip-diy',
    },
    graphic: {
      elements: graphicElements.value,
    },
    series: [
      {
        name: '总入库货物(件)',
        data: inData.value,
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        symbolSize: 12,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
          },
        },
        lineStyle: {
          width: 3,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(255, 120, 60, 1)',
            },
            {
              offset: 0.5,
              color: 'rgba(255, 80, 120, 1)',
            },
            {
              offset: 1,
              color: 'rgba(120, 80, 255, 1)',
            },
          ]),
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(17, 126, 255, 0.16)',
            },
            {
              offset: 1,
              color: 'rgba(17, 128, 255, 0)',
            },
          ]),
        },
      },
      {
        name: '总出库货物(件)',
        data: outData.value,
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        symbolSize: 12,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
          },
        },
        lineStyle: {
          width: 3,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(30, 231, 255, 1)',
            },
            {
              offset: 0.5,
              color: 'rgba(36, 154, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(111, 66, 251, 1)',
            },
          ]),
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(17, 126, 255, 0.16)',
            },
            {
              offset: 1,
              color: 'rgba(17, 128, 255, 0)',
            },
          ]),
        },
      },
    ],
  }
})

const fetchData = async () => {
  setLoading(true)
  try {
    const { data } = await branchQueryInOutStatistics()
    // console.log(data)
    xAxis.value = data.date
    inData.value = data.inResult
    outData.value = data.outResult
    // chartData.forEach((el: ContentDataRecord, idx: number) => {
    //   xAxis.value.push(el.x)
    //   chartsData.value.push(el.y)
    //   if (idx === 0) {
    //     graphicElements.value[0].style.text = el.x
    //   }
    //   if (idx === chartData.length - 1) {
    //     graphicElements.value[1].style.text = el.x
    //   }
    // })
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
fetchData()
</script>

<style scoped lang="less"></style>
