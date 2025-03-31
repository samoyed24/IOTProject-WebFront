<template>
  <a-modal title="新建需求表单" :visible="modalVisible" @ok="handleConfirm" @cancel="handleCancel" @close="afterClose">
    <a-form ref="formRef" :model="autoOrder">
      <a-form-item
        label="需求货物"
        field="template"
        :rules="[
          {
            required: true,
            message: '请输入货物名称并选择对应的货物模板',
          },
        ]"
      >
        <a-select
          v-model="autoOrder.template"
          allow-search
          placeholder="请输入货物名称并在下拉菜单选择对应货物"
          :options="autoCompleteData"
          @search="handleAutoCompleteQuery"
        />
      </a-form-item>
      <a-form-item label="需求依据" field="according" required>
        <a-select v-model="autoOrder.according" :default-value="AutoOrderAccording.QUANTITY" :options="accordingOptions" />
      </a-form-item>
      <a-form-item
        v-if="autoOrder.according === AutoOrderAccording.WEIGHT"
        label="需求重量"
        :rules="[
          {
            required: autoOrder.according === AutoOrderAccording.WEIGHT,
            message: '请填写需求重量',
          },
        ]"
      >
        <a-input-number v-model="autoOrder.weight" :precision="3" :min="0.001" :step="0.5">
          <template #suffix>kg</template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        v-if="autoOrder.according === AutoOrderAccording.QUANTITY"
        label="需求件数"
        :rules="[
          {
            required: autoOrder.according === AutoOrderAccording.QUANTITY,
            message: '请填写需求重量',
          },
        ]"
      >
        <a-input-number v-model="autoOrder.quantity" :min="1">
          <template #suffix>件</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="时间优先级" field="timePriority" required>
        <a-select v-model="autoOrder.timePriority" :default-value="TimePriority.SPOIL" :options="timeOptions" />
      </a-form-item>
      <a-form-item label="重量优先级" field="weightPriority" required>
        <a-select v-model="autoOrder.weightPriority" :default-value="AutoOrderAccording.QUANTITY" :options="weightOptions" />
      </a-form-item>
      <a-form-item label="排序策略" field="priorityStrategy" required>
        <a-select v-model="autoOrder.priorityStrategy" :default-value="PriorityStrategy.TIME" :options="strategyOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { reactive, ref } from 'vue'
import {
  type AutoOrder,
  AutoOrderAccording,
  PriorityStrategy,
  type TemplateQueryResult,
  TimePriority,
  warehouseTemplateAutoCompleteQuery,
  WeightPriority,
} from '@/api/warehouse/autoOrder/autoOrder'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import cargoType from '@/api/enums/cargoType'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const modalVisible = ref(true)

const confirm = ref(false)

const emits = defineEmits(['closeEvent'])

const formRef = ref(null)

const handleConfirm = async () => {
  const res = await formRef.value?.validate()
  if (res) {
    Message.error('请完善表单后再次尝试提交')
    return
  }
  Modal.confirm({
    title: '新建需求',
    content: '确定新建需求吗？',
    onOk: () => {
      confirm.value = true
      handleClose()
    },
  })
}

const handleCancel = () => {
  Modal.confirm({
    title: '关闭窗口',
    content: '确定关闭窗口吗？已填写的表单数据将会丢失。',
    onOk: () => {
      confirm.value = false
      handleClose()
    },
  })
}

const handleClose = () => {
  modalVisible.value = false
}

const autoOrder: AutoOrder = reactive<AutoOrder>({
  according: AutoOrderAccording.QUANTITY,
  quantity: 1,
  template: undefined,
  timePriority: TimePriority.SPOIL,
  weight: 1,
  weightPriority: WeightPriority.LIGHT,
  priorityStrategy: PriorityStrategy.TIME,
})

const accordingOptions = [
  {
    label: '货物件数(默认)',
    value: AutoOrderAccording.QUANTITY,
  },
  {
    label: '货物总重量',
    value: AutoOrderAccording.WEIGHT,
  },
]

const timeOptions = [
  {
    label: '最先到期优先(默认)',
    value: TimePriority.SPOIL,
  },
  {
    label: '最先入库优先',
    value: TimePriority.ENTER,
  },
]

const weightOptions = [
  {
    label: '小重量优先(默认)',
    value: WeightPriority.LIGHT,
  },
  {
    label: '大重量优先',
    value: WeightPriority.HEAVY,
  },
  {
    label: '随机',
    value: WeightPriority.RANDOM,
  },
]

const strategyOptions = [
  {
    label: '时间优先级优先(默认)',
    value: PriorityStrategy.TIME,
  },
  {
    label: '重量优先级优先',
    value: PriorityStrategy.WEIGHT,
  },
]

const afterClose = () => {
  emits('closeEvent', [confirm.value, autoOrder])
}

const autoCompleteData = ref<SelectOptionData[]>([])

const handleAutoCompleteQuery = async (e: string) => {
  if (e) {
    try {
      const { data }: { data: TemplateQueryResult[] } = await warehouseTemplateAutoCompleteQuery({
        warehouseId: props.warehouseId,
        cargoName: e,
      })
      const newData = []
      data.forEach((d: TemplateQueryResult) => {
        newData.push({
          label: `${d.cargoName}(${cargoType[`cargoType.${d.cargoType}`]})`,
          value: d,
        })
      })
      autoCompleteData.value = newData
    } catch (err) {
      //
    }
  } else {
    autoCompleteData.value = []
  }
}
</script>

<script lang="ts">
export default {
  name: 'OrderRequestForm',
}
</script>

<style scoped lang="less"></style>
