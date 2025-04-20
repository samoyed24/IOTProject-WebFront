<template>
  <a-modal title="货物溯源码" :visible="modalVisible" @ok="handleClose" @cancel="handleClose" @close="afterClose">
    <a-row justify="center">
      <a-image :src="getImageURL()"></a-image>
    </a-row>
    <a-row justify="center">
      <a-button type="primary" @click="downloadImage">
        <template #icon>
          <icon-download />
        </template>
        下载溯源码
      </a-button>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from "@/router";

const props = defineProps({
  cargoUuid: {
    type: String,
  },
})

const getImageURL = () => {
  return `/dev-api/management/get-cargo-qrcode?cargoUUID=${props.cargoUuid}`
}

const downloadImage = async () => {
  const response = await fetch(`/dev-api/management/get-cargo-qrcode?cargoUUID=${props.cargoUuid}`)
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${props.cargoUuid}.png`
  a.click()

  window.URL.revokeObjectURL(url)
}

const modalVisible = ref(true)

const handleClose = () => {
  modalVisible.value = false
}

const emits = defineEmits(['closeEvent'])

const afterClose = () => {
  emits('closeEvent')
}
</script>

<script lang="ts">
export default {
  name: 'QRCodeComp',
}
</script>

<style scoped lang="less"></style>
