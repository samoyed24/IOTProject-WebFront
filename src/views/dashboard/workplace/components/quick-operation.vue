<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
<!--    <template #extra>-->
<!--      <a-link>{{ $t('workplace.quickOperation.setup') }}</a-link>-->
<!--    </template>-->
    <a-row :gutter="8">
      <a-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
        <div class="icon" @click="handleRouterPush(link.router)">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text">
          {{ $t(link.text) }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  // { text: 'workplace.contentManagement', icon: 'icon-file' },
  // { text: 'workplace.contentStatistical', icon: 'icon-storage' },
  // { text: 'workplace.advanced', icon: 'icon-settings' },
  // { text: 'workplace.onlinePromotion', icon: 'icon-mobile' },
  // { text: 'workplace.contentPutIn', icon: 'icon-fire' },
  { text: '货物信息', icon: 'icon-list', router: 'branchCargoList' },
  { text: '设备管理', icon: 'icon-settings', router: 'branchDeviceTable' },
  { text: '分支员工', icon: 'icon-user', router: 'BranchEmployeeManagement' },
  { text: '库房管理', icon: 'icon-home', router: 'branchWarehouseTable' },
  { text: '订单管理', icon: 'icon-file', router: 'orderManagement' },
]

const handleRouterPush = (name: string) => {
  // alert(1)
  router.push({
    name,
  })
}
</script>

<style scoped lang="less"></style>
