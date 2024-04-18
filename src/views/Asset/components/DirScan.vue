<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useSearch } from '@/hooks/web/useSearch'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { ElCard, ElPagination } from 'element-plus'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getDirScanApi } from '@/api/asset'

const { t } = useI18n()
const { searchRegister } = useSearch()
const restaurants = ref<Recordable[]>([])
const querySearch = (queryString: string, cb: Fn) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const schema = reactive<FormSchema[]>([
  {
    field: 'search',
    label: t('form.input'),
    component: 'Autocomplete',
    componentProps: {
      fetchSuggestions: querySearch
    },
    formItemProps: {
      size: 'large',
      style: { width: '100%' }
    }
  }
])
const createFilter = (queryString: string) => {
  return (restaurant: Recordable) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const loadAll = () => {
  return [{ value: 'sudomain' }, { value: 'and' }, { value: 'or' }, { value: '=' }]
}

onMounted(() => {
  restaurants.value = loadAll()
})

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
    field: 'URL',
    label: 'URL',
    minWidth: 60
  },
  {
    field: 'Title',
    label: t('dirScan.title'),
    minWidth: 50
  },
  {
    field: 'Status',
    label: t('dirScan.status'),
    minWidth: 60
  },
  {
    field: 'Length',
    label: t('dirScan.length'),
    minWidth: 60
  },
  {
    field: 'Time',
    label: t('asset.time'),
    minWidth: 30
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
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
// getList()
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
          max-height="700"
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
