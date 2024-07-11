<script setup lang="ts">
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { DescriptionsSchema } from '@/components/Descriptions'
import { getAssetDetailApi } from '@/api/asset'
import { ElTabs } from 'element-plus'
import { ElTabPane } from 'element-plus'
import Dashboard from './components/Dashboard.vue'
import Subdomain from './components/Subdomain.vue'
import Port from './components/Port.vue'
const { t } = useI18n()
const { query } = useRoute()
const schema = reactive<DescriptionsSchema[]>([
  {
    field: 'name',
    label: t('project.projectName'),
    span: 8
  },
  {
    field: 'cycle',
    label: t('project.cycle'),
    span: 8
  },
  {
    field: 'creatTime',
    label: t('project.CreatTime'),
    span: 8
  },
  {
    field: 'TAG',
    label: 'TAG',
    span: 8
  },
  {
    field: 'scope',
    label: t('project.projectScope'),
    span: 16
  }
])
const descriptionsDoading = ref(true)
let assetData = reactive({})
// const getTableDet = async () => {
//   const res = await getAssetDetailApi(query.id as string)
//   if (res) {
//     assetData = Object.assign(assetData, res?.data || {})
//     descriptionsDoading.value = false
//   }
// }
// getTableDet()
</script>

<template>
  <ElTabs type="border-card">
    <ElTabPane :label="t('project.overview')"><Dashboard /></ElTabPane>
    <ElTabPane :label="t('subdomain.subdomainName')"><Subdomain /></ElTabPane>
    <ElTabPane :label="t('asset.port')"> <Port /></ElTabPane>
    <ElTabPane :label="t('asset.service')">xxxx</ElTabPane>
    <ElTabPane :label="t('crawler.crawlerName')">xxx</ElTabPane>
  </ElTabs>
</template>
