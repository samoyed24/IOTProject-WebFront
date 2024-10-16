<template>
  <div class="success-wrap">
    <a-result status="success" :title="$t('warehouseCreate.success.title')" :subtitle="$t('warehouseCreate.success.subTitle')" />
    <a-space :size="16">
      <a-button key="view" type="primary">
        {{ $t('warehouseCreate.button.view') }}
      </a-button>
      <a-button key="again" type="secondary" @click="oneMore">
        {{ $t('warehouseCreate.button.again') }}
      </a-button>
    </a-space>
<!--    <div class="details-wrapper">-->
<!--      <a-typography-title :heading="6" style="margin-top: 0">-->
<!--        {{ $t('warehouseCreate.form.description.title') }}-->
<!--      </a-typography-title>-->
<!--      <a-typography-paragraph style="margin-bottom: 0">-->
<!--        {{ $t('warehouseCreate.form.description.text') }}-->
<!--        <a-link href="link">{{ $t('warehouseCreate.button.view') }}</a-link>-->
<!--      </a-typography-paragraph>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['changeStep'])
const oneMore = () => {
  emits('changeStep', 1)
}
</script>

<style scoped lang="less">
.success-wrap {
  text-align: center;
}
:deep(.arco-result) {
  padding-top: 0;
}
.details-wrapper {
  width: 895px;
  margin-top: 54px;
  padding: 20px;
  text-align: left;
  background-color: var(--color-fill-2);
}
</style>
