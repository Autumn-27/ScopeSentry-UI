<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElText,
  ElDivider
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { ref, reactive, onBeforeMount } from 'vue'
import notification from './components/notification.vue'
import { getSystemConfigurationApi, saveSystemConfigurationApi } from '@/api/Configuration'
const { t } = useI18n()
const form = reactive({
  timezone: '',
  MaxTaskNum: '',
  DirscanThread: '',
  PortscanThread: '',
  CrawlerThread: ''
})
onBeforeMount(async () => {
  try {
    const res = await getSystemConfigurationApi()

    if (res.code == 200) {
      form.timezone = res.data.timezone
      form.MaxTaskNum = res.data.MaxTaskNum
      form.DirscanThread = res.data.DirscanThread
      form.PortscanThread = res.data.PortscanThread
      form.CrawlerThread = res.data.CrawlerThread
    } else {
      console.error(`API request failed with status code ${res.code}`)
    }
  } catch (error) {
    console.error('An error occurred while fetching the subfinder config:', error)
  }
})
const confirmAdd = async () => {
  const confirmed = window.confirm('Do you want to save the data?')
  if (confirmed) {
    await save()
  }
}
const save = async () => {
  saveLoading.value = true
  const res = await saveSystemConfigurationApi(
    form.timezone,
    form.MaxTaskNum,
    form.DirscanThread,
    form.PortscanThread,
    form.CrawlerThread
  )
  if (res.code == 200) {
    saveLoading.value = false
  } else {
    saveLoading.value = false
  }
}
const saveLoading = ref(false)
</script>

<template>
  <ElCard shadow="never" class="mb-20px">
    <template #header>
      <ElRow>
        <ElCol :span="3" style="height: 100%">
          <span>{{ t('configuration.system') }}</span>
        </ElCol>
      </ElRow>
    </template>
    <ElForm :model="form" label-width="auto" style="max-width: 460px">
      <ElFormItem :label="t('configuration.timezone')">
        <ElInput v-model="form.timezone" />
      </ElFormItem>
      <ElFormItem :label="t('configuration.maxTaskNum')">
        <ElInput v-model="form.MaxTaskNum" />
      </ElFormItem>
      <ElFormItem :label="t('configuration.dirScanThread')">
        <ElInput v-model="form.DirscanThread" />
      </ElFormItem>
      <ElFormItem :label="t('configuration.portScanThread')">
        <ElInput v-model="form.PortscanThread" />
      </ElFormItem>
      <ElFormItem :label="t('configuration.crawlerThread')">
        <ElInput v-model="form.CrawlerThread" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="confirmAdd" :loading="saveLoading">Save</ElButton>
        <ElDivider direction="vertical" />
        <ElText size="small" type="danger">{{ t('configuration.threadMsg') }}</ElText>
      </ElFormItem>
    </ElForm>
  </ElCard>
  <notification />
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
