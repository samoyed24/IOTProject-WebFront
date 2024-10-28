<template>
  <a-modal title="标记事件解决" :visible="modalVisible" :ok-loading="okLoading" @cancel="handleClose" @ok="handleMarkSubmit">
    <a-form ref="formRef" :model="formData">
      <a-form-item
        label="标记备注"
        field="markNote"
        :rules="[
          {
            required: true,
            message: '该项为必填项',
          },
      ]">
        <template #help>
          <icon-exclamation-circle-fill />
          必填项，标记事件发生原因、解决方法、完成情况等。提交后，事件将标记为已解决，标记者、标记备注将公开，且无法撤回、修改。
        </template>
        <a-textarea v-model="formData.markNote" max-length="300" show-word-limit></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {Message, Modal} from "@arco-design/web-vue";
import {warehouseEventMark} from "@/api/list";

const formData = reactive({
  markNote: null as string,
})

const props = defineProps({
  warehouseEventId: {
    type: Number,
  },
  warehouseId: {
    type: Number,
  },
})

const emits = defineEmits(['closeEvent'])

const handleClose = () => {
  modalVisible.value = false
  setTimeout(() => {
    emits('closeEvent')
  }, 500)
}

const modalVisible = ref(true)

const formRef = ref()

const okLoading = ref(false)

const handleMarkSubmit = async () => {
  const res = await formRef.value?.validate()
  if (res) {
    Message.error('请检查未填项')
    return
  }
  Modal.confirm({
    content: '该操作不可逆，是否继续？',
    title: '提交标记',
    onOk: async () => {
      try {
        okLoading.value = true
        await warehouseEventMark({
          warehouseId: props.warehouseId,
          warehouseEventId: props.warehouseEventId,
          markNote: formData.markNote,
        })
        Message.success('标记成功')
        handleClose()
      } catch (err) {
        Message.error(`提交失败：${err}`)
      } finally {
        okLoading.value = false
      }
    },
  })
}
</script>

<script lang="ts">
export default {
  name: 'EventMarkResolved',
}
</script>

<style scoped lang="less"></style>
