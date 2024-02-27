<script setup lang="ts">
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter, useRoute } from 'vue-router'
import { DescriptionsSchema } from '@/components/Descriptions'
import { Descriptions } from '@/components/Descriptions'
import { getAssetDetailApi } from '@/api/asset'
import PanelGroup from '@/views/Dashboard/components/PanelGroup.vue'

const { push, go } = useRouter()

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
  <PanelGroup />
  <ContentDetailWrap
    :title="t('exampleDemo.detail')"
    @back="push('/project-management/index')"
    v-loading="descriptionsDoading"
  >
    <template #header>
      <BaseButton @click="go(-1)">
        {{ t('common.back') }}
      </BaseButton>
    </template>
    <Descriptions :title="t('project.projectDetail')" :schema="schema" :data="assetData" />
  </ContentDetailWrap>
</template>
