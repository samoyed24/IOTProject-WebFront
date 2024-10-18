<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.employeeCheckTable']" />
    <a-card class="general-card" :title="$t('menu.list.employeeCheckTable')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="number" :label="$t('employeeCheckTable.form.number')">
                  <a-input v-model="formModel.number" :placeholder="$t('employeeCheckTable.form.number.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('employeeCheckTable.form.name')">
                  <a-input v-model="formModel.name" :placeholder="$t('employeeCheckTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contentType" :label="$t('employeeCheckTable.form.contentType')">
                  <a-select
                    v-model="formModel.contentType"
                    :options="contentTypeOptions"
                    :placeholder="$t('employeeCheckTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createdTime" :label="$t('employeeCheckTable.form.createdTime')">
                  <a-range-picker v-model="formModel.createdTime" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('employeeCheckTable.form.status')">
                  <a-select v-model="formModel.status" :options="statusOptions" :placeholder="$t('employeeCheckTable.form.selectDefault')" />
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
              {{ $t('employeeCheckTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('employeeCheckTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('employeeCheckTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('employeeCheckTable.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('employeeCheckTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('employeeCheckTable.actions.columnSetting')">
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
        <template #contentType="{ record }">
          <a-space>
            {{ $t(`employeeCheckTable.form.contentType.${record.contentType}`) }}
          </a-space>
        </template>
        <template #status="{ record }">
          <span v-if="record.status === '优良'" class="circle pass"></span>
          <span v-else-if="record.status === '一般'" class="circle medium"></span>
          <span v-else class="circle bad"></span>
          {{ $t(`employeeCheckTable.form.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="handleDrawerChange(true, record)">
            {{ $t('employeeCheckTable.columns.operations.view') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-drawer
        :visible="recordDetailsShow"
        @cancel="handleDrawerChange(false)"
        hide-cancel
        @ok="handleDrawerChange(false)"
        @open="handleDetailsUpdate"
        width="30%"
    >
      <a-spin :loading="drawerLoading">
        <a-descriptions :data="detailData" title="质量检测报告" :column="1">
        </a-descriptions>
        <a-button v-if="selectedDetail.quality_level != '优良'" @click="handleShowImg(true)">
          显示图片
        </a-button>
      </a-spin>
      <a-drawer
          :visible="showImg"
          @cancel="handleShowImg(false)"
          @ok="handleShowImg(false)"
          width="50%"
      >
        <a-spin :loading="imgLoading">
          <a-image :src="detailImgSrc" width="100%"/>
        </a-spin>
      </a-drawer>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { type PolicyParams, type PolicyRecord, getRecordDetails, queryPolicyList } from '@/api/list'
import useLoading from '@/hooks/loading'
import type { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useRouter } from 'vue-router'

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

// const router = useRouter()

const size = ref<SizeProps>('medium')


const detailData = ref<Array<any>>([])
const recordId = ref(-1)
const recordDetailsShow = ref(false)
const drawerLoading = ref(false)

interface CargoQualityRecords {
  id: number,
  cargo_name: string,
  quality_level: string,
  recorded_by: string,
  record_time: string,
  note:string
}
const selectedDetail = ref<CargoQualityRecords>({
  id: 0,
  cargo_name: '',
  quality_level: '',
  recorded_by: '',
  record_time: '',
  note: ''
})


const detailImgSrc = ref("")
const showImg = ref(false)
const imgLoading = ref(false)


const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
}
const pagination = reactive({
  ...basePagination,
})
const densityList = computed(() => [
  {
    name: t('employeeCheckTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('employeeCheckTable.size.small'),
    value: 'small',
  },
  {
    name: t('employeeCheckTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('employeeCheckTable.size.large'),
    value: 'large',
  },
])
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('employeeCheckTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('employeeCheckTable.columns.number'),
    dataIndex: 'number',
  },
  {
    title: t('employeeCheckTable.columns.name'),
    dataIndex: 'name',
  },
  {
    title: t('employeeCheckTable.columns.contentType'),
    dataIndex: 'contentType',
    slotName: 'contentType',
  },
  {
    title: t('employeeCheckTable.columns.createdTime'),
    dataIndex: 'createdTime',
  },
  {
    title: t('employeeCheckTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: t('employeeCheckTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
])
const contentTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('employeeCheckTable.form.contentType.vegetable'),
    value: 'vegetable',
  },
  {
    label: t('employeeCheckTable.form.contentType.meat'),
    value: 'meat',
  },
  {
    label: t('employeeCheckTable.form.contentType.medicine'),
    value: 'medicine',
  },
])
const filterTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('employeeCheckTable.form.filterType.artificial'),
    value: 'artificial',
  },
  {
    label: t('employeeCheckTable.form.filterType.rules'),
    value: 'rules',
  },
])
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('employeeCheckTable.form.status.优良'),
    value: '优良'
  },
  {
    label: t('employeeCheckTable.form.status.一般'),
    value: '一般',
  },
  {
    label: t('employeeCheckTable.form.status.不合格'),
    value: "不合格"
  }
])
const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await queryPolicyList(params)
    renderData.value = data.list
    pagination.current = params.current
    pagination.total = data.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const handleShowImg = (imgShowStatus: boolean) => {
  showImg.value = imgShowStatus
  if (imgShowStatus) detailImgSrc.value = `dev-api/bind/get-record-image?recordId=${recordId.value}`
  else detailImgSrc.value = ""
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
    cloneColumns.value = showColumns.value.filter((item) => item.checked)
}

const handleDrawerChange = (showStatus: boolean, _record: number | null | undefined = null) => {
  recordDetailsShow.value = showStatus
  if (_record)
    recordId.value = _record
  if (!showStatus)
    detailData.value = []
}

const handleDetailsUpdate = async () => {
  drawerLoading.value = true
  detailData.value = []
  let data: any = await getRecordDetails({recordId: recordId.value})
  data = data.data
  selectedDetail.value = data
  const tagMapping: Record<string, string> = {
    "id": "ID",
    "cargo_name": "货物名称",
    "quality_level": "质量等级",
    "weight": "重量",
    "recorded_by": "记录者",
    "record_time": "记录时间",
    "note": "备注"
  }
  Object.keys(data).forEach((k) => {
    detailData.value.push({
      label: tagMapping[k],
      value: data[k]
    })
  })
  // console.log(detailData.value)
  drawerLoading.value = false
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
  name: 'EmployeeCheckTable'
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
