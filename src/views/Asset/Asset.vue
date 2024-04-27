<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElTabs } from 'element-plus'
import { ElTabPane } from 'element-plus'
import AssetInfo2 from './components/AssetInfo2.vue'
import Subdomain from './components/Subdomain.vue'
import URL from './components/URL.vue'
import Crawler from './components/Crawler.vue'
import SensitiveInformation from './components/SensitiveInformation.vue'
import DirScan from './components/DirScan.vue'
import PageMonitoring from './components/PageMonitoring.vue'
import vul from './components/vul.vue'
import SubdomainTakeover from './components/SubdomainTakeover.vue'
const { t } = useI18n()
</script>

<template>
  <ElTabs type="border-card">
    <ElTabPane :label="t('asset.assetName')"><AssetInfo2 /></ElTabPane>
    <ElTabPane :label="t('subdomain.subdomainName')"><Subdomain /></ElTabPane>
    <ElTabPane :label="t('task.subdomainTakeover')"><SubdomainTakeover /></ElTabPane>
    <ElTabPane :label="t('URL.URLName')"><URL /></ElTabPane>
    <ElTabPane :label="t('crawler.crawlerName')"><Crawler /></ElTabPane>
    <ElTabPane :label="t('sensitiveInformation.sensitiveInformationName')"
      ><SensitiveInformation
    /></ElTabPane>
    <ElTabPane :label="t('dirScan.dirScanName')"><DirScan /></ElTabPane>
    <ElTabPane :label="t('vulnerability.vulnerabilityName')"><vul /></ElTabPane>
    <ElTabPane :label="t('PageMonitoring.pageMonitoringName')"><PageMonitoring /></ElTabPane>
  </ElTabs>
</template>
