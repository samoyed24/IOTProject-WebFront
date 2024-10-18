<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
        field="name"
        :label="$t('branchEmployeeAdd.form.label.name')"
        :rules="[{ required: true, message: $t('branchEmployeeAdd.form.error.name.required') }]"
    >
      <a-input v-model="formData.name" :placeholder="$t('branchEmployeeAdd.placeholder.name')">
      </a-input>
    </a-form-item>
    <a-form-item
        field="role"
        :label="$t('branchEmployeeAdd.form.label.role')"
        :rules="[{ required: true, message: $t('branchEmployeeAdd.form.error.role.required') }]"
    >
      <a-select v-model="formData.role" :placeholder="$t('branchEmployeeAdd.placeholder.role')">
        <a-option value="storage">仓储</a-option>
        <a-option value="transmit">运输</a-option>
        <a-option value="retail">零售</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
        field="password"
        :label="$t('branchEmployeeAdd.form.label.password')"
        :rules="[
            { required: true, message: $t('branchEmployeeAdd.form.error.password.required') },
            { match: /^\w{8,32}$/, message: $t('branchEmployeeAdd.form.error.password.pattern') },
            ]"
    >
      <a-input
          v-model="formData.password"
          :placeholder="$t('branchEmployeeAdd.placeholder.password')"
          type="password"
      >
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('branchEmployeeAdd.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('branchEmployeeAdd.button.next') }}
        </a-button>
      </a-space>
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
  role: '',
  password: ''
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
