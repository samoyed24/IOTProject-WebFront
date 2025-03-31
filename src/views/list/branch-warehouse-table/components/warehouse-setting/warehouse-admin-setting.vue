<template>
  <!--  <a-drawer-->
  <!--    width="50%"-->
  <!--    :visible="drawerVisible"-->
  <!--    :title="`${props.warehouseProps.warehouseName} - 管理人员设置`"-->
  <!--    unmount-on-close-->
  <!--    @cancel="handleDrawerClose"-->
  <!--  >-->
  <a-form-item label="添加人员">
    <a-auto-complete
      v-model="searchContent"
      :data="employeeData"
      placeholder="请输入手机号进行添加，支持姓名/手机号/邮箱模糊搜索"
      @search="handleSearch"
    />

    <a-button type="primary" :loading="addLoading" @click="handleAddAdmin">
      <template #icon><icon-user-add /></template>
    </a-button>
  </a-form-item>
  <a-table :columns="tableColumns" :data="tableData" :loading="tableLoading">
    <template #operations="{ record }">
      <a-popconfirm content="确认？" :popup-visible="popUpVisible" @ok="handleCancelAdmin(record.id)">
        <a-button type="secondary" status="danger" size="small" :loading="cancelButtonLoading == record.id">取消</a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <!--  </a-drawer>-->
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Message, TableColumn } from '@arco-design/web-vue'
import { warehouseAddAdmin, warehouseCancelAdmin, warehouseGetAdmin, warehouseQueryEmployees } from '@/api/list'

const props = defineProps({
  warehouseProps: {
    type: Object,
    default: () => {
      return {
        warehouseId: null as string,
        warehouseName: null as string,
      }
    },
  },
})

const emits = defineEmits(['closeEvent'])

const drawerVisible = ref(true)

const tableColumns = ref<TableColumn>([
  {
    title: '姓名',
    dataIndex: 'name',
    slotName: 'name',
  },
  {
    title: '手机',
    dataIndex: 'telephone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '最后上线',
    dataIndex: 'last_login',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
])

const tableData = reactive([])

const tableLoading = ref(true)

const fetchData = async () => {
  tableLoading.value = true
  try {
    const { data } = await warehouseGetAdmin({
      warehouseId: props.warehouseProps.warehouseId,
    })
    tableData.splice(0, tableData.length, ...data.list)
  } catch (err) {
    Message.error(`拉取列表失败, ${err}`)
  } finally {
    tableLoading.value = false
  }
}

const handleDrawerClose = () => {
  drawerVisible.value = false
  setTimeout(() => {
    emits('closeEvent')
  }, 500)
}

const employeeData = reactive([])

const searchContent = ref('')

const handleSearch = async () => {
  await nextTick(async () => {
    try {
      const { data } = await warehouseQueryEmployees({
        kw: searchContent.value,
      })
      employeeData.splice(0, employeeData.length, ...data.list)
    } catch (err) {
      //
    }
  })
}

const addLoading = ref(false)

const handleAddAdmin = async () => {
  if (!searchContent.value) {
    Message.error('请输入添加员工的手机号')
    return
  }
  try {
    addLoading.value = true
    const { data } = await warehouseAddAdmin({
      warehouseId: props.warehouseProps.warehouseId,
      telephone: searchContent.value,
    })
    Message.success('添加成功')
    await fetchData()
  } catch (err) {
    Message.error(`添加失败：${err}`)
  } finally {
    addLoading.value = false
  }
}

const cancelButtonLoading = ref(null)

const handleCancelAdmin = async (recordId: number) => {
  cancelButtonLoading.value = recordId
  try {
    await warehouseCancelAdmin({ recordId })
    Message.success('操作成功')
    await fetchData()
  } catch (err) {
    Message.error(`操作失败，${err}`)
  } finally {
    cancelButtonLoading.value = null
  }
}

fetchData()
</script>

<script lang="ts">
export default {
  name: 'WarehouseAdminSetting',
}
</script>

<style scoped lang="less"></style>
