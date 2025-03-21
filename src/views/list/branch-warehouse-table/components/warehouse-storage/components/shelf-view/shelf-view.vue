<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="20">
        <a-form-item label="货架监控设备" required>
          <a-select :options="shelfOptions" :loading="selectLoading" @change="fetchShelfCargo" />
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-button long :disabled="!selectedShelf.shelfId" @click="fetchShelfCargo">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
      </a-col>
    </a-row>
    <a-spin v-if="selectedShelf.shelfId" :loading="shelfDataLoading" style="width: 100%">
      <a-row v-for="(row, rowIndex) in shelfCargoData" :key="rowIndex" :gutter="[30, 20]">
        <a-col v-for="(item, colIndex) in row" :key="colIndex" :span="12">
          <!--          {{ item }}-->
          <a-button v-if="item" status="success" long @click="handleCargoQuery(item)">
            <template #icon>
              <icon-search />
            </template>
            查看货物信息
          </a-button>
          <a-button v-else disabled long>
            <template #icon>
              <icon-stop />
            </template>
            此栏位无货物
          </a-button>
        </a-col>
      </a-row>
    </a-spin>
    <a-empty v-else />
    <a-modal :visible="cargoModalVisible" title="货物详情" @close="handleModalClose" @cancel="handleModalClose" @ok="handleModalClose">
      <a-form :model="cargoDetails">
        <a-form-item field="uuid" label="唯一标识码">
          <a-input :model-value="cargoDetails.uuid" />
        </a-form-item>
        <a-form-item field="cargoName" label="货物名称">
          <a-input :model-value="cargoDetails.cargoName" />
        </a-form-item>
        <a-form-item field="cargoName" label="货物类型">
          <a-input :model-value="cargoType[`cargoType.${cargoDetails.cargoType}`]" />
        </a-form-item>
        <a-form-item field="weight" label="重量">
          <a-input-number :model-value="cargoDetails.weight" disabled>
            <template #suffix>kg</template>
          </a-input-number>
        </a-form-item>
        <a-form-item field="enterMember" label="录入者">
          <a-input :model-value="cargoDetails.enterMember" />
        </a-form-item>
        <a-form-item field="restTime" label="剩余储存时长">
          <a-input :model-value="`${cargoDetails.restTime.day}天${cargoDetails.restTime.hour}小时`" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { reactive, ref } from 'vue'
import { warehouseGetCargo, warehouseQueryAllShelves, warehouseShelfQueryCargo } from '@/api/list'
import type { ShelfData } from '@/api/list'
import cargoType from '@/api/enums/cargoType'

const props = defineProps({
  warehouseId: {
    type: Number,
  },
})

const selectLoading = ref(true)
const shelfOptions = reactive([])
const selectedShelf: any = reactive({})

const getShelves = (shelvesData: Array<ShelfData>) => {
  const formattedData = []
  shelvesData.forEach((sh: ShelfData) => {
    formattedData.push({
      label: `货架${sh.locRow}-${sh.locCol} (${sh.shelfRow}行,${sh.shelfCol}列)`,
      value: {
        deviceId: sh.deviceId,
        shelfRow: sh.shelfRow,
        shelfCol: sh.shelfCol,
        shelfId: sh.shelfId,
      },
    })
  })
  return formattedData
}

const fetchData = async () => {
  selectLoading.value = true
  try {
    const { data } = await warehouseQueryAllShelves({
      warehouseId: props.warehouseId,
    })
    const formattedData = getShelves(data)
    shelfOptions.splice(0, shelfOptions.length, ...formattedData)
  } catch {
    // TODO
  } finally {
    selectLoading.value = false
  }
}

fetchData()

const shelfCargoData = reactive([])

const fetchShelfCargo = async (shelf: ShelfData | null) => {
  if (shelf) Object.assign(selectedShelf, shelf)
  shelfDataLoading.value = false
  const shelfId = shelf.deviceId ? shelf.shelfId : selectedShelf.shelfId
  // console.log(selectedShelf)
  try {
    const { data } = await warehouseShelfQueryCargo({
      shelfId,
    })
    Object.assign(shelfCargoData, data)
  } catch (err) {
    Message.error(err)
  } finally {
    selectLoading.value = false
  }
}

const cargoModalVisible = ref(false)
const cargoDetails = reactive({
  uuid: '',
  cargoName: '',
  cargoType: '',
  weight: null,
  enterMember: '',
  restTime: {
    day: null,
    hour: null,
  },
})

const handleCargoQuery = async (cargoUUID) => {
  Message.info('正在查询中，请稍候...')
  shelfDataLoading.value = true
  try {
    const { data } = await warehouseGetCargo({
      cargoUUID,
    })
    Object.assign(cargoDetails, data)
    Message.success('查询成功！')
    cargoModalVisible.value = true
  } catch {
    //
  } finally {
    shelfDataLoading.value = false
  }
}

const handleModalClose = () => {
  cargoModalVisible.value = false
}

const shelfDataLoading = ref(true)
</script>

<script lang="ts">
export default {
  name: 'ShelfView',
}
</script>

<style scoped lang="less"></style>
