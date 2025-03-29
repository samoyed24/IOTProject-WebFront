<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title>
        库存类型占比
      </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading'
import useChartOption from '@/hooks/chart-option'
import {reactive} from "vue";
import {branchQueryTypeStatistics} from "@/api/dashboard";

const statistics = reactive({
  totalCargo: 0,
  vegetable: 0,
  meat: 0,
  snack: 0,
  medicine: 0,
  other: 0,
})

const { loading } = useLoading(true)
const { chartOption } = useChartOption((isDark) => {
  // echarts support https://echarts.apache.org/zh/theme-builder.html
  // It's not used here
  return {
    legend: {
      left: 'center',
      data: ['果蔬', '肉类', '冷藏零食', '医药用品', '其他'],
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      textStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
      },
      itemStyle: {
        borderWidth: 0,
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: '货物总数',
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#4E5969',
            fontSize: 14,
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '50%',
          style: {
            text: statistics.totalCargo,
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#1D2129',
            fontSize: 16,
            fontWeight: 500,
          },
        },
      ],
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        label: {
          formatter: '{d}%',
          fontSize: 14,
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderColor: isDark ? '#232324' : '#fff',
          borderWidth: 1,
        },
        data: [
          {
            value: [statistics.vegetable],
            name: '果蔬',
            itemStyle: {
              color: isDark ? '#3D72F6' : '#249EFF',
            },
          },
          {
            value: [statistics.meat],
            name: '肉类',
            itemStyle: {
              color: isDark ? '#A079DC' : '#313CA9',
            },
          },
          {
            value: [statistics.medicine],
            name: '医药用品',
            itemStyle: {
              color: isDark ? '#6CAAF5' : '#21CCFF',
            },
          },
          {
            value: [statistics.snack],
            name: '冷藏零食',
            itemStyle: {
              color: isDark ? '#2E9FA3' : '#18B0C8',
            },
          },
          {
            value: [statistics.other],
            name: '其他',
            itemStyle: {
              color: isDark ? '#2C5DAA' : '#2068D6',
            },
          },
        ],
      },
    ],
  }
})

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await branchQueryTypeStatistics()
    Object.assign(statistics, data)
  } catch {
    //
  } finally {
    loading.value = false
  }
}

fetchData()
</script>

<style scoped lang="less"></style>
