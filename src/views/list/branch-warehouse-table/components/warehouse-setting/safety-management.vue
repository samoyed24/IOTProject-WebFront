<template>
  <a-tabs v-model:active-key="activeTab" position="left">
    <a-tab-pane :key="1">
      <template #title>
        <icon-user />
        生产安全
      </template>
    </a-tab-pane>
    <a-tab-pane :key="2">
      <template #title>
        <icon-fire />
        防火安全
      </template>
    </a-tab-pane>
    <a-tab-pane :key="3">
      <template #title>
        <icon-lock />
        防盗安全
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const activeTab = ref(1)

</script>

<script lang="ts">
export default {
  name: 'SafetyManagement',
}
</script>

<style scoped lang="less"></style>
