<template>
  <div>
    <a-table
      :columns="columns"
    >

    </a-table>
    <a-button
        :long="1"
        type="primary"
    >
      <template #icon>
        <icon-plus></icon-plus>
      </template>
      添加设备
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})

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
  },
  {
    title: '状态',
    dataIndex: 'is_online',
  },
  {
    title: '操作',
    slotName: 'operation',
  },
]
</script>

<script lang="ts">
export default {
  name: 'DeviceManagement',
}
</script>

<style scoped lang="less"></style>
