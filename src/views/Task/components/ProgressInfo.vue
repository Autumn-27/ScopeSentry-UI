<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, h, effect } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { getTaskProgressApi } from '@/api/task'
import { useTable } from '@/hooks/web/useTable'
import { ElTag, ElTooltip, ElTooltipProps } from 'element-plus'
import { Icon } from '@/components/Icon'
const { t } = useI18n()

const props = defineProps<{
  closeDialog: () => void
  getProgressInfoID: string
  getProgressInfotype: string
  getProgressInforunnerid: string
}>()
const progressColums = reactive<TableColumn[]>([
  {
    field: 'target',
    label: t('task.taskTarget'),
    minWidth: 40
  },
  {
    field: 'subdomain',
    label: t('subdomain.subdomainName'),
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
    field: 'subdomainTakeover',
    label: t('task.subdomainTakeover'),
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
    field: 'portScan',
    label: t('task.portScan'),
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
    field: 'assetMapping',
    label: t('task.assetMapping'),
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
    field: 'urlScan',
    label: t('task.url'),
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
    field: 'sensitive',
    label: t('sensitiveInformation.sensitiveInformationName'),
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
    field: 'crawler',
    label: t('crawler.crawlerName'),
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
    field: 'dirScan',
    label: t('dirScan.dirScanName'),
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
    field: 'vulnerability',
    label: t('task.vulScan'),
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
    field: 'all',
    label: 'All',
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
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getTaskProgressApi(
      props.getProgressInfoID,
      props.getProgressInfotype,
      props.getProgressInforunnerid
    )
    return {
      total: res.data.total,
      list: res.data.list
    }
  },
  immediate: false
})
const { dataList } = tableState
const { getList } = tableMethods
getList()
</script>
<template>
  <Table
    @register="tableRegister"
    :columns="progressColums"
    :data="dataList"
    max-height="500"
    :style="{
      fontFamily:
        '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
    }"
  />
</template>
