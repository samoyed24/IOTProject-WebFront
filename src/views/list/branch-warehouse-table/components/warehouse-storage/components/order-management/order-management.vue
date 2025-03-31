<template>
  <a-tabs :active-key="activeKey" destroy-on-hide @tab-click="handleTabsChange">
    <a-tab-pane :key="1">
      <template #title>
        <icon-list />
        订单总览
      </template>
      <order-view :warehouse-id="props.warehouseId"></order-view>
    </a-tab-pane>
    <a-tab-pane :key="2">
      <template #title>
        <icon-plus />
        手动创建
      </template>
      <a-space />
      <create-order :warehouse-id="props.warehouseId" @on-order-submitted="handleTabsChange(1)" />
    </a-tab-pane>
    <a-tab-pane :key="3">
      <template #title>
        <icon-robot-add />
        自动创建
      </template>
      <create-automatic :warehouse-id="props.warehouseId" @on-order-submitted="handleTabsChange(1)" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { defineEmits, defineProps, ref } from 'vue'
import CreateOrder from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/create-order/create-order.vue'
import OrderView from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/order-view/order-view.vue'
import CreateAutomatic from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/create-automatic/create-automatic.vue'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const activeKey = ref<number>(1)

const handleTabsChange = (key: number) => {
  activeKey.value = key
}
</script>


<script lang="ts">
export default {
  name: 'OrderManagement',
}
</script>

<style scoped lang="less"></style>
