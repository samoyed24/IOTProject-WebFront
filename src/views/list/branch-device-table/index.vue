<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.branchDeviceTable']" />
    <a-card class="general-card" :title="$t('menu.list.branchDeviceTable')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="number" :label="$t('branchDeviceTable.form.number')">
                  <a-input v-model="formModel.number" :placeholder="$t('branchDeviceTable.form.number.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('branchDeviceTable.form.name')">
                  <a-input v-model="formModel.name" :placeholder="$t('branchDeviceTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contentType" :label="$t('branchDeviceTable.form.contentType')">
                  <a-select
                    v-model="formModel.contentType"
                    :options="contentTypeOptions"
                    :placeholder="$t('branchDeviceTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="filterType" :label="$t('branchDeviceTable.form.filterType')">
                  <a-select
                    v-model="formModel.filterType"
                    :options="filterTypeOptions"
                    :placeholder="$t('branchDeviceTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createdTime" :label="$t('branchDeviceTable.form.createdTime')">
                  <a-range-picker v-model="formModel.createdTime" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('branchDeviceTable.form.status')">
                  <a-select v-model="formModel.status" :options="statusOptions" :placeholder="$t('branchDeviceTable.form.selectDefault')" />
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
              {{ $t('branchDeviceTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('branchDeviceTable.form.reset') }}
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
              {{ $t('branchDeviceTable.operation.create') }}
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('branchDeviceTable.operation.import') }}
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
            {{ $t('branchDeviceTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('branchDeviceTable.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('branchDeviceTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('branchDeviceTable.actions.columnSetting')">
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
        <template #deviceType="{ record }">
          {{ $t(`branchDeviceTable.form.deviceType.${record.deviceType}`) }}
        </template>
        <template #is_online="{ record }">
          <icon-check-circle-fill v-if="record.is_online" style="color: green" />
          <icon-close-circle-fill v-else style="color: red" />
          {{ $t(`branchDeviceTable.form.is_online.${record.is_online}`) }}
        </template>
        <template #is_warehouse_bound="{ record }">
          <icon-check-circle-fill v-if="record.is_warehouse_bound" style="color: green" />
          <icon-close-circle-fill v-else style="color: red" />
          {{ $t(`branchDeviceTable.form.is_warehouse_bound.${record.is_warehouse_bound}`) }}
        </template>
        <template #operations>
          <a-button v-permission="['admin']" type="text" size="small">
            {{ $t('branchDeviceTable.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { queryDevices, type PolicyParams, type PolicyRecord } from '@/api/list'
import useLoading from '@/hooks/loading'
import type { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    number: '',
    name: '',
    contentType: '',
    filterType: '',
    createdTime: [],
    status: '',
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
    name: t('branchDeviceTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('branchDeviceTable.size.small'),
    value: 'small',
  },
  {
    name: t('branchDeviceTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('branchDeviceTable.size.large'),
    value: 'large',
  },
])
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('branchDeviceTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('branchDeviceTable.columns.deviceId'),
    dataIndex: 'deviceId',
  },
  {
    title: t('branchDeviceTable.columns.deviceType'),
    dataIndex: 'deviceType',
    slotName: 'deviceType',
  },
  {
    title: t('branchDeviceTable.columns.is_online'),
    dataIndex: 'is_online',
    slotName: 'is_online'
  },
  {
    title: t('branchDeviceTable.columns.last_online'),
    dataIndex: 'last_online',
  },
  {
    title: t('branchDeviceTable.columns.register_time'),
    dataIndex: 'register_time',
  },
  {
    title: t('branchDeviceTable.columns.is_warehouse_bound'),
    dataIndex: 'is_warehouse_bound',
    slotName: 'is_warehouse_bound',
  },
  {
    title: t('branchDeviceTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
])
const contentTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('branchDeviceTable.form.contentType.img'),
    value: 'img',
  },
  {
    label: t('branchDeviceTable.form.contentType.horizontalVideo'),
    value: 'horizontalVideo',
  },
  {
    label: t('branchDeviceTable.form.contentType.verticalVideo'),
    value: 'verticalVideo',
  },
])
const filterTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('branchDeviceTable.form.filterType.artificial'),
    value: 'artificial',
  },
  {
    label: t('branchDeviceTable.form.filterType.rules'),
    value: 'rules',
  },
])
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('branchDeviceTable.form.status.online'),
    value: 'online',
  },
  {
    label: t('branchDeviceTable.form.status.offline'),
    value: 'offline',
  },
])
const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await queryDevices(params)
    renderData.value = data.list
    pagination.current = params.current
    pagination.total = data.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

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
