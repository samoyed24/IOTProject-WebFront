<template>
  <a-drawer width="50%" :visible="drawerVisible" hide-cancel @ok="handleClose" @cancel="handleClose">
    <a-spin :loading="descriptionLoading">
      <a-descriptions title="标记详情" :data="descData" :column="1" />
    </a-spin>
  </a-drawer>

</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {warehouseEventDetails} from "@/api/list";

const props = defineProps({
  warehouseEventId: {
    type: Number,
  },
  warehouseId: {
    type: Number,
  },
})

const emits = defineEmits(['closeEvent'])

const drawerVisible = ref(true)

const descriptionLoading = ref(true)

const form = reactive({
  mark_resolved_by: null as string,
  mark_resolved_at: null as string,
  markNote: null as string,
})

const descData = computed(() => [
  {
    label: '标记者',
    value: form.mark_resolved_by,
  },
  {
    label: '标记时间',
    value: form.mark_resolved_at,
  },
  {
    label: '标记备注',
    value: form.markNote,
  },
])

const fetchData = async () => {
  try {
    const { data } = await warehouseEventDetails({
      warehouseId: props.warehouseId,
      eventId: props.warehouseEventId,
    })
    Object.assign(form, data)
  } catch (err) {
    Message.error(`获取失败：${err}`)
  } finally {
    descriptionLoading.value = false
  }
}

fetchData()

const handleClose = () => {
  drawerVisible.value = false
  setTimeout(() => {
    emits('closeEvent')
  }, 500)
}
</script>

<script lang="ts">
export default {
  name: 'EventResolveDetails',
}
</script>

<style scoped lang="less"></style>
