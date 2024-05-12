<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { h, reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useSearch } from '@/hooks/web/useSearch'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElCard,
  ElPagination,
  ElRow,
  ElCol,
  ElScrollbar,
  ElButton,
  ElTable,
  ElTableColumn,
  ElText,
  ElDivider
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getSubdomaintakerApi } from '@/api/asset'
import { Icon } from '@iconify/vue'

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
    keyword: 'domain',
    example: 'domain="example.com"',
    explain: t('searchHelp.domain')
  },
  {
    keyword: 'type',
    example: 'type="CNAME"',
    explain: t('searchHelp.subdomainType')
  },
  {
    keyword: 'value',
    example: 'value="exapmle.github.com"',
    explain: t('searchHelp.subdoaminValue')
  },
  {
    keyword: 'response',
    example: 'response="404 Not Found"',
    explain: t('searchHelp.body')
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
onMounted(() => {
  setMaxHeight()
  window.addEventListener('resize', setMaxHeight)
})

const maxHeight = ref(0)

const setMaxHeight = () => {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight
  maxHeight.value = screenHeight * 0.7
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
    field: 'host',
    label: 'Domain',
    minWidth: 50
  },
  {
    field: 'value',
    label: t('subdomain.recordValue'),
    minWidth: 30
  },
  {
    field: 'type',
    label: 'Type',
    minWidth: 50
  },
  {
    field: 'response',
    label: 'Response',
    minWidth: 50,
    formatter: (_: Recordable, __: TableColumn, Value: string) => {
      return (
        <ElScrollbar max-height="100">
          <div style="whiteSpace: 'pre-line'">{Value}</div>
        </ElScrollbar>
      )
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getSubdomaintakerApi(searchParams.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
pageSize.value = 20
const { getList } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
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
      <ElCard style="height: min-content">
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="allSchemas.tableColumns"
          :data="dataList"
          stripe
          :max-height="maxHeight"
          :border="true"
          :loading="loading"
          :resizable="true"
          @register="tableRegister"
          :headerCellStyle="tableHeaderColor"
          :tooltip-options="{
            offset: 1,
            showArrow: false,
            effect: 'dark',
            enterable: false,
            showAfter: 0,
            popperOptions: {},
            popperClass: 'test',
            placement: 'bottom',
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
          :page-sizes="[20, 50, 100, 200, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </ElCard>
    </ElCol>
  </ElRow>
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
:deep(.el-table .cell.el-tooltip) {
  white-space: pre-line;
}
</style>
