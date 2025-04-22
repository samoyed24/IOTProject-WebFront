<template>
  <div class="container">
    <Breadcrumb :items="['货物管理', '货物溯源反馈']" />
    <a-card class="general-card" :title="'货物溯源反馈'">
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
                <a-form-item field="feedbackTime" label="反馈时间">
                  <a-range-picker v-model="formModel.feedbackTime" style="width: 100%" />
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
          <a-space></a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
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
        <template #resolved="{ record }">
          <template v-if="!record.resolved">
            <span class="circle bad" />
            否
          </template>
          <template v-else>
            <span class="circle pass" />
            是
          </template>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="handleViewDetail(record.id)">查看详情</a-button>
        </template>
      </a-table>
    </a-card>
    <feedback-detail v-if="detailId" :detail-id="detailId" @close-event="handleDetailClose" />
  </div>
</template>

<script lang="ts" setup>
import { getCustomerFeedback, type PolicyParams, type PolicyRecord } from '@/api/list'
import useLoading from '@/hooks/loading'
import { Message } from '@arco-design/web-vue'
import type { Pagination } from '@/types/global'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import FeedbackDetail from '@/views/list/branch-trace-feedback/components/feedback-detail.vue'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    uuid: '',
    feedbackTime: [] as string[],
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
    title: '反馈环节',
    dataIndex: 'part',
  },
  {
    title: '反馈时间',
    dataIndex: 'time',
  },
  {
    title: '已解决',
    dataIndex: 'resolved',
    slotName: 'resolved',
  },
  {
    title: '标记解决人员',
    dataIndex: 'resolvedBy',
  },
  {
    title: t('branchCargoList.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
])
const fetchData = async (params: PolicyParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await getCustomerFeedback(params)
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

const detailId = ref(null)

const handleViewDetail = (id: number) => {
  detailId.value = id
}

const handleDetailClose = (e: boolean) => {
  detailId.value = null
  if (e) {
    fetchData()
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
