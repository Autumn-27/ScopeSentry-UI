<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { onMounted, reactive, ref } from 'vue'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { ElCard, ElPagination, ElCol, ElRow, ElText } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getDirScanApi } from '@/api/asset'
import Csearch from '../search/Csearch.vue'
const { t } = useI18n()

const searchKeywordsData = [
  {
    keyword: 'url',
    example: 'url="http://example.com"',
    explain: t('searchHelp.url')
  },
  {
    keyword: 'statuscode',
    example: 'statuscode=="200"',
    explain: t('searchHelp.statuscode')
  },
  {
    keyword: 'redirect',
    example: 'redirect="https://example.com"',
    explain: t('searchHelp.redirect')
  },
  {
    keyword: 'project',
    example: 'project="Hackerone"',
    explain: t('searchHelp.project')
  },
  {
    keyword: 'length',
    example: 'length="1234"',
    explain: t('searchHelp.length')
  }
]
const searchParams = ref('')
const handleSearch = (data: any) => {
  searchParams.value = data
  getList()
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    type: 'selection',
    minWidth: '55'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: 55
  },
  {
    field: 'url',
    label: 'URL',
    minWidth: 200
  },
  {
    field: 'status',
    label: t('dirScan.status'),
    minWidth: 120,
    formatter: (_: Recordable, __: TableColumn, statusValue: number) => {
      if (statusValue == null) {
        return <div>-</div>
      }
      let color = ''
      if (statusValue < 300) {
        color = '#2eb98a'
      } else if (statusValue < 400) {
        color = '#ff5252'
      } else {
        color = '#ff5252'
      }
      return (
        <ElRow gutter={1}>
          <ElCol span={1}>
            <Icon
              icon="clarity:circle-solid"
              color={color}
              size={10}
              style={'transform: translateY(8%)'}
            />
          </ElCol>
          <ElCol span={2}>
            <ElText>{statusValue}</ElText>
          </ElCol>
        </ElRow>
      )
    }
  },
  {
    field: 'length',
    label: 'Length',
    minWidth: 120
  },
  {
    field: 'msg',
    label: 'Redirect',
    minWidth: 200
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getDirScanApi(searchParams.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
pageSize.value = 20
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
onMounted(() => {
  setMaxHeight()
  window.addEventListener('resize', setMaxHeight)
})

const maxHeight = ref(0)

const setMaxHeight = () => {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight
  maxHeight.value = screenHeight * 0.7
}
</script>

<template>
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="DirScanResult"
    :getElTableExpose="getElTableExpose"
  />
  <ElRow>
    <ElCol>
      <ElCard>
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="allSchemas.tableColumns"
          :data="dataList"
          stripe
          :border="true"
          :loading="loading"
          :resizable="true"
          :max-height="maxHeight"
          @register="tableRegister"
          :headerCellStyle="tableHeaderColor"
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
            disabled: true
          }"
          :style="{
            fontFamily:
              '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
          }"
        />
      </ElCard>
    </ElCol>
    <ElCol ::span="24">
      <ElCard>
        <ElPagination
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
