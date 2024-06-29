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
  ElButton,
  ElTag,
  ElSpace
} from 'element-plus'
import { reactive, ref } from 'vue'
import { exportApi, getExportRecordApi, delExportApi } from '@/api/export'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { BaseButton } from '@/components/Button'
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
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'file_name',
    label: t('export.fileName'),
    width: '160'
  },
  {
    field: 'state',
    label: t('export.state'),
    formatter: (_: Recordable, __: TableColumn, value: number) => {
      if (value == 0) {
        return <ElTag type="info">{t('export.wait')}</ElTag>
      } else if (value == 1) {
        return <ElTag type="success">{t('export.success')}</ElTag>
      } else {
        return <ElTag type="danger">{t('export.fail')}</ElTag>
      }
    }
  },
  {
    field: 'create_time',
    label: t('export.createTime'),
    width: '160'
  },
  {
    field: 'end_time',
    label: t('export.endTime'),
    width: '160',
    formatter: (_: Recordable, __: TableColumn, value: string) => {
      if (value == '') {
        return '-'
      } else {
        return value
      }
    }
  },
  {
    field: 'data_type',
    label: t('export.type'),
    width: '120'
  },
  {
    field: 'file_size',
    label: t('export.fileSize'),
    width: '100',
    formatter: (_: Recordable, __: TableColumn, value: string) => {
      if (value == '') {
        return '-'
      } else {
        return value + ' MB'
      }
    }
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    width: '200',
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="success" onClick={() => download(row.file_name)}>
            {t('export.download')}
          </BaseButton>
          <BaseButton type="danger" onClick={() => confirmDelete(row)}>
            {t('common.delete')}
          </BaseButton>
        </>
      )
    }
  }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getExportRecordApi()
    return {
      list: res.data.list
    }
  },
  immediate: false
})
const { dataList, loading } = tableState
const { getList, getElTableExpose } = tableMethods

const download = async (id) => {
  const aTag = document.createElement('a')
  aTag.href = '/api/export/download?file_name=' + id
  aTag.click()
}
const createLoading = ref(false)
const onClick = (name) => {
  if (name == 'exportRecords') {
    getList()
  }
}
const delLoading = ref(false)
const confirmDelete = async (data) => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await del(data)
  }
}
const del = async (data) => {
  delLoading.value = true
  try {
    const res = await delExportApi([data.file_name])
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const confirmDeleteSelect = async () => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await delSelect()
  }
}
const ids = ref<string[]>([])
const delSelect = async () => {
  const elTableExpose = await getElTableExpose()
  const selectedRows = elTableExpose?.getSelectionRows() || []
  ids.value = selectedRows.map((row) => row.file_name)
  delLoading.value = true
  try {
    const res = await delExportApi(ids.value)
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
</script>

<template>
  <ElTabs tabPosition="left" @tab-change="onClick" model-value="export">
    <ElTabPane :label="t('asset.export')" name="export">
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
    <ElTabPane :label="t('export.exportRecords')" name="exportRecords">
      <ElSpace direction="vertical" alignment="flex-start">
        <BaseButton type="danger" :loading="delLoading" @click="confirmDeleteSelect">
          {{ t('common.delete') }}
        </BaseButton>
        <Table
          @register="tableRegister"
          :columns="exportColums"
          :data="dataList"
          :loading="loading"
          max-height="500"
          :style="{
            fontFamily:
              '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
          }"
        />
      </ElSpace>
    </ElTabPane>
  </ElTabs>
</template>
