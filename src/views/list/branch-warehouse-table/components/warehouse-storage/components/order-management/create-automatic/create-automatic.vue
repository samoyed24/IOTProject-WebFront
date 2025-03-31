<template>
  <div>
    <a-space />
    <a-result v-if="orderRequest.length === 0" :status="null" title="请单击下方按钮" subtitle="新增一项需求以开启自动创建订单流程">
      <template #icon>
        <icon-plus />
      </template>
    </a-result>
    <a-table v-else :loading="tableLoading" title="订单需求列表" :data="orderRequest" :columns="columnsData">
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #template="{ record }: { record: OrderToSubmit }">
        {{ record.order.template.cargoName }}
      </template>
      <template #according="{ record }: { record: OrderToSubmit }">
        {{ autoOrder[`autoOrderAccording.${record.order.according}`] }}
        <span v-if="record.order.according === AutoOrderAccording.QUANTITY">- {{ record.order.quantity }}件</span>
        <span v-else-if="record.order.according === AutoOrderAccording.WEIGHT">- {{ record.order.weight }}kg</span>
      </template>
      <template #timePriority="{ record }: { record: OrderToSubmit }">
        {{ autoOrder[`autoOrderTimePriority.${record.order.timePriority}`] }}
      </template>
      <template #weightPriority="{ record }: { record: OrderToSubmit }">
        {{ autoOrder[`autoOrderWeightPriority.${record.order.weightPriority}`] }}
      </template>
      <template #priorityStrategy="{ record }: { record: OrderToSubmit }">
        {{ autoOrder[`autoOrderPriorityStrategy.${record.order.priorityStrategy}`] }}
      </template>
      <template #checkResult="{ record }: { record: OrderToSubmit }">
        <span v-if="record.checkResult.status === 0">
          <icon-question-circle-fill style="color: gray" />
          待检查
        </span>
        <span v-else-if="record.checkResult.status === -1">
          <icon-exclamation-circle-fill style="color: orange" />
          未通过
          <a-button
            size="small"
            type="text"
            @click="
              () => {
                Modal.info({ title: '检查未通过', content: record.checkResult.message })
              }
            "
          >
            查看原因
          </a-button>
        </span>
        <span v-else-if="record.checkResult.status === 1" style="color: lawngreen">
          <icon-check-circle-fill />
          已通过
        </span>
      </template>
      <template #operations="{ record }: { record: OrderToSubmit }">
        <a-button
          type="text"
          status="danger"
          @click="
            () => {
              orderRequest = orderRequest.filter((item: OrderToSubmit) => {
                item.order.template.id != record.order.template.id
              })
            }
          "
        >
          删除
        </a-button>
      </template>
    </a-table>
    <a-space />
    <a-button status="success" long @click="setRequest(true)">
      <template #icon>
        <icon-plus />
      </template>
      新增需求
    </a-button>
    <a-button v-if="orderRequest.length !== 0" type="primary" long @click="checkRequest">
      <template #icon>
        <icon-clock-circle />
      </template>
      提交检查
    </a-button>
    <order-request-form v-if="requestOn" :warehouse-id="props.warehouseId" @close-event="handleRequestAdd" />
    <auto-order-confirm v-if="confirmOn" :warehouse-id="props.warehouseId" :final-orders="finalOrders" @close-event="handleConfirmClose" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderRequestForm from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/create-automatic/order-request-form/order-request-form.vue'
import autoOrder, {
  type AutoOrder,
  AutoOrderAccording, type FinalOrder,
  type OrderCheckResult,
  type OrderToSubmit,
  warehouseAutoOrderCheck,
} from '@/api/warehouse/autoOrder/autoOrder'
import { Message, Modal } from '@arco-design/web-vue'
import AutoOrderConfirm from '@/views/list/branch-warehouse-table/components/warehouse-storage/components/order-management/create-automatic/order-request-form/auto-order-confirm.vue'
import {useRouter} from "vue-router";
import router from "@/router";

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const requestOn = ref(false)
const setRequest = (on: boolean) => {
  requestOn.value = on
}

const columnsData = [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '货物名称',
    dataIndex: 'template',
    slotName: 'template',
  },
  {
    title: '需求依据',
    dataIndex: 'according',
    slotName: 'according',
  },
  {
    title: '时间优先级策略',
    dataIndex: 'timePriority',
    slotName: 'timePriority',
  },
  {
    title: '重量优先级策略',
    dataIndex: 'weightPriority',
    slotName: 'weightPriority',
  },
  {
    title: '优先策略',
    slotName: 'priorityStrategy',
  },
  {
    title: '检查结果',
    slotName: 'checkResult',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
]

const handleRequestAdd = ([confirm, order]: [boolean, AutoOrder]) => {
  if (confirm) {
    if (orderRequest.value.some((item) => item.order.template.id === order.template.id)) {
      Message.error('添加失败：需求与已有需求冲突')
    } else {
      const newOrder: OrderToSubmit = {
        order,
        checkResult: {
          status: 0,
          message: null,
        },
      }
      orderRequest.value.push(newOrder)
      Message.success('需求添加成功')
    }
  }
  setRequest(false)
}

const orderRequest = ref<OrderToSubmit[]>([])

const checkRequest = () => {
  Modal.confirm({
    title: '提交系统检查',
    content: '确定将订单提交系统检查吗？',
    onOk: handleOrderCheck,
  })
}

const tableLoading = ref(false)

const finalOrders = ref<FinalOrder[]>([])

const orderAllWaitingForCheck = () => {
  orderRequest.value.forEach((order: OrderToSubmit) => {
    order.checkResult.status = 0
    order.checkResult.message = null
  })
}

const confirmOn = ref(false)

const handleOrderCheck = async () => {
  tableLoading.value = true
  orderAllWaitingForCheck()
  Message.info('已提交系统检查，即将返回检查结果...')
  try {
    const { data }: { data: OrderCheckResult } = await warehouseAutoOrderCheck({
      orders: orderRequest.value,
      warehouseId: props.warehouseId,
    })
    orderRequest.value = data.orders
    if (!data.status) {
      Message.error('系统检查未通过，请您根据错误原因修改需求')
    } else {
      Message.success('系统检查通过，请确认订单')
      finalOrders.value = data.finalOrder
      confirmOn.value = true
    }
  } catch {
    //
  } finally {
    tableLoading.value = false
  }
}

const handleConfirmClose = (confirm: boolean) => {
  confirmOn.value = false
  finalOrders.value = []
  if (confirm) {
    orderRequest.value = []
  }
}
</script>

<script lang="ts">
export default {
  name: 'CreateAutomatic',
}
</script>

<style scoped lang="less"></style>
