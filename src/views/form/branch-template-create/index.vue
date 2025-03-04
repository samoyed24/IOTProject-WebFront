<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.branchTemplateCreate']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('branchTemplateCreateForm.branchTemplateCreate.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="branchTemplateCreate" style="width: 580px" line-less class="steps">
            <a-step :description="$t('branchTemplateCreateForm.branchTemplateCreate.subTitle.baseInfo')">
              {{ $t('branchTemplateCreateForm.branchTemplateCreate.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('branchTemplateCreateForm.branchTemplateCreate.subTitle.channel')">
              {{ $t('branchTemplateCreateForm.branchTemplateCreate.title.channel') }}
            </a-step>
            <a-step :description="$t('branchTemplateCreateForm.branchTemplateCreate.subTitle.finish')">
              {{ $t('branchTemplateCreateForm.branchTemplateCreate.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="branchTemplateCreate === 1" @change-step="changeStep" />
            <UploadImage v-else-if="branchTemplateCreate === 2" @change-step="changeStep" />
            <Success v-else-if="branchTemplateCreate === 3" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { submitBranchTemplateCreateForm, type BaseInfoModel, type ChannelInfoModel } from '@/api/form'
import type { CargoTemplate } from '@/api/list'
import useLoading from '@/hooks/loading'
import { ref } from 'vue'
import BaseInfo from './components/base-info.vue'
import Success from './components/success.vue'
import UploadImage from './components/upload-image.vue'

const { loading, setLoading } = useLoading(false)
const branchTemplateCreate = ref(1)
const submitModel = ref<CargoTemplate>({
  id: 0,
  name: '',
  created_by: '',
  type: '',
  created_at: '',
  period: 0,
  description: '',
  sample_image: undefined,
  cargo_name: '',
  temp: null,
  humid: null,
})
const submitForm = async () => {
  setLoading(true)
  try {
    const formData = new FormData()
    formData.append(
      'data',
      JSON.stringify({
        cargo_name: submitModel.value.cargo_name,
        type: submitModel.value.type,
        description: submitModel.value.description,
        period: submitModel.value.period,
        temp: submitModel.value.temp,
        humid: submitModel.value.humid,
      })
    )
    formData.append('sample', submitModel.value.sample_image)
    await submitBranchTemplateCreateForm(formData) // The mock api default success
    branchTemplateCreate.value = 3
    submitModel.value = {} as CargoTemplate // init
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const changeStep = (direction: string | number, model: BaseInfoModel | ChannelInfoModel) => {
  if (typeof direction === 'number') {
    branchTemplateCreate.value = direction
    return
  }

  if (direction === 'forward' || direction === 'submit') {
    submitModel.value = {
      ...submitModel.value,
      ...model,
    }
    console.log(submitModel.value)
    if (direction === 'submit') {
      submitForm()
      return
    }
    branchTemplateCreate.value += 1
  } else if (direction === 'backward') {
    branchTemplateCreate.value -= 1
  }
}
</script>

<script lang="ts">
export default {
  name: 'BranchTemplateCreate',
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
