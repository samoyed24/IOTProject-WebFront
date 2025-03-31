<template>
  <a-modal fullscreen title="订单确认" :visible="modalVisible" @ok="handleConfirm" @cancel="handleCancel" @close="afterClose">
    <a-table :data="props.finalOrders" :columns="columnsData" :loading="tableLoading">
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #type="{ record }: { record: FinalOrder }">
        {{ cargoType[`cargoType.${record.type}`] }}
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue'
import { type FinalOrder } from '@/api/warehouse/autoOrder/autoOrder'
import { Message, Modal } from '@arco-design/web-vue'
import cargoType from '@/api/enums/cargoType'
import { warehouseOrderCreate } from '@/api/list'

const modalVisible = ref(true)

const props = defineProps({
  warehouseId: {
    type: Number,
    required: true,
  },
  finalOrders: {
    type: Array as PropType<FinalOrder[]>,
  },
})

const emits = defineEmits(['closeEvent'])

const tableLoading = ref(false)

const handleConfirm = () => {
  Modal.confirm({
    title: '确认订单',
    content: '确定确认并提交订单吗？',
    onOk: async () => {
      confirm.value = true
      const confirmCargos: string[] = props.finalOrders.map((item) => item.uuid)
      tableLoading.value = true
      try {
        const { data } = await warehouseOrderCreate({
          warehouseId: props.warehouseId,
          cargoList: confirmCargos,
        })
        Message.success(`创建订单${data.orderId}，共包含${data.orderLength}件货物，${data.failCount}件货物添加失败`)
      } finally {
        tableLoading.value = false
        handleClose()
      }
    },
  })
}

const confirm = ref(true)

const handleCancel = () => {
  Modal.confirm({
    title: '关闭窗口',
    content: '确定关闭窗口吗？订单信息将会丢失。',
    onOk: () => {
      confirm.value = false
      handleClose()
    },
  })
}

const handleClose = () => {
  modalVisible.value = false
}

const afterClose = () => {
  emits('closeEvent', confirm.value)
}

const columnsData = [
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
    slotName: 'type',
  },
  {
    title: '货物重量',
    dataIndex: 'weight',
  },
  {
    title: '入库时间',
    dataIndex: 'enterTime',
  },
  {
    title: '到期时间',
    dataIndex: 'expiredAt',
  },
]
</script>

<script lang="ts">
export default {
  name: 'AutoOrderConfirm',
}
</script>

<style scoped lang="less"></style>
