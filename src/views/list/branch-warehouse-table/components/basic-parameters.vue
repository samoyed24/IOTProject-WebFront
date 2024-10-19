<template>
  <div>
    <a-form :model="form">
      <a-form-item field="name" :label="$t('branchWarehouseTable.columns.name')">
        <a-input v-model="form.name"></a-input>
      </a-form-item>
      <a-form-item field="temperature" :label="$t('branchWarehouseTable.columns.temperature')" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item field="temperature lower" label="下限">
            <a-input-number v-model="form.temperature.lower" />
          </a-form-item>
          <a-form-item field="temperature upper" label="上限">
            <a-input-number v-model="form.temperature.upper"/>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="humid" :label="$t('branchWarehouseTable.columns.humidity')" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item field="humid lower" label="下限">
            <a-input-number v-model="form.humidity.lower" />
          </a-form-item>
          <a-form-item field="humid upper" label="上限">
            <a-input-number v-model="form.humidity.upper" />
          </a-form-item>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { wareHouseGetById, type WarehousesInfo } from '@/api/list';
import { Message } from '@arco-design/web-vue';
import { reactive } from 'vue';

const form:WarehousesInfo = reactive({
  id: 0,
  name: '',
  temperature: {
    lower: 0,
    upper: 0
  },
  humidity: {
    lower: 0,
    upper: 0
  },
  description: '',
  company: '',
  branch: ''
})

const props = defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})
const fetchData = async () => {
  try {
    const params = { warehouseId: props.warehouseId }
    const { data } = await wareHouseGetById(params)
    
  } catch {
    // 错误处理逻辑
    Message.error("error")
  } finally {
    //
  }
}

fetchData()

</script>

<script lang="ts">
export default {
  name: 'BasicParameters',
}
</script>