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
import { reactive, ref } from 'vue'
import { exportApi, getExportRecordApi } from '@/api/export'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
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
  createLoading.value = true
  await exportApi(props.index, exportForm.quantity, exportForm.type, props.searchParams)
  createLoading.value = false
}

const exportColums = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: 10
  },
  {
    field: 'url',
    label: 'URL',
    minWidth: 30
  },
  {
    field: 'vulnerability',
    label: 'Vulnerability',
    minWidth: 20
  },
  {
    field: 'level',
    label: 'Level',
    minWidth: 10,
    formatter: (_: Recordable, __: TableColumn, levelValue: number) => {
      if (levelValue == null) {
        return <div></div>
      }
      let color = ''
      let flag = ''
      if (levelValue === 6) {
        color = 'red'
        flag = t('poc.critical')
      } else if (levelValue === 5) {
        color = 'orange'
        flag = t('poc.high')
      } else if (levelValue === 4) {
        color = 'yellow'
        flag = t('poc.medium')
      } else if (levelValue === 3) {
        color = 'blue'
        flag = t('poc.low')
      } else if (levelValue === 2) {
        color = 'green'
        flag = t('poc.info')
      } else if (levelValue === 1) {
        color = 'gray'
        flag = t('poc.unknown')
      }
    }
  },
  {
    field: 'matched',
    label: 'Matched',
    minWidth: 30
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: 20
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 10
  }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getExportRecordApi()
    return {
      total: res.data.total,
      list: res.data.list
    }
  },
  immediate: false
})
const { dataList } = tableState
const { getList } = tableMethods

const createLoading = ref(false)
</script>

<template>
  <ElTabs tabPosition="left">
    <ElTabPane :label="t('asset.export')">
      <ElForm :model="exportForm" label-width="auto" style="position: relative">
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
          <ElButton
            type="primary"
            @click="create"
            style="left: 40%; position: relative"
            :loading="createLoading"
          >
            Create
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElTabPane>
    <ElTabPane :label="t('export.exportRecords')">
      <Table
        @register="tableRegister"
        :columns="exportColums"
        :data="dataList"
        max-height="500"
        :style="{
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        }"
      />
    </ElTabPane>
  </ElTabs>
</template>
