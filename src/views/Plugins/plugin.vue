<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, onMounted, h } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {
  ElButton,
  ElCol,
  ElInput,
  ElRow,
  ElText,
  ElMessageBox,
  ElTag,
  ElTooltip,
  ElScrollbar,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ElUpload,
  ElMessage,
  ElDropdownItem,
  ElDropdownMenu,
  ElDropdown,
  ElIcon
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import {
  cleanPluginLogApi,
  deletePluginDataApi,
  getPluginDataApi,
  getPluginLogApi,
  reCheckPluginApi,
  reInstallPluginApi,
  uninstallPluginApi
} from '@/api/plugins'
import detail from './components/detail.vue'
import { useUserStore } from '@/store/modules/user'

const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const search = ref('')
const handleSearch = () => {
  getList()
}
const taskColums = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: '15'
  },
  {
    field: 'selection',
    type: 'selection',
    minWidth: 55
  },
  {
    field: 'name',
    label: t('plugin.name'),
    formatter: (row, __: TableColumn, value: string) => {
      return (
        <a
          href={`https://plugin.scope-sentry.top/plugin/${row.hash}`}
          style="color: #409EFF; text-decoration: none;"
          target="_blank"
        >
          {value}
        </a>
      )
    }
  },
  {
    field: 'module',
    label: t('plugin.module'),
    formatter: (_, __: TableColumn, value: string) => {
      const color = moduleColorMap[value] || '#FFFFFF' // 默认白色
      return <ElTag style={{ backgroundColor: color, color: '#000' }}>{value}</ElTag>
    }
  },
  {
    field: 'isSystem',
    label: t('plugin.isSystem'),
    formatter: (_, __: TableColumn, value: boolean) => {
      return <ElTag type={value ? 'success' : 'warning'}>{value ? 'true' : 'false'}</ElTag>
    }
  },
  {
    field: 'version',
    label: t('plugin.version'),
    minWidth: 100
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
    label: t('plugin.introduction'),
    minWidth: 200
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: '300',
    fixed: 'right',
    formatter: (row, __: TableColumn, _: number) => {
      const handleCommand = (command) => {
        switch (command) {
          case 'reinstall':
            reInstallPluginApi('all', row.hash, row.module)
            break
          case 'recheck':
            reCheckPluginApi('all', row.hash, row.module)
            break
          case 'uninstall':
            uninstallPluginApi('all', row.hash, row.module)
            break
        }
      }
      const retestAndDeleteDropdown = h(
        ElDropdown,
        {
          onCommand: handleCommand
        },
        {
          default: () =>
            h(
              ElButton,
              {
                style: { outline: 'none', boxShadow: 'none' }
              },
              () => [
                t('common.operation'), // 下拉菜单触发按钮文字
                h(
                  ElIcon,
                  {},
                  () => h(ArrowDown) // 向下箭头图标
                )
              ]
            ),
          dropdown: () =>
            h(ElDropdownMenu, null, () => {
              return [
                h(ElDropdownItem, { command: 'reinstall' }, () => t('plugin.reInstall')),
                h(ElDropdownItem, { command: 'recheck' }, () => t('plugin.reCheck')),
                h(ElDropdownItem, { command: 'uninstall' }, () => t('plugin.uninstall'))
              ]
            })
        }
      )
      return (
        <>
          {retestAndDeleteDropdown}
          <BaseButton
            type="warning"
            style={{ marginLeft: '10px' }}
            onClick={() => openLogDialogVisible(row)}
          >
            {t('common.log')}
          </BaseButton>
          <BaseButton type="success" onClick={() => editPlugin(row.id)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton
            type="danger"
            onClick={() => confirmDelete(row.hash, row.module)}
            disabled={row.isSystem}
          >
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

const confirmDelete = async (hash: string, module: string) => {
  ElMessageBox({
    title: 'Delete',
    draggable: true
  }).then(async () => {
    await del(hash, module)
  })
}
const delLoading = ref(false)
const del = async (hash: string, module: string) => {
  delLoading.value = true
  try {
    const res = await deletePluginDataApi([{ hash, module }])
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const delSelect = async () => {
  const elTableExpose = await getElTableExpose()
  const selectedRows = elTableExpose?.getSelectionRows() || []
  const deleteData = selectedRows.map((row) => ({
    hash: row.hash,
    module: row.module
  }))

  delLoading.value = true
  try {
    const res = await deletePluginDataApi(deleteData)
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
onMounted(() => {
  setMaxHeight()
  window.addEventListener('resize', setMaxHeight)
})

const maxHeight = ref(0)

const setMaxHeight = () => {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight
  maxHeight.value = screenHeight * 0.7
}
const logDialogVisible = ref(false)
const closeLogDialogVisible = () => {
  logDialogVisible.value = false
}
const logContent = ref('')
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const logModule = ref('')
const logHash = ref('')
const openLogDialogVisible = async (data) => {
  logModule.value = data.module
  logHash.value = data.hash
  const res = await getPluginLogApi(data.module, data.hash)
  logContent.value = res.logs
  logDialogVisible.value = true
}

const cleanLog = async () => {
  await cleanPluginLogApi(logModule.value, logHash.value)
  logContent.value = ''
}
const userStore = useUserStore()
const uploadHeaders = { Authorization: `${userStore.getToken}` }
const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
}

const handleUploadSuccess = (response) => {
  console.log(response)
  if (response.code === 200) {
    ElMessage.success('Upload succes')
  } else {
    ElMessage.error(response.message)
  }
  if (response.code == 505) {
    localStorage.removeItem('plugin_key')
  }
  getList()
  upload.value?.clearFiles()
}
const handleFileChange = (file, fileList) => {
  if (fileList.length > 0) {
    upload.value!.submit()
  }
}

const keyDialogVisible = ref(false)
const pluginKey = ref('')

const LoadPluginKey = () => {
  const key = localStorage.getItem(`plugin_key`) as string
  if (!key) {
    keyDialogVisible.value = true
  }
  pluginKey.value = key
}

const savePluginKey = () => {
  if (pluginKey.value) {
    localStorage.setItem('plugin_key', pluginKey.value)
    keyDialogVisible.value = false
  }
}

LoadPluginKey()
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
    <ElRow :gutter="16" class="mt-4">
      <ElCol :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="flex flex-wrap gap-3 items-center">
          <BaseButton type="primary" @click="addPlugin">
            {{ t('plugin.new') }}
          </BaseButton>

          <BaseButton type="danger" :loading="delLoading" @click="confirmDeleteSelect">
            {{ t('plugin.delete') }}
          </BaseButton>

          <a href="https://plugin.scope-sentry.top/" target="_blank">
            <BaseButton type="info">
              {{ t('plugin.market') }}
            </BaseButton>
          </a>

          <ElUpload
            ref="upload"
            class="flex items-center"
            :action="'/api/plugin/import?key=' + pluginKey"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            @change="handleFileChange"
          >
            <template #trigger>
              <BaseButton>
                <template #icon>
                  <Icon icon="iconoir:upload" />
                </template>
                {{ t('plugin.import') }}
              </BaseButton>
            </template>
          </ElUpload>
        </div>
      </ElCol>
    </ElRow>
    <div style="position: relative; top: 12px">
      <Table
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
  <Dialog
    v-model="logDialogVisible"
    :title="t('node.log')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    :maxHeight="maxHeight"
  >
    <ElScrollbar ref="scrollbarRef">
      <pre v-if="logContent">{{ logContent }}</pre>
    </ElScrollbar>
    <template #footer>
      <BaseButton @click="cleanLog" type="danger">{{ t('common.cleanLog') }}</BaseButton>
      <BaseButton @click="closeLogDialogVisible">{{ t('common.off') }}</BaseButton>
    </template>
  </Dialog>
  <Dialog
    v-model="keyDialogVisible"
    :title="t('plugin.key')"
    center
    width="30%"
    style="max-width: 400px; height: 200px"
  >
    <div class="flex flex-col gap-2">
      <el-tooltip class="item" effect="dark" :content="t('plugin.keyMsg')" placement="top">
        <ElInput v-model="pluginKey" />
      </el-tooltip>
      <BaseButton @click="savePluginKey" type="primary" class="w-full">确定</BaseButton>
    </div>
  </Dialog>
</template>
