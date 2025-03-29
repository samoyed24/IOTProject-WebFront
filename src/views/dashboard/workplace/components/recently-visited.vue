<template>
  <a-card
    class="general-card"
    :title="$t('workplace.recently.visited')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '26px' }"
  >
    <div style="margin-bottom: -1rem">
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
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { text: '库房管理', icon: 'icon-home', router: 'branchWarehouseTable' },
]

const handleRouterPush = (name: string) => {
  // alert(1)
  router.push({
    name,
  })
}
</script>

<style lang="less" scoped>
:deep(.arco-card-header-title) {
  line-height: inherit;
}
</style>
