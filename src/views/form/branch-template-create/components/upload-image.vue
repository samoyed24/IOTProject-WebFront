<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item
      field="sampleImage"
      :label="$t('branchTemplateCreateForm.form.label.sampleImage')"
    >
      <a-upload
          v-model="formData.sample_image"
          :placeholder="$t('branchTemplateCreateForm.placeholder.advertisingSource')"
          :custom-request="handleImageUpload"
          :limit="1"
          draggable
      />
    </a-form-item>
    <a-form-item>
      <!-- <a-button type="primary" @click="onNextClick">
        {{ $t('branchTemplateCreateForm.button.next') }}
      </a-button> -->
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('branchTemplateCreateForm.button.prev') }}
        </a-button>
        <a-button type="primary" @click="() => {formData.sample_image ? onNextClick() : this.$message.error('图片未上传')}">
          {{ $t('branchTemplateCreateForm.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'

const emits = defineEmits(['changeStep'])

const fileList = ref([])

const formRef = ref<FormInstance>()
const formData = ref({
  sample_image: null as any
})

const onNextClick = async () => {
  // const res = await formRef.value?.validate()
  emits('changeStep', 'submit', { ...formData.value })
}
const goPrev = () => {
  emits('changeStep', 'backward')
}

const handleImageUpload = (e: any) => {
  // console.log(e.fileItem.file)
  formData.value.sample_image = e.fileItem.file
  return e.onSuccess()
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
