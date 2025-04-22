<template>
  <a-modal title="溯源反馈详情" :visible="modalVisible" @ok="handleClose" @cancel="handleClose" @close="afterClose">
    <a-form :model="formData">
      <a-form-item label="唯一标识码">
        <a-input :model-value="formData.cargoUUID" />
      </a-form-item>
      <a-form-item label="反馈货物名称">
        <a-input :model-value="formData.cargoName" />
      </a-form-item>
      <a-form-item label="反馈环节">
        <a-input :model-value="formData.part" />
      </a-form-item>
      <a-form-item label="反馈者姓名">
        <a-input :model-value="formData.name" />
      </a-form-item>
      <a-form-item label="联系方式">
        <a-input :model-value="formData.contact" />
      </a-form-item>
      <a-form-item label="反馈内容">
        <a-textarea :model-value="formData.contact" style="height: 200px" />
      </a-form-item>
      <a-form-item>
        <a-popconfirm :on-before-ok="markResolved" content="是否确定？">
          <a-button v-if="!formData.resolved" :loading="submitLoading" type="secondary" status="success" long>标记已解决</a-button>
        </a-popconfirm>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getFeedbackDetails, markFeedbackResolved } from '@/api/list'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  detailId: {
    type: Number,
  },
})

const submitEnd = ref(false)

const formData = ref({
  cargoUUID: null,
  cargoName: null,
  time: null,
  part: null,
  name: null,
  contact: null,
  content: null,
  resolved: null,
  resolvedBy: null,
})

const modalVisible = ref(true)

const handleClose = () => {
  modalVisible.value = false
}

const submitLoading = ref(false)

const emits = defineEmits(['closeEvent'])

const afterClose = () => {
  emits('closeEvent', submitEnd.value)
}

const fetchData = async () => {
  try {
    const { data } = await getFeedbackDetails({
      detailId: props.detailId,
    })
    formData.value = data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    //
  }
}

fetchData()

const markResolved = async () => {
  submitLoading.value = true
  try {
    const res = await markFeedbackResolved({
      detailId: props.detailId,
    })
    if (res.status) {
      submitEnd.value = true
      Message.success('标记成功')
      handleClose()
    }
  } catch {
    //
  } finally {
    submitLoading.value = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'FeedbackDetail',
}
</script>

<style scoped lang="less"></style>
