<template>
  <div>
    <a-space></a-space>
    <a-button
      long
      @click="
        () => {
          pagination.current = 1
          fetchData()
        }
      "
    >
      <template #icon>
        <icon-refresh />
      </template>
      刷新
    </a-button>
    <a-table
      :data="tableData"
      :columns="cargoColumns"
      :loading="tableLoading"
      :pagination="pagination"
      :scrollbar="true"
      :scroll="{ x: 0, y: 300 }"
      :column-resizable="true"
      @page-change="onPageChange"
    >
      <!--      <template #index="{ rowIndex }">-->
      <!--        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}-->
      <!--      </template>-->
      <template #isIn="{ record }">
        <div v-if="record.isIn">
          <span class="circle pass" />
          入库
        </div>
        <div v-else>
          <span class="circle bad" />
          出库
        </div>
      </template>
      <template #orderComplete="{ record }">
        <div v-if="record.cargoCount == record.doneCount">
          <span class="circle pass" />
          已完成
        </div>
        <div v-else>
          <span class="circle bad" />
          未完成
        </div>
      </template>
      <template #doneTime="{ record }">
        <span v-if="record.doneTime">{{ record.doneTime }}</span>
        <span v-else>未完成</span>
      </template>
      <template #operations="{ record }">
        <!--      <template #operations>-->
        <a-button @click="handleViewDetails(record.id)">查看详情</a-button>
        <a-button @click="Message.warning('TODO 待实现')">打印订单</a-button>
      </template>
    </a-table>
    <order-details v-if="detailSelect != -1" :order-id="detailSelect" @close-event="detailSelect = -1"></order-details>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { nextTick, reactive, ref } from 'vue'
import type { Pagination } from '@/types/global'
import { cargoQueryLocation, warehouseOrderGetAll } from '@/api/list'
import cargoType from '@/api/enums/cargoType'
import OrderDetails from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/order-view/order-details/order-details.vue'

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const tableData = reactive([])
const cargoColumns = [
  // {
  //   title: '#',
  //   dataIndex: 'index',
  //   slotName: 'index',
  // },
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '下单操作者',
    dataIndex: 'createdBy',
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
    width: '200',
  },
  {
    title: '订单货物总数',
    dataIndex: 'cargoCount',
  },
  {
    title: '出货货物数量',
    dataIndex: 'doneCount',
  },
  {
    title: '订单是否完成',
    slotName: 'orderComplete',
  },
  {
    title: '订单完成时间',
    dataIndex: 'doneTime',
    slotName: 'doneTime',
  },
  {
    title: '操作',
    slotName: 'operations',
    width: '300',
  },
]
const tableLoading = ref(true)

const fetchData = async () => {
  tableLoading.value = true
  try {
    const { data } = await warehouseOrderGetAll({
      warehouseId: props.warehouseId,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    tableData.splice(0, tableData.length, ...data.list)
    // Object.assign(tableData, data.list)
    pagination.total = data.total
  } catch (err) {
    Message.error('请求失败')
    throw err
  } finally {
    tableLoading.value = false
  }
}

fetchData()

const onPageChange = (current: number) => {
  pagination.current = current
  fetchData()
}

const detailSelect = ref(-1)

const handleViewDetails = (id: number) => {
  detailSelect.value = id
}
</script>

<script lang="ts">
export default {
  name: 'OrderView',
}
</script>

<style scoped lang="less"></style>
