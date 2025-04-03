<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
      field="cargo_name"
      :label="$t('branchTemplateCreateForm.form.label.cargoName')"
      :rules="[
        {
          required: true,
          message: $t('branchTemplateCreateForm.form.error.cargoName.required'),
        },
        {
          match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/,
          message: $t('branchTemplateCreateForm.form.error.cargoName.pattern'),
        },
      ]"
    >
      <a-input v-model="formData.cargo_name" :placeholder="$t('branchTemplateCreateForm.placeholder.cargoName')" />
    </a-form-item>
    <a-form-item
      field="type"
      :label="$t('branchTemplateCreateForm.form.label.type')"
      :rules="[
        {
          required: true,
          message: $t('branchTemplateCreateForm.form.error.type.required'),
        },
      ]"
    >
      <a-select v-model="formData.type" :placeholder="$t('branchTemplateCreateForm.placeholder.type')">
        <a-option value="vegetable">果蔬</a-option>
        <a-option value="meat">肉类</a-option>
        <a-option value="snack">冷藏零食</a-option>
        <a-option value="medicine">医药用品</a-option>
        <a-option value="other">其他</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="period"
      :label="$t('branchTemplateCreateForm.form.label.period')"
      :rules="[
        {
          required: true,
          message: $t('branchTemplateCreateForm.form.error.period.required'),
        },
      ]"
    >
      <a-input-number v-model="formData.period" :step="1" :min="1" placeholder="请输入保质期（天）">
        <template #suffix>天</template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="temp" label="建议储存温度">
      <a-input-number
        v-model="formData.temp"
        :precision="1"
        :step="0.5"
        :min="-30"
        :max="100"
        placeholder="（可选）请输入建议储存温度，-30~100"
      >
        <template #suffix>°C</template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="humid" label="建议储存湿度">
      <a-input-number
        v-model="formData.humid"
        :precision="3"
        :step="0.01"
        :min="0"
        :max="1"
        placeholder="（可选）请输入建议储存湿度，0.000~1.000"
      >
        <template #suffix>°C</template>
      </a-input-number>
    </a-form-item>
    <a-form-item
      field="description"
      :label="$t('branchTemplateCreateForm.form.label.description')"
      :rules="[
        {
          required: true,
          message: $t('branchTemplateCreateForm.form.error.description.required'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea v-model="formData.description" :placeholder="$t('branchTemplateCreateForm.placeholder.description')" />
      <!--      <template #help>-->
      <!--        <span>{{ $t('branchTemplateCreateForm.form.tip.promoteLink') }}</span>-->
      <!--      </template>-->
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('branchTemplateCreateForm.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import type { TemplateModel } from '@/api/form'
import type { FormInstance } from '@arco-design/web-vue/es/form'
import { ref } from 'vue'

const emits = defineEmits(['changeStep'])
const formRef = ref<FormInstance>()
const formData = ref<TemplateModel>({
  cargo_name: '',
  type: '',
  description: '',
  period: '',
  temp: null,
  humid: null,
})

const onNextClick = async () => {
  const res = await formRef.value?.validate()
  if (!res) {
    emits('changeStep', 'forward', { ...formData.value })
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 20px;
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
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
