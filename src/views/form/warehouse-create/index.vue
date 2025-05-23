<template>
  <div class="container">
    <Breadcrumb :items="['库房管理', '库房注册']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>库房注册</template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 580px" line-less class="steps">
            <a-step :description="$t('warehouseCreate.step.subTitle.baseInfo')">
              {{ $t('warehouseCreate.step.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('warehouseCreate.step.subTitle.channel')">
              {{ $t('warehouseCreate.step.title.channel') }}
            </a-step>
            <a-step :description="$t('warehouseCreate.step.subTitle.finish')">
              {{ $t('warehouseCreate.step.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" />
            <Success v-else-if="step === 3" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import {
  submitBranchWarehouseRegisterForm,
  type BaseInfoModel,
  type ChannelInfoModel,
  type UnitChannelModel
} from '@/api/form'
import useLoading from '@/hooks/loading'
import { ref } from 'vue'
import BaseInfo from './components/base-info.vue'
import ChannelInfo from './components/channel-info.vue'
import Success from './components/success.vue'

const { loading, setLoading } = useLoading(false)
const step = ref(1)
const submitModel = ref<UnitChannelModel>({} as UnitChannelModel)
const submitForm = async () => {
  setLoading(true)
  try {
    await submitBranchWarehouseRegisterForm(submitModel.value) // The mock api default success
    step.value = 3
    submitModel.value = {} as UnitChannelModel // init
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const changeStep = (direction: string | number, model: BaseInfoModel | ChannelInfoModel) => {
  if (typeof direction === 'number') {
    step.value = direction
    return
  }

  if (direction === 'forward' || direction === 'submit') {
    submitModel.value = {
      ...submitModel.value,
      ...model,
    }
    if (direction === 'submit') {
      submitForm()
      return
    }
    step.value += 1
  } else if (direction === 'backward') {
    step.value -= 1
  }
}
</script>

<script lang="ts">
export default {
  name: 'Step',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 76px;
}
</style>
