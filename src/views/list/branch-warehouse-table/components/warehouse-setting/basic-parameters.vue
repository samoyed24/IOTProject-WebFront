<template>
  <a-spin :loading="formLoading" style="width: 100%">
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="name"
        :label="$t('branchWarehouseTable.columns.name')"
        :rules="[
          {
            required: true,
            message: '请填写仓库名称',
          },
          {
            match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}$/,
            message: '请填写仓库名称，50字以内',
          },
        ]"
      >
        <a-input v-model="form.name" placeholder="请输入仓库名称，50字以内"></a-input>
      </a-form-item>
      <a-form-item field="temperature" :label="$t('branchWarehouseTable.columns.temperature')" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item field="temperature.lower" label="下限" :rules="[{ required: true, message: '请输入温度下限' }]">
            <a-input-number
              v-model="form.temperature.lower"
              :precision="1"
              :step="0.5"
              :min="-30"
              :max="form.temperature.upper ? form.temperature.upper : 100"
              placeholder="温度下限，30~100"
              @update:model-value="handleLimitChange"
            >
              <template #suffix>°C</template>
            </a-input-number>
          </a-form-item>
          <a-form-item field="temperature.upper" label="上限" :rules="[{ required: true, message: '请输入温度上限' }]">
            <a-input-number
              v-model="form.temperature.upper"
              :precision="1"
              :step="0.5"
              :min="form.temperature.lower ? form.temperature.lower : -30"
              :max="100"
              placeholder="温度上限，30~100"
              @update:model-value="handleLimitChange"
            >
              <template #suffix>°C</template>
            </a-input-number>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="humid" :label="$t('branchWarehouseTable.columns.humidity')" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" fill>
          <a-form-item field="humidity.lower" label="下限" :rules="[{ required: true, message: '请输入湿度下限' }]">
            <a-input-number
              v-model="form.humidity.lower"
              :precision="3"
              :step="0.01"
              :min="0.0"
              :max="form.humidity.upper ? form.humidity.upper : 1.0"
              placeholder="湿度下限，0.000~1.000"
              @update:model-value="handleLimitChange"
            >
              <!--              <template #suffix>%</template>-->
            </a-input-number>
          </a-form-item>
          <a-form-item field="humidity.upper" label="上限" :rules="[{ required: true, message: '请输入湿度上限' }]">
            <a-input-number
              v-model="form.humidity.upper"
              :precision="3"
              :step="0.01"
              :min="form.humidity.lower ? form.humidity.lower : 0.0"
              :max="1.0"
              placeholder="湿度上限，0.000~1.000"
              @update:model-value="handleLimitChange"
            ></a-input-number>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="extraOptions.isEnabled" label="开启预警事件">
        <template #help>
          <icon-info-circle-fill />
          修改仓库的温湿度阈值后，预警事件数据将会重置，请在仓库全局温湿度阈值配置完成后配置此部分。
        </template>
        <a-switch v-model="form.extraOptions.isEnabled"></a-switch>
      </a-form-item>
      <a-space v-if="form.extraOptions.isEnabled" direction="vertical" fill>
        <a-form-item field="extraOptions.reminderEvent.enable">
          <template #help>
            <icon-info-circle-fill />
            温湿度超出阈值时，将会发出提醒级别的预警事件，此事件将以站内信的方式通知仓库管理人员。
          </template>
          <template #label>
            <icon-exclamation-circle-fill />
            开启提醒预警事件
          </template>
          <a-switch v-model="form.extraOptions.reminderEvent.enable"></a-switch>
        </a-form-item>
        <a-space v-if="form.extraOptions.reminderEvent.enable" direction="vertical" fill>
          <a-form-item field="extraOptions.reminderEvent.temperature.enable" label="温度预警">
            <a-switch v-model="form.extraOptions.reminderEvent.temperature.enable"></a-switch>
          </a-form-item>
          <a-space v-if="form.extraOptions.reminderEvent.temperature.enable" direction="vertical" fill>
            <a-form-item field="extraOptions.reminderEvent.temperature" label="温度" :content-flex="false" :merge-props="false">
              <a-space direction="vertical" fill>
                <a-form-item
                  field="extraOptions.reminderEvent.temperature.lower"
                  label="下限"
                  :rules="[{ required: true, message: '请输入温度下限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.reminderEvent.temperature.lower"
                    :precision="1"
                    :step="0.5"
                    :min="form.temperature.lower"
                    :max="
                      form.extraOptions.reminderEvent.temperature.upper
                        ? form.extraOptions.reminderEvent.temperature.upper
                        : form.temperature.upper
                    "
                    placeholder="温度下限，30~100且位于仓库全局温度阈值之间"
                  >
                    <template #suffix>°C</template>
                  </a-input-number>
                </a-form-item>
                <a-form-item
                  field="extraOptions.reminderEvent.temperature.upper"
                  label="上限"
                  :rules="[{ required: true, message: '请输入温度上限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.reminderEvent.temperature.upper"
                    :precision="1"
                    :step="0.5"
                    :min="
                      form.extraOptions.reminderEvent.temperature.lower
                        ? form.extraOptions.reminderEvent.temperature.lower
                        : form.temperature.lower
                    "
                    :max="form.temperature.upper"
                    placeholder="温度上限，30~100且位于仓库全局温度阈值之间"
                  >
                    <template #suffix>°C</template>
                  </a-input-number>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-space>
          <a-form-item field="extraOptions.reminderEvent.humidity.enable" label="湿度预警">
            <a-switch v-model="form.extraOptions.reminderEvent.humidity.enable"></a-switch>
          </a-form-item>
          <a-space v-if="form.extraOptions.reminderEvent.humidity.enable" direction="vertical" fill>
            <a-form-item field="extraOptions.reminderEvent.humidity" label="湿度" :content-flex="false" :merge-props="false">
              <a-space direction="vertical" fill>
                <a-form-item
                  field="extraOptions.reminderEvent.humidity.lower"
                  label="下限"
                  :rules="[{ required: true, message: '请输入湿度下限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.reminderEvent.humidity.lower"
                    :precision="3"
                    :step="0.01"
                    :min="form.humidity.lower"
                    :max="
                      form.extraOptions.reminderEvent.humidity.upper ? form.extraOptions.reminderEvent.humidity.upper : form.humidity.upper
                    "
                    placeholder="湿度下限，0.000~1.000且位于仓库全局湿度阈值之间"
                  ></a-input-number>
                </a-form-item>
                <a-form-item
                  field="extraOptions.reminderEvent.humidity.upper"
                  label="上限"
                  :rules="[{ required: true, message: '请输入湿度上限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.reminderEvent.humidity.upper"
                    :precision="3"
                    :step="0.01"
                    :min="
                      form.extraOptions.reminderEvent.humidity.lower ? form.extraOptions.reminderEvent.humidity.lower : form.humidity.lower
                    "
                    :max="form.humidity.upper"
                    placeholder="湿度上限，0.000~1.000且位于仓库全局湿度阈值之间"
                  ></a-input-number>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-space>
        </a-space>
        <a-form-item field="extraOptions.warningEvent.enable">
          <template #help>
            <icon-info-circle-fill />
            温湿度超出阈值时，将会发出警告级别的预警事件，此事件将以短信及站内信的方式通知仓库管理人员。
          </template>
          <template #label>
            <icon-exclamation-circle-fill style="color: orange" />
            开启警告预警事件
          </template>
          <a-switch v-model="form.extraOptions.warningEvent.enable"></a-switch>
        </a-form-item>
        <a-space v-if="form.extraOptions.warningEvent.enable" direction="vertical" fill>
          <a-form-item field="extraOptions.warningEvent.temperature.enable" label="温度预警">
            <a-switch v-model="form.extraOptions.warningEvent.temperature.enable"></a-switch>
          </a-form-item>
          <a-space v-if="form.extraOptions.warningEvent.temperature.enable" direction="vertical" fill>
            <a-form-item field="extraOptions.warningEvent.temperature" label="温度" :content-flex="false" :merge-props="false">
              <a-space direction="vertical" fill>
                <a-form-item
                  field="extraOptions.warningEvent.temperature.lower"
                  label="下限"
                  :rules="[{ required: true, message: '请输入温度下限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.warningEvent.temperature.lower"
                    :precision="1"
                    :step="0.5"
                    :min="form.temperature.lower"
                    :max="
                      form.extraOptions.warningEvent.temperature.upper
                        ? form.extraOptions.warningEvent.temperature.upper
                        : form.temperature.upper
                    "
                    placeholder="温度下限，30~100且位于仓库全局温度阈值之间"
                  >
                    <template #suffix>°C</template>
                  </a-input-number>
                </a-form-item>
                <a-form-item
                  field="extraOptions.warningEvent.temperature.upper"
                  label="上限"
                  :rules="[{ required: true, message: '请输入温度上限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.warningEvent.temperature.upper"
                    :precision="1"
                    :step="0.5"
                    :min="
                      form.extraOptions.warningEvent.temperature.lower
                        ? form.extraOptions.warningEvent.temperature.lower
                        : form.temperature.lower
                    "
                    :max="form.temperature.upper"
                    placeholder="温度上限，30~100且位于仓库全局温度阈值之间"
                  >
                    <template #suffix>°C</template>
                  </a-input-number>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-space>
          <a-form-item field="extraOptions.warningEvent.humidity.enable" label="湿度预警">
            <a-switch v-model="form.extraOptions.warningEvent.humidity.enable"></a-switch>
          </a-form-item>
          <a-space v-if="form.extraOptions.warningEvent.humidity.enable" direction="vertical" fill>
            <a-form-item field="extraOptions.warningEvent.humidity" label="湿度" :content-flex="false" :merge-props="false">
              <a-space direction="vertical" fill>
                <a-form-item
                  field="extraOptions.warningEvent.humidity.lower"
                  label="下限"
                  :rules="[{ required: true, message: '请输入湿度下限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.warningEvent.humidity.lower"
                    :precision="3"
                    :step="0.01"
                    :min="form.humidity.lower"
                    :max="
                      form.extraOptions.warningEvent.humidity.upper ? form.extraOptions.warningEvent.humidity.upper : form.humidity.upper
                    "
                    placeholder="湿度下限，0.000~1.000且位于仓库湿度阈值之间"
                  ></a-input-number>
                </a-form-item>
                <a-form-item
                  field="extraOptions.warningEvent.humidity.upper"
                  label="上限"
                  :rules="[{ required: true, message: '请输入湿度上限' }]"
                >
                  <a-input-number
                    v-model="form.extraOptions.warningEvent.humidity.upper"
                    :precision="3"
                    :step="0.01"
                    :min="
                      form.extraOptions.warningEvent.humidity.lower ? form.extraOptions.warningEvent.humidity.lower : form.humidity.lower
                    "
                    :max="form.humidity.upper"
                    placeholder="湿度下限，0.000~1.000且位于仓库湿度阈值之间"
                  ></a-input-number>
                </a-form-item>
              </a-space>
            </a-form-item>
          </a-space>
        </a-space>
        <a-form-item field="extraOptions.seriousEvent.enable">
          <template #help>
            <icon-info-circle-fill />
            温湿度超出阈值时，将会发出严重级别的预警事件，此事件将以短信及站内信的方式通知仓库管理人员，并以站内信的方式通知部门管理。
          </template>
          <template #label>
            <icon-exclamation-circle-fill style="color: red" />
            开启严重预警事件
          </template>
          <template v-if="form.extraOptions.seriousEvent.enable" #extra>
            此预警事件无需其他配置，当温湿度超过仓库设置的温湿度阈值时，自动触发此预警事件。
          </template>
          <a-switch v-model="form.extraOptions.seriousEvent.enable"></a-switch>
        </a-form-item>
      </a-space>
      <a-button type="primary" :loading="submitLoading" @click="handleSubmit">提交更改</a-button>
    </a-form>
  </a-spin>
</template>

<script setup lang="ts">
import { wareHouseGetById, type WarehouseParamSubmit, warehouseParamsUpdate, type WarehousesInfo } from '@/api/list'
import { Message, Modal } from '@arco-design/web-vue'
import {nextTick, reactive, ref, watch} from 'vue'

const getExtraOptionForm = () => {
  return {
    isEnabled: false as boolean,
    warningEvent: {
      enable: false as boolean,
      temperature: {
        enable: false as boolean,
        upper: null as number,
        lower: null as number,
      },
      humidity: {
        enable: false as boolean,
        upper: null as number,
        lower: null as number,
      },
    },
    reminderEvent: {
      enable: false as boolean,
      temperature: {
        enable: false as boolean,
        upper: null as number,
        lower: null as number,
      },
      humidity: {
        enable: false as boolean,
        upper: null as number,
        lower: null as number,
      },
    },
    seriousEvent: {
      enable: false as boolean,
    },
  }
}

const form: WarehousesInfo = reactive({
  id: null,
  name: null,
  temperature: {
    lower: null,
    upper: null,
  },
  humidity: {
    lower: null,
    upper: null,
  },
  description: null,
  company: null,
  branch: null,
  extraOptions: getExtraOptionForm(),
})

const formLoading = ref(true)

const props = defineProps({
  warehouseId: {
    type: Number,
    default: null,
  },
})
const fetchData = async () => {
  try {
    const params = { warehouseId: props.warehouseId }
    const { data } = await wareHouseGetById(params)
    Object.assign(form, data)
    if (!form.extraOptions) {
      form.extraOptions = getExtraOptionForm()
    }
  } catch {
    // 错误处理逻辑
    Message.error('error')
  } finally {
    await nextTick(() => {
      formLoading.value = false
    })
  }
}

const formRef = ref()
const submitLoading = ref(false)

const handleSubmit = () => {
  Modal.confirm({
    title: '提交参数更改',
    content: '确定提交参数更改吗？',
    cancelText: '再想想',
    okText: '确定',
    onOk: submitForm,
  })
}

const submitForm = async () => {
  const res = await formRef.value?.validate()
  if (res) return
  const data: WarehouseParamSubmit = {
    id: form.id,
    name: form.name,
    temperature: form.temperature,
    humidity: form.humidity,
    extraOptions: form.extraOptions,
  }
  submitLoading.value = true
  Message.info('提交并向设备同步中，当设备较多时，提交时间可能较长，请耐心等待...')
  try {
    await warehouseParamsUpdate(data)
    Message.success('提交并同步成功，请留意站内信的同步结果通知')
  } catch (err) {
    Message.error(err)
  } finally {
    submitLoading.value = false
  }
}

const handleLimitChange = () => {
  if (!formLoading.value) form.extraOptions.isEnabled = false
}

// 监听，关闭事件选项的时候清空额外选项表单
watch(
  () => form.extraOptions.isEnabled,
  (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      form.extraOptions = getExtraOptionForm()
    }
  }
)

fetchData()
</script>

<script lang="ts">
export default {
  name: 'BasicParameters',
}
</script>
