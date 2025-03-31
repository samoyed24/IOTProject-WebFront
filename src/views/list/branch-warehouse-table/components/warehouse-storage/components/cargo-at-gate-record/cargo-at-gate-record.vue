<template>
  <div>
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
      column-resizable
      @page-change="onPageChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
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
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { nextTick, reactive, ref } from 'vue'
import type { Pagination } from '@/types/global'
import { cargoQueryLocation, warehouseQueryAllCargo, warehouseQueryAtGateRecords } from '@/api/list'
import cargoType from '@/api/enums/cargoType'

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
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
    width: 100,
  },
  {
    title: '货物唯一标识码',
    dataIndex: 'uuid',
    width: 400,
  },
  {
    title: '货物名称',
    dataIndex: 'cargoName',
  },
  {
    title: '时间',
    dataIndex: 'time',
  },
  {
    title: '出库/入库',
    dataIndex: 'isIn',
    slotName: 'isIn',
  },
  {
    title: '操作者',
    dataIndex: 'operator',
  },
]
const tableLoading = ref(true)

const fetchData = async () => {
  tableLoading.value = true
  try {
    const { data } = await warehouseQueryAtGateRecords({
      warehouseId: props.warehouseId,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    tableData.splice(0, tableData.length, ...data.list)
    // Object.assign(tableData, data.list)
    pagination.total = data.total
  } catch {
    Message.error('请求失败')
  } finally {
    tableLoading.value = false
  }
}

fetchData()

const onPageChange = (current: number) => {
  pagination.current = current
  fetchData()
}
</script>

<script lang="ts">
export default {
  name: 'CargoAtGateRecord',
}
</script>

<style scoped lang="less"></style>
