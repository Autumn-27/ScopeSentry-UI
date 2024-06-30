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
  ElDescriptions,
  ElDescriptionsItem,
  ElText
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getVulResultDataApi } from '@/api/vul'
import { Icon } from '@iconify/vue'
import Csearch from '../search/Csearch.vue'
import { BaseButton } from '@/components/Button'
const { t } = useI18n()

const searchKeywordsData = [
  {
    keyword: 'url',
    example: 'url="http://example.com"',
    explain: t('searchHelp.url')
  },
  {
    keyword: 'vulname',
    example: 'vulname="nginxwebui-runcmd-rce"',
    explain: t('searchHelp.vulname')
  },
  {
    keyword: 'level',
    example: 'level="info"',
    explain: t('searchHelp.level')
  },
  {
    keyword: 'matched',
    example: 'matched="https://example.com"',
    explain: t('searchHelp.matched')
  },
  {
    keyword: 'request',
    example: 'request="cmd=whoami"',
    explain: t('searchHelp.vulRequest')
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
    label: 'URL',
    minWidth: 100
  },
  {
    field: 'vulnerability',
    label: 'Vulnerability',
    minWidth: 100
  },
  {
    field: 'level',
    label: 'Level',
    minWidth: 100,
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
      return (
        <ElRow gutter={20} style="width: 80%">
          <ElCol span={1}>
            <Icon icon="clarity:circle-solid" color={color} />
          </ElCol>
          <ElCol span={5}>
            <ElText type="info">{flag}</ElText>
          </ElCol>
        </ElRow>
      )
    }
  },
  {
    field: 'matched',
    label: 'Matched',
    minWidth: 200
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: 200
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="primary" onClick={() => action(row)}>
            {t('asset.detail')}
          </BaseButton>
        </>
      )
    },
    minWidth: 100
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getVulResultDataApi(searchParams.value, currentPage.value, pageSize.value)
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
interface RowData {
  URL: string
  Vulnerability: string
  Level: string
  Matched: string
  Time: string
  Request: string
  Response: string
}
const DialogData = reactive<RowData>({
  URL: '',
  Vulnerability: '',
  Level: '',
  Matched: '',
  Time: '',
  Request: '',
  Response: ''
})
const color = ref('')
const DialogVisible = ref(false)
const action = (data: any) => {
  const levelValue = data.level
  color.value = ''
  let flag = ''
  if (levelValue === 6) {
    color.value = 'red'
    flag = t('poc.critical')
  } else if (levelValue === 5) {
    color.value = 'orange'
    flag = t('poc.high')
  } else if (levelValue === 4) {
    color.value = 'yellow'
    flag = t('poc.medium')
  } else if (levelValue === 3) {
    color.value = 'blue'
    flag = t('poc.low')
  } else if (levelValue === 2) {
    color.value = 'green'
    flag = t('poc.info')
  } else if (levelValue === 1) {
    color.value = 'gray'
    flag = t('poc.unknown')
  }
  DialogData.Level = flag
  DialogData.Vulnerability = data.vulnerability
  DialogData.Matched = data.matched
  DialogData.Time = data.time
  DialogData.URL = data.url
  DialogData.Request = data.request
  DialogData.Response = data.response
  DialogVisible.value = true
}
</script>

<template>
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="vulnerability"
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
          :max-height="maxHeight"
          :loading="loading"
          :resizable="true"
          @register="tableRegister"
          :headerCellStyle="tableHeaderColor"
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
          :page-sizes="[20, 50, 100, 200, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </ElCard>
    </ElCol>
  </ElRow>
  <Dialog
    v-model="DialogVisible"
    :title="t('asset.detail')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    width="70%"
    :max-height="maxHeight"
  >
    <ElDescriptions :border="true" :column="2">
      <ElDescriptionsItem label="URL">{{ DialogData.URL }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Level">
        <ElRow :gutter="20">
          <ElCol :span="1">
            <Icon icon="clarity:circle-solid" :color="color" />
          </ElCol>
          <ElCol :span="5">
            <ElText type="info">{{ DialogData.Level }}</ElText>
          </ElCol>
        </ElRow>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Vulnerability">{{ DialogData.Vulnerability }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Matched">{{ DialogData.Matched }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Time" :span="2">{{ DialogData.Time }}</ElDescriptionsItem>
      <ElDescriptionsItem label="Request">
        <ElScrollbar :max-height="maxHeight" max-width="maxHeight">
          <div :style="{ whiteSpace: 'pre-line', width: '500px' }"> {{ DialogData.Request }}</div>
        </ElScrollbar>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Response">
        <ElScrollbar :max-height="maxHeight">
          <div :style="{ whiteSpace: 'pre-line' }">{{ DialogData.Response }}</div>
        </ElScrollbar>
      </ElDescriptionsItem>
    </ElDescriptions>
  </Dialog>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
.el-descriptions {
  margin-top: 20px;
}
</style>
