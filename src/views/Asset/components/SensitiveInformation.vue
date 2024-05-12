<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useSearch } from '@/hooks/web/useSearch'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { ElCard, ElPagination, ElScrollbar, ElRow, ElCol } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getSensitiveResultApi, getSensitiveResultBodyApi } from '@/api/asset'
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
    keyword: 'method',
    example: 'method="POST"',
    explain: t('searchHelp.method')
  },
  {
    keyword: 'body',
    example: 'body="username=admin"',
    explain: t('searchHelp.crawlerBody')
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
    field: 'name',
    label: t('sensitiveInformation.sensitiveName'),
    minWidth: 15
  },
  {
    field: 'color',
    label: 'Level',
    minWidth: 7,
    formatter: (row, __: TableColumn, cellValue: string) => {
      return (
        <Icon icon="clarity:circle-solid" color={cellValue} style={'transform: translateY(-35%)'} />
      )
    }
  },
  {
    field: 'match',
    label: 'Info',
    minWidth: 60,
    formatter: (row, __: TableColumn, cellValue: string[]) => {
      const elements = cellValue.map((line, index) => <div key={index}>{line}</div>)
      return (
        <ElScrollbar height="100px">
          <div class="scrollbar-demo-item">{elements}</div>
        </ElScrollbar>
      )
    }
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: 30
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="primary" onClick={() => action(row.id)}>
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
    const res = await getSensitiveResultApi(searchParams.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
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
const DialogVisible = ref(false)
const body = ref('')
const action = async (id) => {
  const res = await getSensitiveResultBodyApi(id)
  body.value = res.data.body
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
          :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
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
    <ElScrollbar :max-height="maxHeight">
      <div :style="{ whiteSpace: 'pre-line' }">{{ body }}</div>
    </ElScrollbar>
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
</style>
