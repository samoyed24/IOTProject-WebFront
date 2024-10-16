<template>
  <a-drawer
      :visible="drawerVisible"
      @close="drawerSwitch(false)"
      width="50%"
      @ok="drawerSwitch(false)"
      @cancel="drawerSwitch(false)"
  >
    <a-tabs>
      <a-tab-pane :key="1">
        <template #title>
          <icon-settings></icon-settings>
          基本参数
        </template>
        123
      </a-tab-pane>
      <a-tab-pane :key="2">
        <template #title>
          <icon-mobile></icon-mobile>
          设备管理
        </template>
        <device-management :warehouse-id="warehouseId" />
      </a-tab-pane>
      <a-tab-pane :key="3">
        <template #title>
          <icon-safe></icon-safe>
          安全管理
        </template>
      </a-tab-pane>
      <a-tab-pane :key="4">
        <template #title>
          <icon-storage></icon-storage>
          库存设置
        </template>
      </a-tab-pane>
      <a-tab-pane :key="5">
        <template #title>
          <icon-archive></icon-archive>
          订单管理
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup lang="ts">
import { defineProps, ref, defineExpose } from 'vue'
import DeviceManagement from './device-management.vue'

const drawerVisible = ref(false)

defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})

const drawerSwitch = (visible: boolean) => {
  drawerVisible.value = visible
}

defineExpose({
  drawerSwitch,
})
</script>

<script lang="ts">
export default {
  name: 'WarehouseSetting',
}
</script>

<style scoped lang="less"></style>
