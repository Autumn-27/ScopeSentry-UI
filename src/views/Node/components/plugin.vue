<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, h } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getTaskProgressApi } from '@/api/task'
import { useTable } from '@/hooks/web/useTable'
import { ElTag, ElTooltip } from 'element-plus'
import { Icon } from '@/components/Icon'
import { getPluginInfoApi } from '@/api/node'
const { t } = useI18n()

const props = defineProps<{
  closeDialog: () => void
  name: string
}>()
const progressColums = reactive<TableColumn[]>([
  {
    field: 'target',
    label: t('task.taskTarget'),
    minWidth: 40
  },
  {
    field: 'name',
    label: t('plugin.name'),
    minWidth: 30
  },
  {
    field: 'install',
    label: 'Install',
    minWidth: 30,
    formatter: (_: Recordable, __: TableColumn, cellValue: string[]) => {
      if (cellValue.length == 3) {
        return h(Icon, { icon: 'ph:prohibit' })
      }
      if (cellValue[0] == '') {
        return '-'
      }
      let cont = ''
      cont += `<div>Start:${cellValue[0]}</div>`
      cont += `<div>End:${cellValue[1]}</div>`
      if (cellValue[0] != '' && cellValue[1] != '') {
        return h(ElTooltip, { content: cont, placement: 'top', rawContent: true }, () =>
          h(ElTag, { type: 'success' }, () => 'Done')
        )
      } else {
        return h(ElTooltip, { content: cont, placement: 'top', rawContent: true }, () =>
          h(ElTag, { type: 'primary' }, () => 'Running')
        )
      }
    }
  },
  {
    field: 'check',
    label: 'Check',
    minWidth: 30,
    formatter: (_: Recordable, __: TableColumn, cellValue: string[]) => {
      if (cellValue.length == 3) {
        return h(Icon, { icon: 'ph:prohibit' })
      }
      if (cellValue[0] == '') {
        return '-'
      }
      let cont = ''
      cont += `<div>Start:${cellValue[0]}</div>`
      cont += `<div>End:${cellValue[1]}</div>`
      if (cellValue[0] != '' && cellValue[1] != '') {
        return h(ElTooltip, { content: cont, placement: 'top', rawContent: true }, () =>
          h(ElTag, { type: 'success' }, () => 'Done')
        )
      } else {
        return h(ElTooltip, { content: cont, placement: 'top', rawContent: true }, () =>
          h(ElTag, { type: 'primary' }, () => 'Running')
        )
      }
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
