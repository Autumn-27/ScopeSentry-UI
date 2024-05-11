<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadio,
  ElText
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { BaseButton } from '@/components/Button'
import { useTable } from '@/hooks/web/useTable'
import { getNotificationApi } from '@/api/Configuration'
const { t } = useI18n()
const taskColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    width: '55'
  },
  {
    field: 'method',
    label: 'Method'
  },
  {
    field: 'url',
    label: 'URL'
  },
  {
    field: 'contentType',
    label: 'Content Type'
  },
  {
    field: 'data',
    label: 'POST DATA'
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 20
  }
])

const { tableState } = useTable({
  fetchDataApi: async () => {
    const res = await getNotificationApi()
    return {
      list: res.data.list
    }
  }
})
const { dataList } = tableState
const notificationForm = reactive({
  url: '',
  method: 'GET',
  contentType: 'raw',
  data: ''
})
const dialogVisible = ref(false)
const addNotification = async () => {
  dialogVisible.value = true
}
const addNotificationSaveLoading = ref(false)
const submitAddPageMonitForm = async () => {
  addNotificationSaveLoading.value = true
  // await addScheduledTaskPageMonitApi(pageMontForm.url)
  addNotificationSaveLoading.value = false
  dialogVisible.value = false
}
</script>

<template>
  <ElCard shadow="never" class="mb-20px">
    <template #header>
      <ElRow>
        <ElCol :span="3" style="height: 100%">
          <span>{{ t('configuration.noticeConfig') }}</span>
        </ElCol>
      </ElRow>
    </template>
    <ElRow>
      <ElCol style="position: relative; top: 16px">
        <div class="mb-10px">
          <BaseButton type="primary" @click="addNotification">{{
            t('configuration.newWebhookConfig')
          }}</BaseButton>
          <BaseButton type="danger">
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </ElCol>
    </ElRow>
    <div style="position: relative; top: 12px">
      <Table
        :data="dataList"
        :columns="taskColums"
        stripe
        :border="true"
        max-height="150"
        :resizable="true"
        :style="{
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        }"
      />
    </div>
  </ElCard>
  <Dialog
    v-model="dialogVisible"
    :title="t('configuration.newWebhookConfig')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    maxHeight="100"
  >
    <ElText class="mx-2" type="danger" size="small" style="position: relative; left: 2rem">{{
      t('configuration.noticeHelp')
    }}</ElText>
    <ElForm :model="notificationForm" label-width="100px" status-icon ref="ruleFormRef">
      <ElFormItem label="Method" prop="method">
        <ElRadioGroup v-model="notificationForm.method">
          <ElRadio value="GET">GET</ElRadio>
          <ElRadio value="POST">POST</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="URL" prop="url">
        <ElInput v-model="notificationForm.url" placeholder="Input URL." />
      </ElFormItem>
      <ElFormItem label="Data Type" prop="contentType" v-if="notificationForm.method == 'POST'">
        <ElRadioGroup v-model="notificationForm.contentType">
          <ElRadio value="raw">Raw</ElRadio>
          <ElRadio value="json">Json</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Data" prop="Data" v-if="notificationForm.method == 'POST'">
        <ElInput v-model="notificationForm.data" placeholder="Input POST Data." />
      </ElFormItem>
      <ElRow>
        <ElCol :span="2" :offset="8">
          <ElFormItem>
            <ElButton
              type="primary"
              @click="submitAddPageMonitForm()"
              :loading="addNotificationSaveLoading"
              >{{ t('common.submit') }}</ElButton
            >
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </Dialog>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
