<template>
  <a-drawer
    :visible="drawerVisible"
    width="50%"
    @close="handleClose"
    @ok="handleClose"
    @cancel="handleClose"
    :title="`${warehouseProps.warehouseName} - 仓库设置`"
  >
    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane :key="1">
        <template #title>
          <icon-settings></icon-settings>
          基本参数
        </template>
        <BasicParameters :warehouse-id="warehouseProps.warehouseId" />
      </a-tab-pane>
      <a-tab-pane :key="2">
        <template #title>
          <icon-mobile></icon-mobile>
          设备管理
        </template>
        <device-management v-if="activeTab === 2" :warehouse-id="warehouseProps.warehouseId" />
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
import { defineEmits, defineProps, ref } from 'vue';
import BasicParameters from './basic-parameters.vue';
import DeviceManagement from './device-management.vue';

const drawerVisible = ref(true)
const activeTab = ref()
defineProps({
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

const handleClose = () => {
  drawerVisible.value = false
  setTimeout(handleDestroyComp, 500)
}

const handleDestroyComp = () => {
  emits('close-event')
}

const emits = defineEmits(['close-event'])
</script>

<script lang="ts">
export default {
  name: 'WarehouseSetting',
}
</script>

<style scoped lang="less"></style>
