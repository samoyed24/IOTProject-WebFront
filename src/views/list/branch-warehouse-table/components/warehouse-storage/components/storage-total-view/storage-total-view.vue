<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="9">
        <a-form-item label="货物唯一标识码">
          <a-input placeholder="请输入货物唯一标识码" :v-model="queryStruct.uuid"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="9">
        <a-form-item label="货物名称">
          <a-input placeholder="请输入货物名称" :v-model="queryStruct.cargoName"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" long>
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
      </a-col>
      <a-col :span="3">
        <a-button long @click="fetchData">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
      </a-col>
    </a-row>
    <a-table :data="tableData" :columns="cargoColumns" :loading="tableLoading" :pagination="pagination">
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
      <template #uuid="{ record }">
        <a-button
          @click="
            Modal.info({
              title: '货物唯一标识码',
              content: record.uuid,
            })
          "
        >
          查看
        </a-button>
      </template>
      <template #cargoType="{ record }">
        {{ cargoType[`cargoType.${record.cargoType}`] }}
      </template>
      <template #restTime="{ record }">
        {{record.restTime.day}}天{{record.restTime.hour}}小时
      </template>
      <template #storageLocation="">
        <a-button>
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
      </template>
      <template #operations="">
        <a-button :status="'warning'">
          <template #icon>
            <icon-check />
          </template>
          标记待出库
        </a-button>
      </template>
      <!--    <template #operations="{ record }">-->
      <!--    </template>-->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { nextTick, reactive, ref } from 'vue'
import type { Pagination } from '@/types/global'
import { warehouseQueryAllCargo } from '@/api/list'
import cargoType from "@/api/enums/cargoType";

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const queryStruct = reactive({
  uuid: '',
  cargoName: '',
})

const tableLoading = ref(true)

const tableData = reactive([])

const cargoColumns = [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '货物唯一标识码',
    dataIndex: 'uuid',
    slotName: 'uuid',
  },
  {
    title: '货物名称',
    dataIndex: 'cargoName',
  },
  {
    title: '货物类型',
    dataIndex: 'cargoType',
    slotName: 'cargoType',
  },
  {
    title: '重量(kg)',
    dataIndex: 'weight',
    slotName: 'weight',
  },
  {
    title: '入库操作者',
    dataIndex: 'enterMember',
  },
  {
    title: '入库时间',
    dataIndex: 'enterTime',
  },
  {
    title: '剩余存储时长',
    dataIndex: 'restTime',
    slotName: 'restTime',
  },
  {
    title: '存储位置',
    slotName: 'storageLocation',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
]

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})

const fetchData = async () => {
  tableLoading.value = true
  try {
    const params = {
      warehouseId: props.warehouseId,
      pageSize: pagination.pageSize,
      current: pagination.current,
      uuid: queryStruct.uuid,
      cargoName: queryStruct.cargoName,
    }
    const { data } = await warehouseQueryAllCargo(params)
    tableData.splice(0, tableData.length, ...data.list)
    pagination.total = data.total
  } catch {
    // 错误处理逻辑
    Message.error('error')
  } finally {
    await nextTick(() => {
      tableLoading.value = false
    })
  }
}

fetchData()
</script>

<script lang="ts">
export default {
  name: 'StorageTotalView',
}
</script>

<style scoped lang="less"></style>
