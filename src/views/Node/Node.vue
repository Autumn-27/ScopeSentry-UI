<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, h } from 'vue'
import { ElButton, ElCol, ElInput, ElRow, ElText, ElTag } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { BaseButton } from '@/components/Button'
import { getNodeDataApi } from '@/api/node'
const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const search = ref('')
const handleSearch = () => {
  console.log('as')
  getList()
}
const nodeColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    width: '55'
  },
  {
    field: 'name',
    label: t('node.nodeName')
  },
  {
    field: 'running',
    label: t('node.taskCount'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: 'primary',
          round: true,
          effect: 'plain'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'finished',
    label: t('node.finished'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: 'primary',
          round: true,
          effect: 'plain'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'cpuNum',
    label: t('node.nodeUsageCpu'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: 'primary',
          round: true,
          effect: 'plain'
        },
        () => cellValue + '%'
      )
    }
  },
  {
    field: 'memNum',
    label: t('node.nodeUsageMemory'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: 'primary',
          round: true,
          effect: 'plain'
        },
        () => cellValue + '%'
      )
    }
  },
  {
    field: 'state',
    label: t('node.nodeStatus'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type: cellValue === '1' ? 'success' : cellValue === '2' ? 'warning' : 'danger',
          effect: 'plain'
        },
        () =>
          cellValue === '1'
            ? t('node.statusRun')
            : cellValue === '2'
              ? t('node.statusStop')
              : t('node.statusError')
      )
    }
  },
  {
    field: 'updateTime',
    label: t('node.updateTime')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    formatter: (row, __: TableColumn, _: number) => {
      console.log(row)
      return (
        <>
          <BaseButton type="success">{t('node.log')}</BaseButton>
          <BaseButton type="primary">{t('node.config')}</BaseButton>
        </>
      )
    }
  }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getNodeDataApi()
    return {
      list: res.data.list
    }
  }
})
const { loading, dataList, currentPage, pageSize } = tableState
const { getList } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
</script>

<template>
  <ContentWrap>
    <ElRow :gutter="20" style="margin-bottom: 15px">
      <ElCol :span="1.5">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('node.nodeName') }}:</ElText>
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="search" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5" style="position: relative; left: 16px">
        <ElButton type="primary" :icon="searchicon" style="height: 100%" @click="handleSearch"
          >Search</ElButton
        >
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol style="position: relative; top: 16px">
        <div class="mb-10px">
          <BaseButton type="danger">
            {{ t('task.delTask') }}
          </BaseButton>
        </div>
      </ElCol>
    </ElRow>
    <div style="position: relative; top: 12px">
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="nodeColums"
        :data="dataList"
        stripe
        :border="true"
        :loading="loading"
        :resizable="true"
        @register="tableRegister"
        :headerCellStyle="tableHeaderColor"
        :style="{
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        }"
      />
    </div>
  </ContentWrap>
</template>
