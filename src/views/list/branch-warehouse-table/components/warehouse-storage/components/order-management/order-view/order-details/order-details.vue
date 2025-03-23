<template>
  <a-modal :title="`订单详情 - #${props.orderId}`" :visible="modalVisible" fullscreen @ok="handleClose" @cancel="handleClose" @close="afterClose">
    <a-table :data="tableData" :columns="cargoColumns" :loading="tableLoading">
      <template #cargoType="{ record }">
        {{ cargoType[`cargoType.${record.cargoType}`] }}
      </template>
      <template #isOut="{ record }">
        <div v-if="record.exitTime">
          <span class="circle pass" />
          已出库
        </div>
        <div v-else>
          <span class="circle bad" />
          未出库
        </div>
      </template>
      <template #exitTime="{ record }">
        <template v-if="record.exitTime">
          {{ record.exitTime }}
        </template>
        <template v-else>
          未出库
        </template>
      </template>
      <template #exitMember="{ record }">
        <template v-if="record.exitMember">
          {{ record.exitMember }}
        </template>
        <template v-else>
          未出库
        </template>
      </template>
      <template #location="{ record }">
        <template v-if="!record.exitTime">
          {{ record.location }}
        </template>
        <template v-else>
          已出库
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { nextTick, reactive, ref } from 'vue'
import cargoType from '@/api/enums/cargoType'
import {warehouseOrderDetail, warehouseQueryAtGateRecords} from "@/api/list";

const props = defineProps({
  orderId: {
    type: Number,
  },
})

const tableLoading = ref(true)
const tableData = reactive([])
const cargoColumns = [
  // {
  //   title: '#',
  //   dataIndex: 'index',
  //   slotName: 'index',
  // },
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
    title: '是否已出库',
    slotName: 'isOut',
  },
  {
    title: '出库时间',
    dataIndex: 'exitTime',
    slotName: 'exitTime',
  },
  {
    title: '出库操作者',
    dataIndex: 'exitMember',
    slotName: 'exitMember',
  },
  {
    title: '存储位置',
    dataIndex: 'location',
    slotName: 'location',
  },
]

const modalVisible = ref(true)

const emits = defineEmits(['closeEvent'])

const handleClose = () => {
  modalVisible.value = false
}

const afterClose = () => {
  emits('closeEvent')
}

const fetchData = async () => {
  tableLoading.value = true
  try {
    const { data } = await warehouseOrderDetail({
      orderId: props.orderId,
    })
    tableData.splice(0, tableData.length, ...data)
  } catch (err) {
    Message.error('请求失败')
    throw err
  } finally {
    tableLoading.value = false
  }
}

fetchData()
</script>

<script lang="ts">
export default {
  name: 'OrderDetails'
}
</script>

<style scoped lang="less"></style>
