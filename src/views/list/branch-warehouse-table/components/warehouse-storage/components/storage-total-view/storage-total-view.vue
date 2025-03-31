<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="7">
        <a-form-item label="货物唯一标识码">
          <a-input v-model="queryStruct.uuid" placeholder="请输入货物唯一标识码"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="7">
        <a-form-item label="货物名称">
          <a-input v-model="queryStruct.cargoName" placeholder="请输入货物名称"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="排序">
          <a-switch v-model="queryStruct.filterType" @change="fetchData">
            <template #checked>剩余时长</template>
            <template #unchecked>入库时间</template>
          </a-switch>
        </a-form-item>
      </a-col>
      <a-col :span="2">
        <a-button type="primary" long @click="fetchData">
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
      </a-col>
      <a-col :span="2">
        <a-button long @click="fetchData">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
      </a-col>
      <a-col :span="2">
        <a-button
          long
          @click="
            () => {
              queryStruct.cargoName = ''
              queryStruct.uuid = ''
              fetchData()
            }
          "
        >
          <template #icon>
            <icon-refresh />
          </template>
          重置
        </a-button>
      </a-col>
    </a-row>
    <a-table :data="tableData" :columns="cargoColumns" :loading="tableLoading" :pagination="pagination" @page-change="onPageChange">
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
      <template #uuid="{ record }">
        <a-button
          @click="
            Modal.info({
              title: '货物唯一标识码',
              content: record.uuid,
            })
          "
        >
          查看
        </a-button>
      </template>
      <template #cargoType="{ record }">
        {{ cargoType[`cargoType.${record.cargoType}`] }}
      </template>
      <template #restTime="{ record }">{{ record.restTime.day }}天{{ record.restTime.hour }}小时</template>
      <template #isWaitingOut="{ record }">
        {{ record.isWaitingOut ? '是' : '否' }}
      </template>
      <template #location="{ record }">
        <template v-if="record.location">
          {{ record.location }}
        </template>
        <template v-else>
          <icon-question-circle-fill style="color: gray" />
          未知
        </template>
      </template>
      <!--      <template #operations="">-->
      <!--        <a-button :status="'warning'">-->
      <!--          <template #icon>-->
      <!--            <icon-check />-->
      <!--          </template>-->
      <!--          标记待出库-->
      <!--        </a-button>-->
      <!--      </template>-->
      <!--    <template #operations="{ record }">-->
      <!--    </template>-->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import { nextTick, reactive, ref } from 'vue'
import type { Pagination } from '@/types/global'
import { cargoQueryLocation, warehouseQueryAllCargo } from '@/api/list'
import cargoType from '@/api/enums/cargoType'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const queryStruct = reactive({
  uuid: '',
  cargoName: '',
  filterType: false,
})

const tableLoading = ref(true)

const tableData = reactive([])

const cargoColumns = [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '货物唯一标识码',
    dataIndex: 'uuid',
    slotName: 'uuid',
  },
  {
    title: '货物名称',
    dataIndex: 'cargoName',
  },
  {
    title: '货物类型',
    dataIndex: 'cargoType',
    slotName: 'cargoType',
  },
  {
    title: '重量(kg)',
    dataIndex: 'weight',
    slotName: 'weight',
  },
  {
    title: '入库操作者',
    dataIndex: 'enterMember',
  },
  {
    title: '入库时间',
    dataIndex: 'enterTime',
  },
  {
    title: '剩余存储时长',
    dataIndex: 'restTime',
    slotName: 'restTime',
  },
  {
    title: '等待出库',
    dataIndex: 'isWaitingOut',
    slotName: 'isWaitingOut',
  },
  {
    title: '存储位置',
    dataIndex: 'location',
    slotName: 'location',
  },
]

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})

const fetchData = async () => {
  tableLoading.value = true
  try {
    const params = {
      warehouseId: props.warehouseId,
      pageSize: pagination.pageSize,
      current: pagination.current,
      uuid: queryStruct.uuid,
      filterType: queryStruct.filterType,
      cargoName: queryStruct.cargoName,
    }
    const { data } = await warehouseQueryAllCargo(params)
    tableData.splice(0, tableData.length, ...data.list)
    pagination.total = data.total
  } catch {
    // 错误处理逻辑
    Message.error('error')
  } finally {
    await nextTick(() => {
      tableLoading.value = false
    })
  }
}

fetchData()

const onPageChange = (current: number) => {
  pagination.current = current
  fetchData()
}

const handleCargoLocQuery = async (cargoUUID: string) => {
  Message.info('查询中，请稍候...')
  tableLoading.value = true
  try {
    const { data } = await cargoQueryLocation({
      cargoUUID,
    })
    if (data.query_success) {
      Message.success('查询成功！')
      Modal.info({
        title: '货物位置查询结果',
        content: `该货物当前位于：${data.location.shelfLoc[0]}-${data.location.shelfLoc[1]}-${data.location.cargoLoc[0]}-${data.location.cargoLoc[1]}`,
      })
    } else {
      Message.warning('查询失败，货物可能已入库但不在货架上')
    }
  } catch {
    Message.error('查询失败！')
  } finally {
    tableLoading.value = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'StorageTotalView',
}
</script>

<style scoped lang="less"></style>
