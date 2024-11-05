<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElCard,
  ElPagination,
  ElCol,
  ElRow,
  ElText,
  ElDivider,
  ElLink,
  ElScrollbar
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getPageMonitoringApi,
  getPageMonitoringHistoryApi,
  getPageMonitoringResponseApi
} from '@/api/asset'
import { BaseButton } from '@/components/Button'
import Csearch from '../search/Csearch.vue'
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
    field: 'response1',
    label: t('PageMonitoring.oldResponseBody'),
    minWidth: 100,
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="info" size="small" onClick={() => getResponse(row.id, '1')}>
            {t('common.view')}
          </BaseButton>
        </>
      )
    }
  },
  {
    field: 'respone2',
    label: t('PageMonitoring.currentResponseBody'),
    minWidth: 100,
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="info" size="small" onClick={() => getResponse(row.id, '2')}>
            {t('common.view')}
          </BaseButton>
        </>
      )
    }
  },
  {
    field: 'diff',
    label: 'diff',
    minWidth: 200,
    formatter: (_, __: TableColumn, bannerValue: string) => {
      const lines = bannerValue.split('\n')
      const elements = lines.map((line, index) => <div key={index}>{line}</div>)
      return (
        <ElScrollbar minSize={10} maxHeight={200}>
          <div class="scrollbar-demo-item">{elements}</div>
        </ElScrollbar>
      )
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
          <BaseButton type="success" onClick={() => getHistoryDiff(row.id)}>
            {t('asset.historyDiff')}
          </BaseButton>
        </>
      )
    }
  }
])
const DialogVisible = ref(false)
const body = ref('')
const hash = ref('')
const getResponse = async (id: string, flag: string) => {
  const res = await getPageMonitoringResponseApi(id, flag)
  action(res.data.content, res.data.hash)
}

const action = (newBody: any, newHash: string) => {
  DialogVisible.value = true
  body.value = newBody
  hash.value = newHash
}

const getHistoryDiff = async (id: string) => {
  const res = await getPageMonitoringHistoryApi(id)
  historyDiffAction(res.data.diff)
}

const HistoryDiffDialogVisible = ref(false)
const historyDiff = ref<string[]>([])
const historyDiffAction = (data: string[]) => {
  console.log(data)
  historyDiff.value = data
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
    v-model="DialogVisible"
    title="ResponseBody"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    width="70%"
    :max-height="maxHeight"
  >
    <ElScrollbar :max-height="maxHeight">
      <div :style="{ color: 'red' }">Hash: {{ hash }}</div>
      <ElDivider />
      <div :style="{ whiteSpace: 'pre-line' }">{{ body }}</div>
    </ElScrollbar>
  </Dialog>
  <Dialog
    v-model="HistoryDiffDialogVisible"
    title="Historical changes"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    width="70%"
    :max-height="maxHeight"
  >
    <div>
      <div v-for="(diff, index) in historyDiff" :key="index" :style="{ whiteSpace: 'pre-line' }">
        <ElText>{{ diff }}</ElText>
        <ElDivider style="background: #e99696" />
      </div>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
