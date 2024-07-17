<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive } from 'vue'
import { ElButton, ElCol, ElInput, ElRow, ElText, ElUpload, ElTooltip } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { Icon } from '@/components/Icon'
import { useIcon } from '@/hooks/web/useIcon'
import { BaseButton } from '@/components/Button'
import { getPocDataApi, getPocContentApi, deletePocDataApi } from '@/api/poc'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { useUserStore } from '@/store/modules/user'
const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const dialogVisible = ref(false)
const search = ref('')
const handleSearch = () => {
  getList()
}
const nodeColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    width: '55'
  },
  {
    field: 'name',
    label: t('poc.pocName'),
    minWidth: 70
  },
  {
    field: 'level',
    label: t('poc.level'),
    minWidth: 50,
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
            <Icon icon="clarity:circle-solid" color={color} size={10} />
          </ElCol>
          <ElCol span={5}>
            <ElText type="info">{flag}</ElText>
          </ElCol>
        </ElRow>
      )
    }
  },
  {
    field: 'time',
    label: t('node.createTime'),
    minWidth: 50
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 30,
    formatter: (row, __: TableColumn, _: number) => {
      console.log(row)
      return (
        <>
          <BaseButton type="primary" onClick={() => edit(row)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton type="danger" onClick={() => del(row)}>
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
    const res = await getPocDataApi(search.value, currentPage.value, pageSize.value)
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

let pocForm = reactive({
  id: '',
  name: '',
  level: 0,
  content: ''
})
const addPoc = async () => {
  pocForm.id = ''
  pocForm.name = ''
  pocForm.level = 1
  pocForm.content = ''
  dialogVisible.value = true
}
const edit = async (data) => {
  pocForm.id = data.id
  pocForm.name = data.name
  pocForm.level = data.level
  const res = await getPocContentApi(pocForm.id)
  pocForm.content = res.data.content
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}
const delLoading = ref(false)
const del = async (data) => {
  delLoading.value = true
  try {
    const res = await deletePocDataApi([data.id])
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
    const res = await deletePocDataApi(ids.value)
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const confirmDelete = async () => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await delSelect()
  }
}
const userStore = useUserStore()
const uploadHeaders = ref({ Authorization: `${userStore.getToken}` })
const uploadicon = useIcon({ icon: 'material-symbols:upload-sharp' })
</script>

<template>
  <ContentWrap>
    <ElRow :gutter="20" style="margin-bottom: 15px">
      <ElCol :span="1.5">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('poc.pocName') }}:</ElText>
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
    <ElRow :gutter="60">
      <ElCol :span="1">
        <div class="mb-10px">
          <ElButton type="primary" @click="addPoc">{{ t('common.new') }}</ElButton>
        </div>
      </ElCol>
      <ElCol :span="1">
        <div class="mb-10px">
          <BaseButton type="danger" :loading="delLoading" @click="confirmDelete">
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </ElCol>
      <ElCol :span="1">
        <ElTooltip :content="t('common.uploadMsg')" placement="top">
          <ElUpload class="upload-demo" action="/api/poc/data/import" :headers="uploadHeaders">
            <ElButton :icon="uploadicon">{{ t('common.import') }}</ElButton>
          </ElUpload>
        </ElTooltip>
      </ElCol>
    </ElRow>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="nodeColums"
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
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="pocForm.id ? $t('common.edit') : $t('common.new')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    :maxHeight="800"
  >
    <Detail :closeDialog="closeDialog" :pocForm="pocForm" :getList="getList" />
  </Dialog>
</template>
