<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '0' }" :body-style="{ padding: '17px 20px 21px 20px' }">
      <template #title>
        库存货物统计
      </template>
<!--      <template #extra>-->
<!--        <a-link>{{ $t('workplace.viewMore') }}</a-link>-->
<!--      </template>-->
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group v-model:model-value="type" type="button" @change="typeChange as any">
          <a-radio value="vegetable">
            果蔬
          </a-radio>
          <a-radio value="meat">
            肉类
          </a-radio>
          <a-radio value="snack">
            冷藏零食
          </a-radio>
          <a-radio value="medicine">
            医药用品
          </a-radio>
          <a-radio value="other">
            其他
          </a-radio>
        </a-radio-group>
        <a-table :data="renderList" :pagination="false" :bordered="false" :scroll="{ x: '100%', y: '264px' }">
          <template #columns>
            <a-table-column title="名称" data-index="name"></a-table-column>
            <a-table-column title="总录入" data-index="totalCreate">
<!--              <template #cell="{ record }">-->
<!--                <a-typography-paragraph-->
<!--                  :ellipsis="{-->
<!--                    rows: 1,-->
<!--                  }"-->
<!--                >-->
<!--                  {{ record.title }}-->
<!--                </a-typography-paragraph>-->
<!--              </template>-->
            </a-table-column>
            <a-table-column title="当前库存" data-index="currentStorage"></a-table-column>
            <a-table-column title="保质期(天)" data-index="period"></a-table-column>
<!--            <a-table-column-->
<!--              title="日涨幅"-->
<!--              data-index="increases"-->
<!--              :sortable="{-->
<!--                sortDirections: ['ascend', 'descend'],-->
<!--              }"-->
<!--            >-->
<!--              <template #cell="{ record }">-->
<!--                <div class="increases-cell">-->
<!--                  <span>{{ record.increases }}%</span>-->
<!--                  <icon-caret-up v-if="record.increases !== 0" style="color: #f53f3f; font-size: 8px" />-->
<!--                </div>-->
<!--              </template>-->
<!--            </a-table-column>-->
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useLoading from '@/hooks/loading'
import {branchTemplateCategoryStatistics, queryPopularList} from '@/api/dashboard'
import type { TableData } from '@arco-design/web-vue/es/table/interface'

const type = ref('text')
const { loading, setLoading } = useLoading()
const renderList = ref<TableData[]>()
const fetchData = async (contentType: string) => {
  try {
    setLoading(true)
    const { data } = await branchTemplateCategoryStatistics({ queryType: contentType })
    renderList.value = data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const typeChange = (contentType: string) => {
  fetchData(contentType)
}
// fetchData('text')
</script>

<style scoped lang="less">
.general-card {
  min-height: 395px;
}
:deep(.arco-table-tr) {
  height: 44px;
  .arco-typography {
    margin-bottom: 0;
  }
}
.increases-cell {
  display: flex;
  align-items: center;
  span {
    margin-right: 4px;
  }
}
</style>
