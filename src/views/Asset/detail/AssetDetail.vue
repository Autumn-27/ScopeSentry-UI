<script setup lang="ts">
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { DescriptionsSchema } from '@/components/Descriptions'
import { Descriptions } from '@/components/Descriptions'
import { getAssetDetailApi } from '@/api/asset'

const { push, go } = useRouter()

const { t } = useI18n()
const { query } = useRoute()
const schema = reactive<DescriptionsSchema[]>([
  {
    field: 'Domain',
    label: t('asset.domain')
  },
  {
    field: 'IP',
    label: t('asset.IP')
  },
  {
    field: 'URL',
    label: 'URL'
  },
  {
    field: 'Port',
    label: t('asset.port')
  },
  {
    field: 'Service',
    label: t('asset.service')
  },
  {
    field: 'Title',
    label: t('asset.title')
  },
  {
    field: 'Status',
    label: t('asset.status')
  },
  {
    field: 'FaviconHash',
    label: 'Favicon Hash'
  },
  {
    field: 'Jarm',
    label: 'Jarm'
  },
  {
    field: 'Time',
    label: t('asset.time')
  },
  {
    field: 'Products',
    label: t('asset.products'),
    span: 24
  },
  {
    field: 'TLSData',
    label: 'TLS',
    span: 24
  },
  {
    field: 'Hash',
    label: 'Hash',
    span: 24
  },
  {
    field: 'ResponseHeaders',
    label: t('asset.responseHeader'),
    span: 24
  },
  {
    field: 'ResponseBody',
    label: t('asset.responseBody'),
    span: 24
  }
])
const descriptionsDoading = ref(true)
let assetData = reactive({})
const getTableDet = async () => {
  const res = await getAssetDetailApi(query.id as string)
  if (res) {
    assetData = Object.assign(assetData, res?.data || {})
    descriptionsDoading.value = false
  }
}
getTableDet()
</script>

<template>
  <ContentDetailWrap
    :title="t('exampleDemo.detail')"
    @back="push('/asset-information/index')"
    v-loading="descriptionsDoading"
  >
    <template #header>
      <BaseButton @click="go(-1)">
        {{ t('common.back') }}
      </BaseButton>
    </template>
    <Descriptions :title="t('asset.assetDetail')" :schema="schema" :data="assetData" />
  </ContentDetailWrap>
</template>
