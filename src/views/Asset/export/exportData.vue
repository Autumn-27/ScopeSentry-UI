<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElTabs,
  ElTabPane,
  ElFormItem,
  ElForm,
  ElRadio,
  ElRadioGroup,
  ElInput,
  ElButton
} from 'element-plus'
import { reactive } from 'vue'
import { exportApi } from '@/api/export'
const { t } = useI18n()

const props = defineProps<{
  index: string
  searchParams: string
}>()
const exportForm = reactive({
  type: 'all',
  quantity: 0
})
const create = async () => {
  await exportApi(props.index, exportForm.quantity, exportForm.type, props.searchParams)
}
</script>

<template>
  <ElTabs tabPosition="left">
    <ElTabPane :label="t('asset.export')">
      <ElForm
        :model="exportForm"
        label-width="auto"
        style="max-width: 300px; left: 5%; position: relative"
      >
        <ElFormItem :label="t('export.exportType')">
          <ElRadioGroup v-model="exportForm.type">
            <ElRadio value="all">{{ t('export.exportTypeAll') }}</ElRadio>
            <ElRadio value="search">{{ t('export.exportTypeSearch') }}</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem :label="t('export.exportQuantity')">
          <ElInput v-model="exportForm.quantity" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="create">Create</ElButton>
        </ElFormItem>
      </ElForm>
    </ElTabPane>
    <ElTabPane :label="t('asset.assetName')">test</ElTabPane>
  </ElTabs>
</template>
