<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
      field="name"
      :label="$t('warehouseCreate.form.label.name')"
      :rules="[
        {
          required: true,
          message: $t('warehouseCreate.form.error.name.required'),
        },
        {
          match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
          message: $t('warehouseCreate.form.error.name.pattern'),
        },
      ]"
    >
      <a-input v-model="formData.name" :placeholder="$t('warehouseCreate.placeholder.name')" />
    </a-form-item>
    <a-form-item
      field="description"
      :label="$t('warehouseCreate.form.label.description')"
    >
      <a-textarea v-model="formData.description" :placeholder="$t('warehouseCreate.placeholder.description')">

      </a-textarea>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('warehouseCreate.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue/es/form';
import { ref } from 'vue';

const emits = defineEmits(['changeStep'])
const formRef = ref<FormInstance>()
const formData = ref({
  name: '',
  description: '',
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
