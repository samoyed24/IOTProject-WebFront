<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.branchWarehouseTable']" />
    <a-card class="general-card" :title="$t('menu.list.branchWarehouseTable')">
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
              <a-col :span="8">
                <a-form-item field="storage" label="存货量">
                  <a-input-number v-model="formModel.storage" placeholder="请输入仓库存货量" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="temperature" label="温度">
                  <a-form-item field="lower" label="下限">
                    <a-input-number v-model="formModel.temperature_lower" placeholder="请输入温度下限" />
                  </a-form-item>
                  <a-form-item field="upper" label="上限">
                    <a-input-number v-model="formModel.temperature_upper" placeholder="请输入温度上限" />
                  </a-form-item>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="humidity" label="湿度">
                  <a-form-item field="lower" label="下限">
                    <a-input-number v-model="formModel.humidity_lower" placeholder="请输入湿度下限" />
                  </a-form-item>
                  <a-form-item field="upper" label="上限">
                    <a-input-number v-model="formModel.humidity_upper" placeholder="请输入湿度上限" />
                  </a-form-item>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('branchWarehouseTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('branchWarehouseTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('branchWarehouseTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('branchWarehouseTable.operation.import') }}
                </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('branchWarehouseTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('branchWarehouseTable.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('branchWarehouseTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('branchWarehouseTable.actions.columnSetting')">
            <a-popover trigger="click" position="bl" @popup-visible-change="popupVisibleChange">
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox v-model="item.checked" @change="handleChange($event, item as TableColumnData, index)"></a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns as TableColumnData[]"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #temperature="{ record }">
          <template v-if="record.temperature_pivot">{{ record.temperature_pivot }} °C</template>
          <template v-else>未设置</template>
        </template>
        <template #humidity="{ record }">
          <template v-if="record.humidity.lower">{{ record.humidity.lower }} ~ {{ record.humidity.upper }}</template>
          <template v-else>未设置</template>
        </template>
        <template #operations="{ record }">
          <a-button type="primary" size="small" @click="handleWarehouseSetting(record.id, record.name, 4)">
            控制面板
          </a-button>
          <a-button type="primary" status="success" size="small" @click="handleWarehouseSetting(record.id, record.name, 2)">
            {{ $t('branchWarehouseTable.columns.operations.monitor') }}
          </a-button>
          <a-button type="secondary" status="success" size="small">
            {{ $t('branchWarehouseTable.columns.operations.storage') }}
          </a-button>
          <a-button type="secondary" status="success" size="small" @click="handleWarehouseSetting(record.id, record.name, 1)">
            {{ $t('branchWarehouseTable.columns.operations.setting') }}
          </a-button>
          <a-button
            v-permission="['branch-admin']"
            type="secondary"
            status="warning"
            size="small"
            @click="handleWarehouseSetting(record.id, record.name, 3)"
          >
            管理人员设置
          </a-button>
        </template>
      </a-table>
    </a-card>
    <warehouse-setting v-if="drawerKey === 1" :warehouse-props="drawerCompProps" @close-event="drawerKey = 0" />
    <warehouse-monitor v-if="drawerKey === 2" :warehouse-props="drawerCompProps" @close-event="drawerKey = 0" />
    <warehouse-admin-setting v-if="drawerKey === 3" :warehouse-props="drawerCompProps" @close-event="drawerKey = 0" />
    <control-panel v-if="drawerKey === 4" :warehouse-props="drawerCompProps" @close-event="drawerKey = 0" />
  </div>
</template>

<script lang="ts" setup>
import { queryWarehouses, type PolicyParams, type PolicyRecord } from '@/api/list'
import useLoading from '@/hooks/loading'
import { type Pagination } from '@/types/global'
import WarehouseMonitor from '@/views/list/branch-warehouse-table/components/warehouse-monitor/warehouse-monitor.vue'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import ControlPanel from '@/views/list/branch-warehouse-table/components/control-panel/index.vue'
import WarehouseAdminSetting from '@/views/list/branch-warehouse-table/components/warehouse-admin-setting.vue'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import WarehouseSetting from './components/warehouse-setting/warehouse-setting.vue'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    id: null as number,
    name: '',
    storage: null as number,
    temperature_lower: null as number,
    temperature_upper: null as number,
    humidity_lower: null as number,
    humidity_upper: null as number,
  }
}
const { loading, setLoading } = useLoading(true)
const { t } = useI18n()
const renderData = ref<PolicyRecord[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])

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
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('branchWarehouseTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('branchWarehouseTable.columns.id'),
    dataIndex: 'id',
  },
  {
    title: t('branchWarehouseTable.columns.name'),
    dataIndex: 'name',
  },
  {
    title: '温度基准',
    dataIndex: 'temperature',
    slotName: 'temperature',
  },
  {
    title: t('branchWarehouseTable.columns.humidity'),
    dataIndex: 'humidity',
    slotName: 'humidity',
  },
  {
    title: t('branchWarehouseTable.columns.storage'),
    dataIndex: 'storage',
  },
  {
    title: t('branchWarehouseTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
])
const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await queryWarehouses(params)
    renderData.value = data.list
    pagination.current = params.current
    pagination.total = data.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const drawerCompProps = ref({
  warehouseId: -1,
  warehouseName: '',
})

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as PolicyParams)
}
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current })
}

fetchData()
const reset = () => {
  formModel.value = generateFormModel()
}

const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}

const handleChange = (checked: boolean | (string | boolean | number)[], column: Column, index: number) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex)
  } else {
    cloneColumns.value.splice(index, 0, column)
  }
}

const exchangeArray = <T extends Array<any>>(array: T, beforeIdx: number, newIdx: number, isDeep = false): T => {
  const newArray = isDeep ? cloneDeep(array) : array
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop())
  }
  return newArray
}

const child = ref()
const drawerKey = ref(0)

const handleWarehouseSetting = (warehouseId: number, warehouseName: string, showDrawer: number) => {
  // console.log(1)
  drawerKey.value = showDrawer
  drawerCompProps.value = {
    warehouseId,
    warehouseName,
  }
}

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e
          exchangeArray(cloneColumns.value, oldIndex, newIndex)
          exchangeArray(showColumns.value, oldIndex, newIndex)
        },
      })
    })
  }
}

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val)
    cloneColumns.value.forEach((item, index) => {
      item.checked = true
    })
    showColumns.value = cloneDeep(cloneColumns.value)
  },
  { deep: true, immediate: true }
)
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
