<template>
  <div class="container">
    <Breadcrumb :items="['货物管理', '货物录入信息']" />
    <a-card class="general-card" :title="'货物录入信息'">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="uuid" :label="$t('branchCargoList.form.uuid')">
                  <a-input v-model="formModel.uuid" :placeholder="$t('branchCargoList.form.uuid.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" :label="$t('branchCargoList.form.name')">
                  <a-input v-model="formModel.name" :placeholder="$t('branchCargoList.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contentType" :label="$t('branchCargoList.form.type')">
                  <a-select v-model="formModel.type" :options="typeOptions" :placeholder="$t('branchCargoList.form.selectDefault')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="recorded_time" :label="$t('branchCargoList.form.recorded_time')">
                  <a-range-picker v-model="formModel.record_time" style="width: 100%" />
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
              {{ $t('branchCargoList.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('branchCargoList.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <!--            <a-button type="primary">-->
            <!--              <template #icon>-->
            <!--                <icon-plus />-->
            <!--              </template>-->
            <!--              {{ $t('branchCargoList.operation.create') }}-->
            <!--            </a-button>-->
            <!--            <a-upload action="/">-->
            <!--              <template #upload-button>-->
            <!--                <a-button>-->
            <!--                  {{ $t('branchCargoList.operation.import') }}-->
            <!--                </a-button>-->
            <!--              </template>-->
            <!--            </a-upload>-->
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <!--          <a-button>-->
          <!--            <template #icon>-->
          <!--              <icon-download />-->
          <!--            </template>-->
          <!--            {{ $t('branchCargoList.operation.download') }}-->
          <!--          </a-button>-->
          <a-tooltip :content="$t('branchCargoList.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('branchCargoList.actions.density')">
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
        <template #type="{ record }">
          <a-space>
            {{ cargoType[`cargoType.${record.type}`] }}
          </a-space>
        </template>
        <template #filterType="{ record }">
          {{ $t(`branchCargoList.form.type.${record.type}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`branchCargoList.form.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="handleViewRouter(record.uuid)">
            {{ $t('branchCargoList.columns.operations.view') }}
          </a-button>
          <a-button type="text" size="small" @click="handleQRCode(record.uuid)">生成溯源码</a-button>
        </template>
      </a-table>
    </a-card>
    <q-r-code-comp v-if="qrcodeUUID" :cargo-uuid="qrcodeUUID" @close-event="handleQRCodeClose" />
  </div>
</template>

<script lang="ts" setup>
import { type PolicyParams, type PolicyRecord, queryBranchCargoList } from '@/api/list'
import useLoading from '@/hooks/loading'
import { Message } from '@arco-design/web-vue'
import type { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import QRCodeComp from '@/views/list/branch-cargo-list/components/qrcode-comp.vue'
import cargoType from '../../../api/enums/cargoType'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    name: '',
    record_time: [] as string[],
    type: '',
    uuid: '',
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
    name: t('branchCargoList.size.mini'),
    value: 'mini',
  },
  {
    name: t('branchCargoList.size.small'),
    value: 'small',
  },
  {
    name: t('branchCargoList.size.medium'),
    value: 'medium',
  },
  {
    name: t('branchCargoList.size.large'),
    value: 'large',
  },
])
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('branchCargoList.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('branchCargoList.columns.uuid'),
    dataIndex: 'uuid',
  },
  {
    title: t('branchCargoList.columns.name'),
    dataIndex: 'name',
  },
  {
    title: t('branchCargoList.columns.type'),
    dataIndex: 'type',
    slotName: 'type',
  },
  {
    title: t('branchCargoList.columns.weight'),
    dataIndex: 'weight',
  },
  {
    title: t('branchCargoList.columns.record_time'),
    dataIndex: 'record_time',
  },
  {
    title: t('branchCargoList.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
])
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('branchCargoList.form.type.vegetable'),
    value: 'vegetable',
  },
  {
    label: t('branchCargoList.form.type.meat'),
    value: 'meat',
  },
])
const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await queryBranchCargoList(params)
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
const router = useRouter()

const handleViewRouter = (uuid: string) => {
  router.push({
    name: 'cargoQuery',
    query: {
      uuid,
    },
  })
}

const qrcodeUUID = ref(null)

const handleQRCode = (uuid: string) => {
  qrcodeUUID.value = uuid
}

const handleQRCodeClose = () => {
  qrcodeUUID.value = null
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
