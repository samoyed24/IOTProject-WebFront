<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item label="开启温度调控">
      <a-switch v-model="formOptions.temperature"></a-switch>
    </a-form-item>
    <a-form-item
      v-if="formOptions.temperature"
      field="temperature_pivot"
      label="温度基准"
      :rules="[
        {
          required: true,
          message: '请补充温度基准',
        },
      ]"
    >
      <!--  <a-row :gutter="8">-->
      <!--   <a-col :span="12">-->
      <!--      <a-form-item-->
      <!--        field="temperature_pivot"-->
      <!--        :rules="[-->
      <!--          {-->
      <!--            required: true,-->
      <!--            message: '请补充温度基准',-->
      <!--          },-->
      <!--        ]"-->
      <!--        no-style-->
      <!--      >-->
      <!--        -->
      <!--      </a-form-item>-->
      <a-input-number
        v-model="formData.temperature_pivot"
        placeholder="温度基准，-30~100"
        :precision="1"
        :step="0.5"
        :min="-30.0"
        :max="100.0"
      >
        <template #suffix>°C</template>
      </a-input-number>
      <!--        </a-col>-->
      <!--        <a-col :span="12">-->
      <!--          <a-form-item-->
      <!--            field="temperature.upper"-->
      <!--            :rules="[-->
      <!--              {-->
      <!--                required: true,-->
      <!--                message: $t('warehouseCreate.form.error.temperature.upper.required'),-->
      <!--              },-->
      <!--            ]"-->
      <!--            no-style-->
      <!--          >-->
      <!--            <a-input-number-->
      <!--              v-model="formData.temperature.upper"-->
      <!--              :placeholder="$t('warehouseCreate.placeholder.temperature.upper')"-->
      <!--              :precision="1"-->
      <!--              :step="0.5"-->
      <!--              :min="formData.temperature.lower ? formData.temperature.lower : -30.0"-->
      <!--              :max="100"-->
      <!--            >-->
      <!--              <template #suffix>°C</template>-->
      <!--            </a-input-number>-->
      <!--          </a-form-item>-->
      <!--        </a-col>-->
      <!--      </a-row>-->
    </a-form-item>
    <a-form-item label="开启湿度调控">
      <a-switch v-model="formOptions.humidity"></a-switch>
    </a-form-item>
    <a-form-item
      v-if="formOptions.humidity"
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
                message: $t('warehouseCreate.form.error.humidity.lower.required'),
              },
            ]"
            no-style
          >
            <a-input-number
              v-model="formData.humidity.lower"
              :placeholder="$t('warehouseCreate.placeholder.humidity.lower')"
              :precision="3"
              :step="0.005"
              :min="0.0"
              :max="formData.humidity.upper ? formData.humidity.upper : 1.0"
            ></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            field="humidity.upper"
            :rules="[
              {
                required: true,
                message: $t('warehouseCreate.form.error.humidity.upper.required'),
              },
            ]"
            no-style
          >
            <a-input-number
              v-model="formData.humidity.upper"
              :placeholder="$t('warehouseCreate.placeholder.humidity.upper')"
              :precision="3"
              :step="0.005"
              :min="formData.humidity.lower ? formData.humidity.lower : 0.0"
              :max="1.0"
            ></a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item
      field="storage"
      label="库存"
      :rules="[
        {
          required: true,
          message: '请补充库房库存',
        },
      ]"
    >
      <a-input-number v-model="formData.storage" placeholder="库存件数" :step="1" :min="1" :max="100000">
        <template #suffix>件</template>
      </a-input-number>
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
import type { WarehousePropertiesModel } from '@/api/form'
import type { FormInstance } from '@arco-design/web-vue/es/form'
import { reactive, ref } from 'vue'

const emits = defineEmits(['changeStep'])

const formOptions = reactive({
  temperature: false,
  humidity: false,
})

const formRef = ref<FormInstance>()
const formData = ref<WarehousePropertiesModel>({
  temperature_pivot: null,
  humidity: {
    upper: null,
    lower: null,
  },
  storage: null,
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
