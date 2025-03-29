<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="8">
      <a-space>
<!--        <icon-common :size="50"></icon-common>-->
        <!--        <a-avatar :size="54" class="col-avatar">-->
        <!--          <img-->
        <!--            alt="avatar"-->
        <!--            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"-->
        <!--          />-->
        <!--        </a-avatar>-->
        <a-statistic :title="$t('workplace.cargoTotal')" :value="statistics.totalCount" :value-from="0" animation show-group-separator>
          <template #suffix>
            <!--            W+-->
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8">
      <a-space>
<!--        <icon-thunderbolt :size="50"></icon-thunderbolt>-->
        <!--        <a-avatar :size="54" class="col-avatar">-->
        <!--          <img-->
        <!--            alt="avatar"-->
        <!--            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"-->
        <!--          />-->
        <!--        </a-avatar>-->
        <a-statistic :title="$t('workplace.cargo24Hours')" :value="statistics.hour24Count" :value-from="0" animation show-group-separator>
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8">
      <a-space>
        <a-statistic title="在库货物数量" :value="statistics.inWareCount" :value-from="0" animation show-group-separator>
          <template #suffix>
            <span class="unit">{{ $t('workplace.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <!--        <a-avatar :size="54" class="col-avatar">-->
        <!--          <img-->
        <!--            alt="avatar"-->
        <!--            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"-->
        <!--          />-->
        <!--        </a-avatar>-->
        <a-statistic title="24小时入库货物" :value="statistics.inWare24Count" :value-from="0" animation>
          <template #suffix>
            个
            <!--            <icon-caret-up class="up-icon" />-->
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <a-statistic title="24小时出库货物" :value="statistics.outWare24Count" :value-from="0" animation>
          <template #suffix>件</template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <a-statistic title="待处理订单数" :value="statistics.waitingOrderCount" :value-from="0" animation>
          <template #suffix>个</template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <a-statistic title="临近到期货物(3天)" :value="statistics.cargoSpoilCount" :value-from="0" animation>
          <template #suffix>
            件
            <icon-exclamation-circle-fill v-if="statistics.cargoSpoilCount > 0" style="color: orange" />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <a-statistic title="库存较昨日变化" :value="statistics.storageChangeCompareYesterday" :precision="1" :value-from="0" animation>
          <template #suffix>
            %
            <icon-caret-up v-if="statistics.storageChangeCompareYesterday > 0" class="up-icon" />
            <icon-minus v-else-if="statistics.storageChangeCompareYesterday === 0" style="color: gray" />
            <icon-minus v-else style="color: forestgreen" />

          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="8" style="border-right: none">
      <a-space>
        <a-statistic title="24小时警告以上事件总数" :value="statistics.event24Count" :value-from="0" animation>
          <template #suffix>
            个
            <icon-exclamation-circle-fill v-if="statistics.event24Count > 0" style="color: orange" />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import { type BranchBasicStatistics, queryBranchBasicStatistics } from '@/api/dashboard'
import { ref } from 'vue'

const statistics = ref<BranchBasicStatistics>({
  totalCount: 0,
  hour24Count: 0,
  inWareCount: 0,
  inWare24Count: 0,
  outWare24Count: 0,
  waitingOrderCount: 0,
  cargoSpoilCount: 0,
  storageChangeCompareYesterday: 0,
  event24Count: 0,
})

const fetchData = async () => {
  const data = await queryBranchBasicStatistics()
  statistics.value = data.data
}

fetchData()
</script>

<style lang="less" scoped>
.arco-grid.panel {
  margin-bottom: 0;
  padding: 16px 20px 0 20px;
}
.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}
.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}
.up-icon {
  color: rgb(var(--red-6));
}
.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}
:deep(.panel-border) {
  margin: 4px 0 0 0;
}
</style>
