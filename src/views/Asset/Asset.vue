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
import { reactive } from 'vue'
import { getProjectAllApi } from '@/api/project'
const { t } = useI18n()
interface Project {
  value: string
  label: string
  children?: Project[]
}
const projectList = reactive<Project[]>([])
const getProjectList = async () => {
  const res = await getProjectAllApi()
  res.data.list.forEach((item: Project) => {
    projectList.push(item)
  })
}
getProjectList()
</script>

<template>
  <ElTabs type="border-card">
    <ElTabPane :label="t('asset.assetName')"><AssetInfo2 :projectList="projectList" /></ElTabPane>
    <!-- <ElTabPane :label="t('subdomain.subdomainName')">
      <Subdomain :projectList="projectList" />
    </ElTabPane>
    <ElTabPane :label="t('task.subdomainTakeover')">
      <SubdomainTakeover :projectList="projectList" />
    </ElTabPane>
    <ElTabPane :label="t('URL.URLName')"><URL :projectList="projectList" /></ElTabPane>
    <ElTabPane :label="t('crawler.crawlerName')"><Crawler :projectList="projectList" /></ElTabPane>
    <ElTabPane :label="t('sensitiveInformation.sensitiveInformationName')">
      <SensitiveInformation :projectList="projectList" />
    </ElTabPane>
    <ElTabPane :label="t('dirScan.dirScanName')"><DirScan :projectList="projectList" /></ElTabPane>
    <ElTabPane :label="t('vulnerability.vulnerabilityName')">
      <vul :projectList="projectList" />
    </ElTabPane>
    <ElTabPane :label="t('PageMonitoring.pageMonitoringName')">
      <PageMonitoring :projectList="projectList" />
    </ElTabPane> -->
  </ElTabs>
</template>
