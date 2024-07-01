<script setup lang="tsx">
import {
  ElRow,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElSwitch,
  ElInputNumber,
  ElAlert
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { reactive, ref } from 'vue'
const { t } = useI18n()
const deduplication = reactive({
  asset: false,
  subdomain: true,
  SubdoaminTakerResult: true,
  UrlScan: true,
  crawler: true,
  SensitiveResult: true,
  DirScanResult: true,
  vulnerability: true,
  PageMonitoring: true,
  hour: 3,
  flag: false
})
const updateNotificationSaveLoading = ref(false)
const updateNotificationConfig = async () => {}
</script>

<template>
  <ElCard shadow="never" class="mb-20px">
    <template #header>
      <ElRow>
        <ElCol :span="3" style="height: 100%">
          <span>{{ t('configuration.duplicationconfiguration') }}</span>
        </ElCol>
      </ElRow>
    </template>
    <ElForm
      :model="deduplication"
      label-width="auto"
      status-icon
      ref="ruleFormRef"
      style="position: relative; top: 1rem"
    >
      <ElRow>
        <ElCol :span="7">
          <ElAlert type="info" :closable="false">
            <p>"Full Name" label is automatically attached to the input:</p>
          </ElAlert>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="3">
          <ElFormItem :label="t('configuration.deduplicationFlag')">
            <ElSwitch
              v-model="deduplication.flag"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('configuration.deduplicationHour')" prop="type">
            <ElInputNumber
              v-model="deduplication.hour"
              :min="1"
              controls-position="right"
              size="small"
            /><ElText style="position: relative; left: 16px">Hour</ElText>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="5">
          <ElFormItem :label="t('asset.assetName')">
            <ElSwitch
              v-model="deduplication.asset"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('subdomain.subdomainName')">
            <ElSwitch
              v-model="deduplication.subdomain"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('task.subdomainTakeover')">
            <ElSwitch
              v-model="deduplication.SubdoaminTakerResult"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="5">
          <ElFormItem :label="t('URL.URLName')">
            <ElSwitch
              v-model="deduplication.UrlScan"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('crawler.crawlerName')">
            <ElSwitch
              v-model="deduplication.crawler"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('sensitiveInformation.sensitiveInformationName')">
            <ElSwitch
              v-model="deduplication.SensitiveResult"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="5">
          <ElFormItem :label="t('dirScan.dirScanName')">
            <ElSwitch
              v-model="deduplication.DirScanResult"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('vulnerability.vulnerabilityName')">
            <ElSwitch
              v-model="deduplication.vulnerability"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="5">
          <ElFormItem :label="t('PageMonitoring.pageMonitoringName')">
            <ElSwitch
              v-model="deduplication.PageMonitoring"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="2" :offset="8">
          <ElFormItem>
            <ElButton
              type="primary"
              @click="updateNotificationConfig()"
              :loading="updateNotificationSaveLoading"
              >{{ t('common.submit') }}</ElButton
            >
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </ElCard>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
