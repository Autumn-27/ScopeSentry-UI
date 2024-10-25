<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, h, onMounted } from 'vue'
import {
  ElButton,
  ElCol,
  ElInput,
  ElRow,
  ElText,
  ElMessageBox,
  ElSwitch,
  ElTag,
  ElTooltip
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { deletePluginDataApi, getPluginDataApi } from '@/api/plugins'
import detail from './components/detail.vue'

const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const search = ref('')
const handleSearch = () => {
  getList()
}
const taskColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    minWidth: 55
  },
  {
    field: 'name',
    label: t('plugin.name')
  },
  {
    field: 'module',
    label: t('plugin.module'),
    formatter: (row, __: TableColumn, value: string) => {
      const color = moduleColorMap[value] || '#FFFFFF' // 默认白色
      return <ElTag style={{ backgroundColor: color, color: '#000' }}>{value}</ElTag>
    }
  },
  {
    field: 'isSystem',
    label: t('plugin.isSystem'),
    formatter: (row, __: TableColumn, value: boolean) => {
      return <ElTag type={value ? 'success' : 'warning'}>{value ? 'true' : 'false'}</ElTag>
    }
  },
  {
    field: 'version',
    label: t('plugin.version')
  },
  {
    field: 'parameter',
    label: t('plugin.parameter'),
    formatter: (row, __: TableColumn, value: string) => {
      return (
        <ElTooltip content={row.help} placement="top" effect="light">
          <span style="cursor: pointer;">{value}</span>
        </ElTooltip>
      )
    }
  },
  {
    field: 'introduction',
    minWidth: 200,
    label: t('plugin.introduction')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="success" onClick={() => editPlugin(row.id)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton type="danger" onClick={() => confirmDelete(row.hash)} disabled={row.isSystem}>
            {t('common.delete')}
          </BaseButton>
        </>
      )
    }
  }
])

const moduleColorMap = {
  TargetHandler: '#2243dda6', // 浅红色
  SubdomainScan: '#FF9B85', // 更深的浅橙色
  SubdomainSecurity: '#FFFFBA', // 浅黄色
  PortScanPreparation: '#BAFFB3', // 浅绿色
  PortScan: '#BAE1FF', // 浅蓝色
  AssetMapping: '#e3ffba', // 浅粉红色
  URLScan: '#D1BAFF', // 浅紫色
  WebCrawler: '#FFABAB', // 浅红
  DirScan: '#3ccde6', // 选择浅桃色
  VulnerabilityScan: '#FF677D', // 浅粉色
  AssetHandle: '#B2E1FF', // 浅青色
  PortFingerprint: '#ffb5e4', // 更亮的浅橙色
  URLSecurity: '#FFE4BA' // 浅米色
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getPluginDataApi(search.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: true
})
const { loading, dataList, total, currentPage, pageSize } = tableState
pageSize.value = 20
const { getList, getElTableExpose } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const dialogVisible = ref(false)

let DialogTitle = t('plugin.new')
const closeDialog = () => {
  dialogVisible.value = false
}

const confirmDeleteSelect = async () => {
  ElMessageBox({
    title: 'Delete',
    draggable: true
  }).then(async () => {
    await delSelect()
  })
}

const confirmDelete = async (data) => {
  ElMessageBox({
    title: 'Delete',
    draggable: true
  }).then(async () => {
    await del(data)
  })
  // const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  // if (confirmed) {
  //   await del(data)
  // }
}
const delLoading = ref(false)
const del = async (data) => {
  delLoading.value = true
  try {
    const res = await deletePluginDataApi([data])
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
  ids.value = selectedRows.map((row) => row.hash)
  delLoading.value = true
  try {
    const res = await deletePluginDataApi(ids.value)
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}

const addPlugin = async () => {
  id.value = ''
  dialogVisible.value = true
}

const id = ref('')

const editPlugin = async (data) => {
  id.value = data
  DialogTitle = t('common.edit')
  dialogVisible.value = true
}
</script>

<template>
  <ContentWrap>
    <ElRow>
      <ElCol :span="1">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('plugin.name') }}:</ElText>
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
          <BaseButton type="primary" @click="addPlugin">{{ t('plugin.new') }}</BaseButton>
          <BaseButton type="danger" :loading="delLoading" @click="confirmDeleteSelect">
            {{ t('plugin.delete') }}
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
          pageSizes: [20, 30, 50, 100, 200, 500, 1000]
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
    <detail :closeDialog="closeDialog" :getList="getList" :id="id" />
  </Dialog>
</template>
