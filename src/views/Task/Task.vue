<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, h } from 'vue'
import { ElButton, ElCol, ElInput, ElRow, ElText, ElProgress, ElTag } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getTaskDataApi, getTaskContentApi, deleteTaskApi, retestTaskApi } from '@/api/task'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import AddTask from './components/AddTask.vue'

const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const search = ref('')
const handleSearch = () => {
  console.log('as')
  getList()
}
const taskColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    width: '55'
  },
  {
    field: 'name',
    label: t('task.taskName'),
    minWidth: 30
  },
  {
    field: 'taskNum',
    label: t('task.taskCount'),
    minWidth: 20,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: 'info'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'progress',
    label: t('task.taskProgress'),
    minWidth: 40,
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElProgress, {
        percentage: cellValue,
        type: 'line',
        striped: true,
        status: cellValue < 100 ? '' : 'success',
        stripedFlow: cellValue < 100 ? true : false
      })
    }
  },
  {
    field: 'creatTime',
    label: t('task.createTime'),
    minWidth: 40
  },
  {
    field: 'endTime',
    label: t('task.endTime'),
    minWidth: 40,
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      if (cellValue == '') {
        return '-'
      }
      return cellValue
    }
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 40,
    formatter: (row, __: TableColumn, _: number) => {
      console.log(row)
      const retestButton = h(
        BaseButton,
        {
          type: 'warning',
          disabled: row.progress == 100 ? false : true,
          onClick: () => confirmRetest(row)
        },
        t('task.retest')
      )
      return (
        <>
          <BaseButton type="success" onClick={() => getTaskContent(row)}>
            {t('common.view')}
          </BaseButton>
          {retestButton}
          <BaseButton type="danger" onClick={() => confirmDelete(row)}>
            {t('common.delete')}
          </BaseButton>
        </>
      )
    }
  }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getTaskDataApi(search.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const dialogVisible = ref(false)
const addTask = async () => {
  dialogVisible.value = true
  DialogTitle = t('task.addTask')
  Create.value = true
  taskForm.name = ''
  taskForm.target = ''
  taskForm.node = []
  taskForm.subdomainScan = true
  taskForm.subdomainConfig = []
  taskForm.urlScan = true
  taskForm.sensitiveInfoScan = true
  taskForm.pageMonitoring = 'JS'
  taskForm.crawlerScan = true
  taskForm.vulScan = false
  taskForm.vulList = []
  taskForm.dirScan = true
  taskForm.waybackurl = true
}

let DialogTitle = t('task.addTask')
const closeDialog = () => {
  dialogVisible.value = false
}
let taskForm = reactive({
  name: '',
  target: '',
  node: [],
  subdomainScan: true,
  duplicates: true,
  subdomainConfig: [],
  urlScan: true,
  sensitiveInfoScan: true,
  pageMonitoring: 'JS',
  crawlerScan: true,
  vulScan: false,
  vulList: [],
  portScan: false,
  ports: '',
  dirScan: true,
  waybackurl: true
})

let Create = ref(true)
const getTaskContent = async (data) => {
  const res = await getTaskContentApi(data.id)
  if (res.code === 200) {
    const result = res.data
    taskForm.name = result.name
    taskForm.target = result.target
    taskForm.node = result.node
    taskForm.subdomainScan = result.subdomainScan
    taskForm.subdomainConfig = result.subdomainConfig
    taskForm.urlScan = result.urlScan
    taskForm.sensitiveInfoScan = result.sensitiveInfoScan
    taskForm.pageMonitoring = result.pageMonitoring
    taskForm.crawlerScan = result.crawlerScan
    taskForm.vulScan = result.vulScan
    taskForm.vulList = result.vulList
    taskForm.portScan = result.portScan
    taskForm.ports = result.ports
    taskForm.dirScan = result.dirScan
    taskForm.waybackurl = result.waybackurl
  }
  dialogVisible.value = true
  Create.value = false
  DialogTitle = t('common.view')
}
const confirmDeleteSelect = async () => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await delSelect()
  }
}

const confirmDelete = async (data) => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await del(data)
  }
}
const delLoading = ref(false)
const del = async (data) => {
  delLoading.value = true
  try {
    const res = await deleteTaskApi([data.id])
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const ids = ref<string[]>([])
const delSelect = async () => {
  const elTableExpose = await getElTableExpose()
  const selectedRows = elTableExpose?.getSelectionRows() || []
  ids.value = selectedRows.map((row) => row.id)
  delLoading.value = true
  try {
    const res = await deleteTaskApi(ids.value)
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const confirmRetest = async (data) => {
  const confirmed = window.confirm('Are you sure you want to retest?')
  if (confirmed) {
    await retestTask(data)
  }
}
const retestTask = async (data) => {
  try {
    await retestTaskApi(data.id)
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    getList()
  }
}
</script>

<template>
  <ContentWrap>
    <ElRow>
      <ElCol :span="1">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('task.taskName') }}:</ElText>
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="search" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5" style="position: relative; left: 16px">
        <ElButton type="primary" :icon="searchicon" style="height: 100%" @click="handleSearch"
          >Search</ElButton
        >
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol style="position: relative; top: 16px">
        <div class="mb-10px">
          <BaseButton type="primary" @click="addTask">{{ t('task.addTask') }}</BaseButton>
          <BaseButton type="danger" :loading="delLoading" @click="confirmDeleteSelect">
            {{ t('task.delTask') }}
          </BaseButton>
        </div>
      </ElCol>
    </ElRow>
    <div style="position: relative; top: 12px">
      <Table
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
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="taskColums"
        :data="dataList"
        stripe
        :border="true"
        :loading="loading"
        :resizable="true"
        :pagination="{
          total: total,
          pageSizes: [10, 20, 50, 100, 200, 500, 1000]
        }"
        @register="tableRegister"
        :headerCellStyle="tableHeaderColor"
        :style="{
          fontFamily:
            '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        }"
      />
    </div>
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="DialogTitle"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <AddTask :closeDialog="closeDialog" :getList="getList" :vTaskForm="taskForm" :create="Create" />
  </Dialog>
</template>
