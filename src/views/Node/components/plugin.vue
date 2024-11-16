<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, h } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getPluginInfoApi } from '@/api/node'
import { useIcon } from '@/hooks/web/useIcon'
import { BaseButton } from '@/components/Button'
const { t } = useI18n()

const props = defineProps<{
  closeDialog: () => void
  name: string
}>()
const correctIcon = useIcon({ icon: 'icon-park:check-one' })
const errorIcon = useIcon({ icon: 'line-md:close-circle', color: '#e01f1f' })

const progressColums = reactive<TableColumn[]>([
  {
    field: 'name',
    label: t('plugin.name'),
    minWidth: 30
  },
  {
    field: 'install',
    label: 'Install',
    minWidth: 30,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return cellValue ? correctIcon : errorIcon
    }
  },
  {
    field: 'check',
    label: 'Check',
    minWidth: 30,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return cellValue ? correctIcon : errorIcon
    }
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="warning">{t('plugin.reInstall')}</BaseButton>
          <BaseButton type="success">{t('plugin.reCheck')}</BaseButton>
          <BaseButton type="danger">{t('plugin.uninstall')}</BaseButton>
        </>
      )
    }
  }
])
const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    const res = await getPluginInfoApi(props.name)
    return {
      list: res.data.list
    }
  },
  immediate: true
})
const { loading, dataList } = tableState
</script>
<template>
  <Table
    @register="tableRegister"
    :columns="progressColums"
    :data="dataList"
    rowKey="_id"
    :loading="loading"
    :resizable="true"
    max-height="600"
    :tooltip-options="{
      offset: 1,
      showArrow: false,
      effect: 'dark',
      enterable: true,
      showAfter: 0,
      popperOptions: {},
      popperClass: 'test',
      placement: 'top',
      hideAfter: 0,
      disabled: false
    }"
    :style="{
      fontFamily:
        '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
    }"
  />
</template>
