<template>
  <a-drawer
    :visible="drawerVisible"
    width="100%"
    :title="`${warehouseProps.warehouseName} - 库存情况与订单管理`"
    @ok="handleClose"
    @close="handleClose"
    @cancel="handleClose"
  >
    <a-tabs destroy-on-hide :direction="'vertical'">
      <a-tab-pane :key="1">
        <template #title>
          <icon-layers />
          库存总览
        </template>
        <storage-total-view :warehouse-id="warehouseProps.warehouseId" />
      </a-tab-pane>
      <a-tab-pane :key="2">
        <template #title>
          <icon-nav />
          货架检索
        </template>
        <shelf-view :warehouse-id="warehouseProps.warehouseId" />
      </a-tab-pane>
      <a-tab-pane :key="3">
        <template #title>
          <icon-select-all />
          出入库记录
        </template>
        <cargo-at-gate-record :warehouse-id="warehouseProps.warehouseId" />
      </a-tab-pane>
      <a-tab-pane :key="4">
        <template #title>
          <icon-file />
          订单管理
        </template>
        <order-management :warehouse-id="warehouseProps.warehouseId" />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { defineEmits, defineProps, nextTick, reactive, ref } from 'vue'
import StorageTotalView from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/storage-total-view/storage-total-view.vue'
import ShelfView from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/shelf-view/shelf-view.vue'
import CargoAtGateRecord from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/cargo-at-gate-record/cargo-at-gate-record.vue'
import OrderManagement from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/order-management.vue'

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
  setTimeout(handleDestroyComp, 500)
}

const emits = defineEmits(['close-event'])

const handleDestroyComp = () => {
  // eslint-disable-next-line vue/custom-event-name-casing
  emits('close-event')
}
</script>

<script lang="ts">
export default {
  name: 'WarehouseStorage',
}
</script>

<style scoped lang="less"></style>
