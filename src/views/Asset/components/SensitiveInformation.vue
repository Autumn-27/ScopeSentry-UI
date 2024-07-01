<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { ElCard, ElPagination, ElCol, ElRow, ElScrollbar } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getSensitiveResultApi, getSensitiveResultBodyApi } from '@/api/asset'
import { Icon } from '@iconify/vue'
import { BaseButton } from '@/components/Button'
import Csearch from '../search/Csearch.vue'
const { t } = useI18n()

const searchKeywordsData = [
  {
    keyword: 'url',
    example: 'url="http://example.com"',
    explain: t('searchHelp.url')
  },
  {
    keyword: 'sname',
    example: 'sname="twilio_account_sid"',
    explain: t('searchHelp.sname')
  },
  {
    keyword: 'body',
    example: 'body="api-key-example"',
    explain: t('searchHelp.body')
  },
  {
    keyword: 'info',
    example: 'info="api-key-example"',
    explain: t('searchHelp.sinfo')
  },
  {
    keyword: 'project',
    example: 'project="Hackerone"',
    explain: t('searchHelp.project')
  },
  {
    keyword: 'md5',
    example: 'md5=="1d49e5e190f7a38ab498e28e6578f64f"',
    explain: t('searchHelp.sensMd5')
  },
  {
    keyword: 'level',
    example: 'level=="rad"',
    explain: t('searchHelp.sensLevel')
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
    field: 'name',
    label: t('sensitiveInformation.sensitiveName'),
    minWidth: 150
  },
  {
    field: 'color',
    label: 'Level',
    minWidth: 50,
    formatter: (_, __: TableColumn, cellValue: string) => {
      return (
        <Icon icon="clarity:circle-solid" color={cellValue} style={'transform: translateY(-35%)'} />
      )
    },
    filters: [
      { text: 'Red', value: 'red' },
      { text: 'Green', value: 'green' },
      { text: 'Cyan', value: 'cyan' },
      { text: 'Yellow', value: 'yellow' },
      { text: 'Orange', value: 'orange' },
      { text: 'Gray', value: 'gray' },
      { text: 'Pink', value: 'pink' },
      { text: 'Null', value: 'null' }
    ],
    filterMethod: (value, row) => {
      return row.color === value
    }
  },
  {
    field: 'match',
    label: 'Info',
    minWidth: 150,
    formatter: (_, __: TableColumn, cellValue: string[]) => {
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
    minWidth: 200
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
    minWidth: 100
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
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
getList()
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
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="SensitiveResult"
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
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
