<template>
  <div class="container">
    <Breadcrumb :items="['订单管理', '订单管理']" />
    <a-card class="general-card" title="订单管理">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="id" label="仓库ID">
                  <a-input-number v-model="formModel.id" placeholder="请输入仓库ID" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" label="仓库名称">
                  <a-input v-model="formModel.name" placeholder="请输入仓库名称" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="fetchData">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space></a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-tooltip content="刷新">
            <div class="action-icon" @click="fetchData"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip content="列密度">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-table :data="tableData" :columns="cargoColumns" :loading="tableLoading" :pagination="pagination" @page-change="onPageChange">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #isIn="{ record }">
          <div v-if="record.isIn">
            <span class="circle pass" />
            入库
          </div>
          <div v-else>
            <span class="circle bad" />
            出库
          </div>
        </template>
        <template #orderComplete="{ record }">
          <div v-if="record.cargoCount == record.doneCount">
            <span class="circle pass" />
            已完成
          </div>
          <div v-else>
            <span class="circle bad" />
            未完成
          </div>
        </template>
        <template #doneTime="{ record }">
          <span v-if="record.doneTime">{{ record.doneTime }}</span>
          <span v-else>未完成</span>
        </template>
        <template #operations="{ record }">
          <!--      <template #operations>-->
          <a-button @click="handleViewDetails(record)">查看详情</a-button>
          <a-button @click="Message.warning('TODO 待实现')">打印订单</a-button>
        </template>
      </a-table>
      <order-details v-if="detailSelect != -1" :order-id="detailSelect" @close-event="detailSelect = -1"></order-details>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { type Pagination } from '@/types/global'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import OrderDetails from '@/views/order/order-management/order-details/order-details.vue'
import { branchGetAllOrders } from '@/api/list'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'

const generateFormModel = () => {
  return {
    id: '',
    name: '',
  }
}

const onPageChange = (current: number) => {
  pagination.current = current
  fetchData()
}

const { t } = useI18n()
const formModel = ref(generateFormModel())

const size = ref<SizeProps>('medium')

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})
const densityList = computed(() => [
  {
    name: t('branchWarehouseTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('branchWarehouseTable.size.small'),
    value: 'small',
  },
  {
    name: t('branchWarehouseTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('branchWarehouseTable.size.large'),
    value: 'large',
  },
])

const cargoColumns = [
  {
    title: '订单编号',
    dataIndex: 'orderId',
  },
  {
    title: '库房名称',
    dataIndex: 'warehouseName',
  },
  {
    title: '下单操作者',
    dataIndex: 'createdBy',
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
  },
  {
    title: '订单货物总数',
    dataIndex: 'cargoCount',
  },
  {
    title: '出货货物数量',
    dataIndex: 'doneCount',
  },
  {
    title: '订单是否完成',
    slotName: 'orderComplete',
  },
  {
    title: '订单完成时间',
    dataIndex: 'doneTime',
    slotName: 'doneTime',
  },
  {
    title: '操作',
    slotName: 'operations',
  },
]

const reset = () => {
  formModel.value = generateFormModel()
  fetchData()
}

const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}

const tableLoading = ref(true)
const tableData = reactive([])

const fetchData = async () => {
  tableLoading.value = true
  try {
    const { data } = await branchGetAllOrders({
      current: pagination.current,
      pageSize: pagination.pageSize,
      warehouseId: formModel.value.id,
      warehouseName: formModel.value.name,
    })
    tableData.splice(0, tableData.length, ...data.list)
    pagination.total = data.total
  } catch (err) {
    Message.error('请求失败')
    throw err
  } finally {
    tableLoading.value = false
  }
}

fetchData()

const detailSelect = ref(-1)

const handleViewDetails = (record: any) => {
  detailSelect.value = record.orderId
}
</script>

<script lang="ts">
export default {
  name: 'SearchTable',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
