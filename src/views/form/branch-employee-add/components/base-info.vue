<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
      field="telephone"
      :label="$t('branchEmployeeAdd.form.label.telephone')"
      :rules="[
        {
          required: true,
          message: $t('branchEmployeeAdd.form.error.telephone.required'),
        },
        {
          match: /^\d{11}$/,
          message: $t('branchEmployeeAdd.form.error.telephone.pattern'),
        },
      ]"
    >
      <a-input v-model="formData.telephone" :placeholder="$t('branchEmployeeAdd.placeholder.telephone')" />
    </a-form-item>
    <a-form-item
        field="email"
        :label="$t('branchEmployeeAdd.form.label.email')"
        :rules="[
        {
          required: true,
          message: $t('branchEmployeeAdd.form.error.email.required'),
        },
        {
          match: /^\w+@[A-Za-z]+(\.[A-Za-z0-9]+){1,2}$/,
          message: $t('branchEmployeeAdd.form.error.email.pattern'),
        },
      ]"
    >
      <a-input v-model="formData.email" :placeholder="$t('branchEmployeeAdd.placeholder.email')" />
    </a-form-item>
    <a-form-item>
      <a-button
          type="primary"
          @click="onNextClick"
          :loading="nextLoading"
      >
        {{ $t('branchEmployeeAdd.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { phoneNumberValidate } from '@/api/form';
import { Message } from "@arco-design/web-vue";
import type { FormInstance } from '@arco-design/web-vue/es/form';
import { ref } from 'vue';

const emits = defineEmits(['changeStep'])
const formRef = ref<FormInstance>()
const formData = ref({
  telephone: "",
  email: ""
})

const nextLoading = ref(false)

const onNextClick = async () => {
  const res = await formRef.value?.validate()
  if (!res) {
    nextLoading.value = true
    const response: any  = await phoneNumberValidate({
      telephone: formData.value.telephone, email: formData.value.email
    })
    if (!response.data.status) {
      Message.error(response.data.message)
      nextLoading.value = false
      return
    }
    nextLoading.value = false
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
