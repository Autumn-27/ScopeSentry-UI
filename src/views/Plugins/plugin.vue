<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, onMounted, h, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import {
  ElButton,
  ElCard,
  ElCol,
  ElDrawer,
  ElInput,
  ElRow,
  ElSelect,
  ElOption,
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
  ElIcon,
  ElBadge
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import {
  checkKeyApi,
  cleanAllPluginLogApi,
  cleanPluginLogApi,
  deletePluginDataApi,
  getPluginDataApi,
  getPluginLogApi,
  getLocalPluginListApi,
  getRemotePluginMarketApi,
  getPluginExportDataApi,
  importPluginApi,
  reCheckPluginApi,
  reInstallPluginApi,
  uninstallPluginApi
} from '@/api/plugins'
import type { RemotePluginData, pluginData } from '@/api/plugins/types'
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
          <BaseButton
            type="info"
            style={{ marginLeft: '10px' }}
            onClick={() => confirmCleanLog(row.hash, row.module)}
          >
            {t('common.cleanLog')}
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
  URLSecurity: '#FFE4BA', // 浅米色
  PassiveScan: '#A2DFF7'
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

const confirmCleanLog = async (hash: string, module: string) => {
  ElMessageBox({
    title: 'Clean Log',
    message: 'Are you sure you want to clean the logs?',
    draggable: true
  }).then(async () => {
    await cleanPluginLogApi(module, hash)
  })
}

const confirmCleanAllLog = async () => {
  ElMessageBox({
    title: 'Clean All Plugin Logs',
    message: 'Are you sure you want to clean all plugin logs?',
    draggable: true
  }).then(async () => {
    await cleanAllPluginLogApi()
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
  // 页面加载时自动查询远程插件列表，用于显示角标
  loadRemotePlugins()
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
  logContent.value = res.data.data
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

const savePluginKey = async () => {
  if (pluginKey.value) {
    const res = await checkKeyApi(pluginKey.value)
    if (res.code == 200) {
      localStorage.setItem('plugin_key', pluginKey.value)
      keyDialogVisible.value = false
    }
  }
}

const handlePluginKeyChange = () => {
  if (pluginKey.value) {
    localStorage.setItem('plugin_key', pluginKey.value)
  } else {
    localStorage.removeItem('plugin_key')
  }
}

// 插件市场相关
const marketDrawerVisible = ref(false)
const remotePluginList = ref<RemotePluginData[]>([])
const marketLoading = ref(false)
const marketSearch = ref('')
const selectedModule = ref('')
const selectedPriceStatus = ref<number | string>('')
const selectedInstallStatus = ref<string>('')

// 模块选项
const moduleOptions = [
  { label: 'TargetHandler', value: 'TargetHandler' },
  { label: 'SubdomainScan', value: 'SubdomainScan' },
  { label: 'SubdomainSecurity', value: 'SubdomainSecurity' },
  { label: 'PortScanPreparation', value: 'PortScanPreparation' },
  { label: 'PortScan', value: 'PortScan' },
  { label: 'AssetMapping', value: 'AssetMapping' },
  { label: 'URLScan', value: 'URLScan' },
  { label: 'WebCrawler', value: 'WebCrawler' },
  { label: 'DirScan', value: 'DirScan' },
  { label: 'VulnerabilityScan', value: 'VulnerabilityScan' },
  { label: 'AssetHandle', value: 'AssetHandle' },
  { label: 'PortFingerprint', value: 'PortFingerprint' },
  { label: 'URLSecurity', value: 'URLSecurity' },
  { label: 'PassiveScan', value: 'PassiveScan' }
]

// 模块渐变背景
const moduleBackgrounds: { [key: string]: string } = {
  TargetHandler: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
  SubdomainScan: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  SubdomainSecurity: 'linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%)',
  PortScanPreparation: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
  PortScan:
    'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
  PortFingerprint: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  AssetMapping: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  AssetHandle: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
  URLScan: 'linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)',
  WebCrawler: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  URLSecurity: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
  DirScan: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  VulnerabilityScan: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
  PassiveScan: 'linear-gradient(to top, #e0c3fc 0%, #8ec5fc 100%)'
}

const openMarketDialog = () => {
  marketDrawerVisible.value = true
  // 如果列表为空，则重新加载（防止首次打开时数据未加载）
  if (remotePluginList.value.length === 0) {
    loadRemotePlugins()
  }
}

const closeMarketDialog = () => {
  marketDrawerVisible.value = false
  resetFilters()
}

const resetFilters = () => {
  marketSearch.value = ''
  selectedModule.value = ''
  selectedPriceStatus.value = ''
  selectedInstallStatus.value = ''
}

const loadRemotePlugins = async () => {
  marketLoading.value = true
  try {
    // 同时请求本地和远程接口
    const [localRes, remoteRes] = await Promise.all([
      getLocalPluginListApi(),
      getRemotePluginMarketApi()
    ])

    // 处理本地插件数据，创建 hash 映射
    const localPluginsMap = new Map<string, pluginData>()
    if (localRes.code === 200 && localRes.data?.list) {
      localRes.data.list.forEach((plugin: pluginData) => {
        localPluginsMap.set(plugin.hash, plugin)
      })
    }

    // 处理远程插件数据
    let remotePlugins: RemotePluginData[] = []
    if (remoteRes.status === '200' && remoteRes.data?.data) {
      remotePlugins = remoteRes.data.data.map((plugin: any) => {
        const localPlugin = localPluginsMap.get(plugin.hash)
        const isInstalled = !!localPlugin
        let needUpdate = false

        // 判断是否需要更新：如果已安装且版本不同，则需要更新
        if (isInstalled && localPlugin) {
          const localVersion = localPlugin.version || ''
          const remoteVersion = plugin.version || ''
          needUpdate =
            localVersion !== remoteVersion && remoteVersion !== null && remoteVersion !== ''
        }

        // 解析 tags，判断是否为系统插件
        let isSystem = false
        if (plugin.tags) {
          const tags = plugin.tags.split(',').map((tag: string) => tag.trim())
          isSystem = tags.includes('内置')
        }

        return {
          id: plugin.id,
          name: plugin.name?.trim() || plugin.hash || `插件-${plugin.id}`,
          module: plugin.module || '',
          priceStatus: plugin.priceStatus,
          price: plugin.price,
          hash: plugin.hash || '',
          introduction: plugin.introduction || '',
          version: plugin.version || '',
          createTime: plugin.createTime || '',
          username: plugin.username || '',
          isInstalled,
          needUpdate,
          isSystem
        }
      })
    }

    remotePluginList.value = remotePlugins
  } catch (error) {
    console.error('Error loading plugins:', error)
    ElMessage.error('获取插件列表失败')
  } finally {
    marketLoading.value = false
  }
}

const handleInstallPlugin = async (plugin: RemotePluginData) => {
  try {
    const action =
      plugin.isInstalled && plugin.needUpdate ? t('plugin.update') : t('plugin.install')

    // 确保插件名称不为空 - 检查多种可能的情况
    let pluginName = '未知插件'
    if (plugin && plugin.name) {
      const trimmedName = String(plugin.name).trim()
      if (trimmedName) {
        pluginName = trimmedName
      }
    }

    // 使用 Vue i18n 的参数化功能
    const confirmMessage = t('plugin.confirmInstall', {
      action,
      name: pluginName
    })

    await ElMessageBox.confirm(confirmMessage, t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'info'
    })

    // 显示加载提示
    const loadingMessage = ElMessage({
      message: `${action}中...`,
      type: 'info',
      duration: 0,
      showClose: false
    })

    try {
      // 第一步：获取插件导出数据
      const exportRes = await getPluginExportDataApi(plugin.hash)

      if (exportRes.status !== '200' || !exportRes.data) {
        loadingMessage.close()
        ElMessage.error(exportRes.message || '获取插件数据失败')
        return
      }

      const { json, source } = exportRes.data

      // 第二步：导入插件
      const importRes = await importPluginApi(
        json || '',
        source || '',
        plugin.isSystem || false,
        pluginKey.value || ''
      )

      loadingMessage.close()

      if (importRes.code === 200) {
        const successMessage = t('plugin.installSuccess', { action })
        ElMessage.success(successMessage)
        // 刷新本地插件列表和远程插件列表
        getList()
        loadRemotePlugins()
      } else {
        ElMessage.error(importRes.message || t('plugin.installFailed'))
      }
    } catch (error: any) {
      loadingMessage.close()
      console.error('Error installing plugin:', error)
      ElMessage.error(error?.response?.data?.message || error?.message || t('plugin.installFailed'))
    }
  } catch (error: any) {
    // 用户取消操作
    if (error !== 'cancel') {
      console.error('Error:', error)
    }
  }
}

// 计算待处理插件数量（未安装或需要更新）
const pendingPluginsCount = computed(() => {
  return remotePluginList.value.filter((plugin) => !plugin.isInstalled || plugin.needUpdate).length
})

const filteredRemotePlugins = computed(() => {
  let filtered = remotePluginList.value

  // 搜索筛选
  if (marketSearch.value) {
    const searchLower = marketSearch.value.toLowerCase()
    filtered = filtered.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.module.toLowerCase().includes(searchLower) ||
        plugin.introduction.toLowerCase().includes(searchLower) ||
        plugin.username.toLowerCase().includes(searchLower)
    )
  }

  // 模块筛选
  if (selectedModule.value) {
    filtered = filtered.filter((plugin) => plugin.module === selectedModule.value)
  }

  // 价格状态筛选
  if (selectedPriceStatus.value !== '') {
    if (selectedPriceStatus.value === 'free') {
      filtered = filtered.filter((plugin) => plugin.priceStatus === 0)
    } else if (selectedPriceStatus.value === 'paid') {
      filtered = filtered.filter((plugin) => plugin.priceStatus !== 0)
    }
  }

  // 安装状态筛选
  if (selectedInstallStatus.value) {
    if (selectedInstallStatus.value === 'installed') {
      filtered = filtered.filter((plugin) => plugin.isInstalled && !plugin.needUpdate)
    } else if (selectedInstallStatus.value === 'needUpdate') {
      filtered = filtered.filter((plugin) => plugin.isInstalled && plugin.needUpdate)
    } else if (selectedInstallStatus.value === 'notInstalled') {
      filtered = filtered.filter((plugin) => !plugin.isInstalled)
    }
  }

  return filtered
})

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
      <ElCol :span="1" style="position: relative; left: 32px">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('plugin.key') }}:</ElText>
      </ElCol>
      <ElCol :span="5" style="position: relative; left: 32px">
        <ElInput
          v-model="pluginKey"
          :placeholder="t('plugin.key')"
          style="height: 38px"
          @blur="handlePluginKeyChange"
        />
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

          <ElBadge :value="pendingPluginsCount" :hidden="pendingPluginsCount === 0" :max="99">
            <BaseButton type="success" @click="openMarketDialog">
              {{ t('plugin.market') }}
            </BaseButton>
          </ElBadge>

          <BaseButton type="warning" @click="confirmCleanAllLog">
            {{ t('common.cleanAllLog') }}
          </BaseButton>

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
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <template #title>
      <div style="display: flex; align-items: center; gap: 16px; width: 100%">
        <span style="font-weight: 500; white-space: nowrap">{{ DialogTitle }}</span>
        <span style="color: #f56c6c; font-size: 12px; font-weight: normal; line-height: 1.4">
          {{ t('plugin.parameterConfigTip') }}
        </span>
      </div>
    </template>
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
      <BaseButton @click="savePluginKey" type="primary" class="w-full">Save</BaseButton>
    </div>
  </Dialog>
  <ElDrawer
    v-model="marketDrawerVisible"
    :title="t('plugin.market')"
    direction="rtl"
    size="90%"
    :close-on-click-modal="false"
  >
    <div class="flex flex-col gap-4">
      <ElRow :gutter="16">
        <ElCol :span="6">
          <ElInput
            v-model="marketSearch"
            :placeholder="t('common.inputText')"
            clearable
            style="height: 38px"
          >
            <template #prefix>
              <Icon icon="iconoir:search" />
            </template>
          </ElInput>
        </ElCol>
        <ElCol :span="4">
          <ElSelect
            v-model="selectedModule"
            :placeholder="t('plugin.module')"
            clearable
            style="width: 100%; height: 38px"
          >
            <ElOption
              v-for="option in moduleOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElCol>
        <ElCol :span="4">
          <ElSelect
            v-model="selectedPriceStatus"
            :placeholder="t('plugin.priceStatus')"
            clearable
            style="width: 100%; height: 38px"
          >
            <ElOption :label="t('plugin.free')" value="free" />
            <ElOption :label="t('plugin.paid')" value="paid" />
          </ElSelect>
        </ElCol>
        <ElCol :span="4">
          <ElSelect
            v-model="selectedInstallStatus"
            :placeholder="t('plugin.installStatus')"
            clearable
            style="width: 100%; height: 38px"
          >
            <ElOption :label="t('plugin.notInstalled')" value="notInstalled" />
            <ElOption :label="t('plugin.installed')" value="installed" />
            <ElOption :label="t('plugin.needUpdate')" value="needUpdate" />
          </ElSelect>
        </ElCol>
        <ElCol :span="3">
          <BaseButton type="primary" @click="loadRemotePlugins" :loading="marketLoading">
            {{ t('plugin.refresh') }}
          </BaseButton>
        </ElCol>
        <ElCol :span="3">
          <BaseButton @click="resetFilters">
            {{ t('common.reset') }}
          </BaseButton>
        </ElCol>
      </ElRow>
      <div v-loading="marketLoading" class="plugin-market-container">
        <ElRow :gutter="20">
          <ElCol
            v-for="plugin in filteredRemotePlugins"
            :key="plugin.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <ElCard
              class="plugin-market-card"
              :style="{ width: '100%', position: 'relative', marginBottom: '20px' }"
              shadow="hover"
              :body-style="{ padding: '0' }"
            >
              <div class="plugin-card-cover">
                <div
                  :style="{
                    height: '150px',
                    background:
                      moduleBackgrounds[plugin.module] || 'linear-gradient(to top, #e7f0fd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }"
                >
                  <div
                    :style="{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#333',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      textAlign: 'center'
                    }"
                  >
                    {{ plugin.name }}
                  </div>
                  <ElTag
                    :type="plugin.priceStatus === 0 ? 'success' : 'danger'"
                    :style="{ position: 'absolute', bottom: '8px', left: '8px' }"
                  >
                    {{ plugin.priceStatus === 0 ? t('plugin.free') : t('plugin.paid') }}
                  </ElTag>
                  <ElTag type="info" :style="{ position: 'absolute', bottom: '8px', right: '8px' }">
                    {{
                      moduleOptions.find((option) => option.value === plugin.module)?.label ||
                      t('plugin.unknownModule')
                    }}
                  </ElTag>
                </div>
              </div>
              <div class="plugin-card-content">
                <div class="plugin-info-item">
                  <span class="label">{{ t('plugin.version') }}：</span>
                  <span class="value">{{ plugin.version || 'N/A' }}</span>
                </div>
                <div class="plugin-info-item">
                  <span class="label">{{ t('plugin.author') }}：</span>
                  <span class="value">{{ plugin.username }}</span>
                </div>
                <div class="plugin-info-item">
                  <span class="label">{{ t('plugin.createTime') }}：</span>
                  <span class="value">{{ plugin.createTime }}</span>
                </div>
                <div class="plugin-info-item introduction">
                  <span class="label">{{ t('plugin.introduction') }}：</span>
                  <span class="value">{{ plugin.introduction || t('plugin.noIntroduction') }}</span>
                </div>
                <div class="plugin-status">
                  <ElTag
                    v-if="plugin.isInstalled && plugin.needUpdate"
                    type="warning"
                    style="margin-bottom: 10px"
                  >
                    {{ t('plugin.needUpdate') }}
                  </ElTag>
                  <ElTag v-else-if="plugin.isInstalled" type="success" style="margin-bottom: 10px">
                    {{ t('plugin.installed') }}
                  </ElTag>
                  <ElTag v-else style="margin-bottom: 10px">{{ t('plugin.notInstalled') }}</ElTag>
                </div>
                <div class="plugin-actions">
                  <BaseButton
                    v-if="plugin.isInstalled && plugin.needUpdate"
                    type="warning"
                    style="width: 100%"
                    @click="handleInstallPlugin(plugin)"
                  >
                    {{ t('plugin.update') }}
                  </BaseButton>
                  <BaseButton
                    v-else-if="plugin.isInstalled"
                    type="info"
                    disabled
                    style="width: 100%"
                  >
                    {{ t('plugin.installed') }}
                  </BaseButton>
                  <BaseButton
                    v-else
                    type="primary"
                    style="width: 100%"
                    @click="handleInstallPlugin(plugin)"
                  >
                    {{ t('plugin.install') }}
                  </BaseButton>
                </div>
              </div>
            </ElCard>
          </ElCol>
        </ElRow>
        <div v-if="filteredRemotePlugins.length === 0" class="empty-state">
          <p>{{ t('plugin.noPluginData') }}</p>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<style scoped lang="less">
.plugin-market-container {
  min-height: 400px;
  padding: 10px 0;
}

.plugin-market-card {
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__body) {
    border-radius: 12px;
    overflow: hidden;
    padding: 0;
  }
}

.plugin-card-cover {
  width: 100%;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.plugin-card-content {
  padding: 15px;
}

.plugin-info-item {
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.6;

  .label {
    font-weight: 600;
    color: #606266;
    margin-right: 5px;
  }

  .value {
    color: #303133;
  }

  &.introduction {
    .value {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #909399;
    }
  }
}

.plugin-status {
  margin: 15px 0;
}

.plugin-actions {
  margin-top: 15px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
  font-size: 16px;
}

.plugin-market-card {
  :deep(.el-card__body) {
    padding: 0;
  }
}
</style>
