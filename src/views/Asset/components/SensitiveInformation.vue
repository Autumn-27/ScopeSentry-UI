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
  ElScrollbar,
  ElDrawer,
  ElTable,
  ElTableColumn,
  ElTag
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getSensitiveNamesApi, getSensitiveResultApi, getSensitiveResultBodyApi } from '@/api/asset'
import { Icon } from '@iconify/vue'
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
  callFunctionsConcurrently()
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
    columnKey: 'color',
    formatter: (_, __: TableColumn, cellValue: string) => {
      if (!cellValue) {
        return
      }
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
    ]
  },
  {
    field: 'match',
    label: 'Info',
    minWidth: 150,
    formatter: (_, __: TableColumn, cellValue: string[]) => {
      if (!cellValue) {
        return
      }
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
      if (row.body_id) {
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row.body_id)}>
              {t('asset.detail')}
            </BaseButton>
          </>
        )
      } else {
        return
      }
    },
    minWidth: 100
  }
])

const filter = reactive<{ [key: string]: any }>({})
const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getSensitiveResultApi(
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
  immediate: true
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
  id.replace('md5==', '')
  const res = await getSensitiveResultBodyApi(id)
  body.value = res.data.body
  DialogVisible.value = true
}
const filterChange = async (newFilters: any) => {
  Object.assign(filter, newFilters)
  callFunctionsConcurrently()
}
const handleFilterSearch = (data: any, newFilters: any) => {
  Object.assign(filter, newFilters)
  searchParams.value = data
  callFunctionsConcurrently()
}
const drawerFlag = ref(false)

const openAggregation = () => {
  drawerFlag.value = true
}
const aggregationData = ref<
  {
    name: string
    color: string
    count: number
  }[]
>([])

const getSensNames = async () => {
  try {
    const res = await getSensitiveNamesApi(searchParams.value, filter)
    if (res && res.data && Array.isArray(res.data.list)) {
      aggregationData.value = res.data.list.map((data) => ({
        name: data.name,
        color: data.color,
        count: data.count
      }))
    }
  } catch (error) {
    console.error('Error fetching node data:', error)
  } finally {
  }
}
getSensNames()
const callFunctionsConcurrently = async () => {
  try {
    await Promise.all([getList(), getSensNames()])
    console.log('Both getList and getSensNames have completed')
  } catch (error) {
    console.error('Error occurred while executing getList and getSensNames:', error)
  }
}
const addSensNameSearch = async (name: string) => {
  console.log(name)
  if (searchParams.value == '') {
    searchParams.value = 'sname="' + name + '"'
  }
  console.log(searchParams.value)
}
const dynamicTags = ref<string[]>([])
const changeTags = (type, value) => {
  const key = `${type}=${value}`
  console.log(key)
  dynamicTags.value = [...dynamicTags.value, key]
}
const handleClose = (tag: string) => {
  if (dynamicTags.value) {
    const [key, value] = tag.split('=')
    if (key in filter && Array.isArray(filter[key])) {
      filter[key] = filter[key].filter((item: string) => item !== value)
      if (filter[key].length === 0) {
        delete filter[key]
      }
    }
    dynamicTags.value = dynamicTags.value.filter((item) => item !== tag)
  }
}
</script>

<template>
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="SensitiveResult"
    :getElTableExpose="getElTableExpose"
    :handleFilterSearch="handleFilterSearch"
    :projectList="$props.projectList"
    :openAggregation="openAggregation"
    :dynamicTags="dynamicTags"
    :handleClose="handleClose"
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
          rowKey="_id"
          :border="true"
          :max-height="maxHeight"
          :loading="loading"
          :resizable="true"
          @register="tableRegister"
          @filter-change="filterChange"
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
  <ElDrawer
    v-model="drawerFlag"
    :title="t('sensitiveInformation.sensAggre')"
    direction="rtl"
    size="30%"
  >
    <ElTable :data="aggregationData">
      <ElTableColumn prop="name" :label="t('sensitiveInformation.sensitiveName')" width="180">
        <template #default="scope">
          <div
            style="display: flex; align-items: center"
            @click="changeTags('sname', scope.row.name)"
          >
            <ElTag>{{ scope.row.name }}</ElTag>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="color" label="color" width="180">
        <template #default="scope">
          <ElTag :color="scope.row.color" round effect="plain" size="small" style="width: 20px" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="count" :label="t('common.quantity')" width="180" />
    </ElTable>
  </ElDrawer>
</template>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
</style>
