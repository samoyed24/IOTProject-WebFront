<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
      field="temperature"
      :label="$t('warehouseCreate.form.label.temperature')"
      :rules="[
        {
          required: true,
          message: $t('warehouseCreate.form.error.advertisingSource.required'),
        },
      ]"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-item
              field="temperature.lower"
              :rules="[
                  {
                    required: true,
                    message: $t('warehouseCreate.form.error.temperature.lower.required')
                  }
              ]"
              no-style>
            <a-input-number
                v-model="formData.temperature.lower"
                :placeholder="$t('warehouseCreate.placeholder.temperature.lower')"
                :precision="1"
                :step="0.5"
                :min="-30.0"
                :max="formData.temperature.upper ? formData.temperature.upper : 100.0"
            >
              <template #suffix>
                °C
              </template>
            </a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
              field="temperature.upper"
              :rules="[
                  {
                    required: true,
                    message: $t('warehouseCreate.form.error.temperature.upper.required')
                  }
              ]"
              no-style>
            <a-input-number
                v-model="formData.temperature.upper"
                :placeholder="$t('warehouseCreate.placeholder.temperature.upper')"
                :precision="1"
                :step="0.5"
                :min="formData.temperature.lower ? formData.temperature.lower : -30.0"
                :max="100"
            >
              <template #suffix>
                °C
              </template>
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item
        field="humidity"
        :label="$t('warehouseCreate.form.label.humidity')"
        :rules="[
        {
          required: true,
          message: $t('warehouseCreate.form.error.humidity.required'),
        },
      ]"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-form-item
              field="humidity.lower"
              :rules="[
                  {
                    required: true,
                    message: $t('warehouseCreate.form.error.humidity.lower.required')
                  }
              ]"
              no-style>
            <a-input-number
                v-model="formData.humid.lower"
                :placeholder="$t('warehouseCreate.placeholder.humidityity.lower')"
                :precision="3"
                :step="0.005"
                :min="0.000"
                :max="formData.humid.upper ? formData.humid.upper : 1.000"
            ></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
              field="humidity.upper"
              :rules="[
                  {
                    required: true,
                    message: $t('warehouseCreate.form.error.humidity.upper.required')
                  }
              ]"
              no-style>
            <a-input-number
                v-model="formData.humid.upper"
                :placeholder="$t('warehouseCreate.placeholder.humidity.upper')"
                :precision="3"
                :step="0.005"
                :min="formData.humid.lower ? formData.humid.lower : 0.000"
                :max="1.000"
            ></a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item>
      <!-- <a-button type="primary" @click="onNextClick">
        {{ $t('warehouseCreate.button.next') }}
      </a-button> -->
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('warehouseCreate.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('warehouseCreate.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import type { WarehousePropertiesModel } from '@/api/form';
import type { FormInstance } from '@arco-design/web-vue/es/form';
import { ref } from 'vue';

const emits = defineEmits(['changeStep'])

const formRef = ref<FormInstance>()
const formData = ref<WarehousePropertiesModel>({
  temperature: {
    upper: 0,
    lower: 0,
  },
  humid: {
    upper: 0,
    lower: 0
  }
})

const onNextClick = async () => {
  const res = await formRef.value?.validate()
  if (!res) {
    emits('changeStep', 'submit', { ...formData.value })
  }
}
const goPrev = () => {
  emits('changeStep', 'backward')
}
</script>

<style scoped lang="less">
.container {
  .keep-margin {
    margin-bottom: 20px;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.steps {
  margin-bottom: 36px;
}

.form {
  width: 540px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
