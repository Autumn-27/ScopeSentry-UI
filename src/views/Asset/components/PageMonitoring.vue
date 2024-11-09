<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { ElCard, ElPagination, ElCol, ElRow, ElLink } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getPageMonitoringApi, getPageMonitoringDiffApi } from '@/api/asset'
import { BaseButton } from '@/components/Button'
import Csearch from '../search/Csearch.vue'
import MonacoDiffEditor from '../detail/MonacoDiffEditor.vue'
import beautify from 'js-beautify'
const { t } = useI18n()
interface Project {
  value: string
  label: string
  children?: Project[]
}
const props = defineProps<{
  projectList: Project[]
}>()
const searchKeywordsData = [
  {
    keyword: 'url',
    example: 'url="http://example.com"',
    explain: t('searchHelp.url')
  },
  {
    keyword: 'hash',
    example: 'hash="234658675623543"',
    explain: t('searchHelp.hash')
  },
  {
    keyword: 'matched',
    example: 'matched="https://example.com"',
    explain: t('searchHelp.matched')
  },
  {
    keyword: 'diff',
    example: 'diff="example"',
    explain: t('searchHelp.diff')
  },
  {
    keyword: 'response',
    example: 'response="root"',
    explain: t('searchHelp.response')
  },
  {
    keyword: 'project',
    example: 'project="Hackerone"',
    explain: t('searchHelp.project')
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
    label: 'url',
    minWidth: 200,
    formatter: (_, __: TableColumn, domainValue: string) => {
      return (
        <ElLink href={domainValue} underline={false}>
          {domainValue}
        </ElLink>
      )
    }
  },
  {
    field: 'statusCode',
    label: t('PageMonitoring.statusCode'),
    minWidth: 100,
    formatter: (_, __: TableColumn, value: number[]) => {
      if (value.length == 2) {
        return `${value[0]} => ${value[1]}`
      } else {
        return value[0]
      }
    }
  },
  {
    field: 'hash',
    label: t('PageMonitoring.hash'),
    minWidth: 100,
    formatter: (_, __: TableColumn, value: string[]) => {
      return (
        <>
          {value[0]} <br /> {value[1]}
        </>
      )
    }
  },
  {
    field: 'similarity',
    label: t('PageMonitoring.similarity'),
    minWidth: 200,
    formatter: (_, __: TableColumn, value: number) => {
      return `${value}%`
    }
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: 200
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 100,
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="success" onClick={() => getHistoryDiff(row.md5)}>
            Diff
          </BaseButton>
        </>
      )
    }
  }
])
const getHistoryDiff = async (id: string) => {
  const res = await getPageMonitoringDiffApi(id)
  historyDiffAction(res.data.diff)
}

const HistoryDiffDialogVisible = ref(false)
const historyDiff = ref<string[]>([])
const historyDiffAction = (data: string[]) => {
  historyDiff.value = data
  if (historyDiff.value.length == 0) {
    historyDiff.value = ['', '']
  }
  if (historyDiff.value.length == 1) {
    historyDiff.value.push('')
  }
  historyDiff.value[0] = beautify.js(historyDiff.value[0], { indent_size: 2 })
  historyDiff.value[1] = beautify.js(historyDiff.value[1], { indent_size: 2 })
  HistoryDiffDialogVisible.value = true
}
const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getPageMonitoringApi(
      searchParams.value,
      currentPage.value,
      pageSize.value,
      filter
    )
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
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
const filter = reactive<{ [key: string]: any }>({})
const filterChange = async (newFilters: any) => {
  Object.assign(filter, newFilters)
  getList()
}
const handleFilterSearch = (data: any, newFilters: any) => {
  Object.assign(filter, newFilters)
  searchParams.value = data
  getList()
}
</script>

<template>
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="PageMonitoring"
    :getElTableExpose="getElTableExpose"
    :handleFilterSearch="handleFilterSearch"
    :projectList="$props.projectList"
  />
  <ElRow>
    <ElCol>
      <ElCard>
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="allSchemas.tableColumns"
          :data="dataList"
          :max-height="maxHeight"
          stripe
          :border="true"
          :loading="loading"
          :resizable="true"
          @register="tableRegister"
          :headerCellStyle="tableHeaderColor"
          :tooltipOptions="{
            disabled: true,
            showArrow: false,
            effect: 'dark',
            enterable: false,
            offset: 0,
            placement: 'top',
            popperClass: '',
            popperOptions: {},
            showAfter: 0,
            hideAfter: 0
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
  <Dialog
    v-model="HistoryDiffDialogVisible"
    title="Body Diff  (Last -> Current)"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    width="80%"
    :max-height="maxHeight"
  >
    <MonacoDiffEditor :original="historyDiff[0]" :modified="historyDiff[1]" />
  </Dialog>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
