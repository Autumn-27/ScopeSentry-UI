<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useSearch } from '@/hooks/web/useSearch'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElCard,
  ElPagination,
  ElCol,
  ElRow,
  ElButton,
  ElTable,
  ElTableColumn,
  ElDescriptions,
  ElDescriptionsItem,
  ElText,
  ElDivider
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getVulResultDataApi } from '@/api/vul'
import { Icon } from '@iconify/vue'
import { BaseButton } from '@/components/Button'
const { t } = useI18n()
const { searchRegister } = useSearch()

const schema = reactive<FormSchema[]>([
  {
    field: 'search',
    label: t('form.input'),
    component: 'Input',
    formItemProps: {
      size: 'large',
      style: { width: '100%' }
    },
    componentProps: {
      clearable: false,
      slots: {
        suffix: () => (
          <ElButton
            class="icon-button"
            onClick={getHelp}
            text
            style="outline: none;background-color: transparent !important; color: inherit !important; box-shadow: none !important;position: relative;left: 24%"
          >
            <Icon icon="tdesign:chat-bubble-help" />
          </ElButton>
        )
      }
    }
  }
])
const searchHelpData = [
  {
    operator: '=',
    meaning: t('searchHelp.like')
  },
  {
    operator: '!=',
    meaning: t('searchHelp.notIn')
  },
  {
    operator: '==',
    meaning: t('searchHelp.equal')
  },
  {
    operator: '&&',
    meaning: t('searchHelp.and')
  },
  {
    operator: '||',
    meaning: t('searchHelp.or')
  },
  {
    operator: '()',
    meaning: t('searchHelp.brackets')
  }
]
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
    example: 'level="info',
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
const dialogVisible = ref(false)

const getHelp = () => {
  dialogVisible.value = true
}

const isGrid = ref(true)
const layout = ref('inline')

const buttonPosition = ref('left')

const searchParams = ref('')
const handleSearch = (data: any) => {
  searchParams.value = data.search
  getList()
}

const searchLoading = ref(false)

const crudSchemas = reactive<CrudSchema[]>([
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
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="primary" onClick={() => action(row)}>
            {t('asset.detail')}
          </BaseButton>
        </>
      )
    },
    minWidth: 10
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
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
pageSize.value = 20
// getList()
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
  <ContentWrap style="height: 80px">
    <Search
      :schema="schema"
      :is-col="isGrid"
      :layout="layout"
      :show-reset="false"
      :button-position="buttonPosition"
      :search-loading="searchLoading"
      @search="handleSearch"
      @reset="handleSearch"
      @register="searchRegister"
    />
  </ContentWrap>
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
        <ElRow :gutter="20" style="width: 80%">
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
  <Dialog
    v-model="dialogVisible"
    :title="t('common.querysyntax')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <ElRow>
      <ElCol>
        <ElText tag="b" size="small">{{ t('searchHelp.operator') }}</ElText>
        <ElDivider direction="vertical" />
        <ElText size="small" type="danger">{{ t('searchHelp.notice') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="searchHelpData">
          <ElTableColumn prop="operator" :label="t('searchHelp.operator')" width="300" />
          <ElTableColumn prop="meaning" :label="t('searchHelp.meaning')" />
        </ElTable>
      </ElCol>
      <ElCol style="margin-top: 15px">
        <ElText tag="b" size="small">{{ t('searchHelp.keywords') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="searchKeywordsData">
          <ElTableColumn prop="keyword" :label="t('searchHelp.keywords')" />
          <ElTableColumn prop="example" :label="t('searchHelp.example')" />
          <ElTableColumn prop="explain" :label="t('searchHelp.explain')" />
        </ElTable>
      </ElCol>
    </ElRow>
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
