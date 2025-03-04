<template>
  <div>
    <a-spin :loading="pageLoading" style="width: 100%">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-statistic title="当前库存货物" :value="storageData.currentStorage" animation />
        </a-col>
        <a-col :span="12">
          <a-statistic title="最大库存容量" :value="storageData.maxStorage" animation />
        </a-col>
      </a-row>
      <a-form-item
          label="库存容量（件）"
      >
        <template #help>
          <icon-exclamation-circle />
          注意，仅当库房内无货物时，您方可修改库存容量。
        </template>
        <a-input-number :disabled="!storageChangeable"></a-input-number>
      </a-form-item>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { computed, defineProps, reactive, ref } from 'vue'

const props = defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})

const storageData = reactive({
  currentStorage: 0,
  maxStorage: 0,
})

const data = computed(() => [
  {
    label: '当前库存货物',
    value: storageData.currentStorage,
  },
  {
    label: '仓库库存上限',
    value: storageData.maxStorage,
  },
])

const pageLoading = ref(true)

const storageValue = ref(null)

const storageChangeable = ref(false)

const fetchData = () => {
  // TODO
}
</script>

<script lang="ts">
export default {
  name: 'DeviceManagement',
}
</script>

<style scoped lang="less"></style>
